-- Location: supabase/migrations/20251222172933_notifications.sql
-- Schema Analysis: Existing tables include user_profiles, students, allocation_history
-- Integration Type: NEW_MODULE - Adding notification system
-- Dependencies: user_profiles, students, allocation_history

-- 1. Create notification type enum
CREATE TYPE public.notification_type AS ENUM (
    'verification_update',
    'allocation_change',
    'event_alert',
    'system_message'
);

CREATE TYPE public.notification_priority AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);

-- 2. Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    notification_type public.notification_type NOT NULL,
    priority public.notification_priority DEFAULT 'medium'::public.notification_priority,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create indexes for efficient querying
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_type ON public.notifications(notification_type);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- 4. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies using Pattern 2 (Simple User Ownership)
CREATE POLICY "users_manage_own_notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 6. Create function for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.handle_notification_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    IF NEW.is_read = true AND OLD.is_read = false THEN
        NEW.read_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$;

-- 7. Create trigger for updated_at
CREATE TRIGGER set_notification_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_notification_updated_at();

-- 8. Create function to automatically generate notifications for verification changes
CREATE OR REPLACE FUNCTION public.notify_verification_status_change()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $func$
DECLARE
    v_user_id UUID;
    v_title TEXT;
    v_message TEXT;
    v_priority public.notification_priority;
BEGIN
    -- Get user_id from student record
    SELECT user_id INTO v_user_id FROM public.students WHERE id = NEW.id;
    
    -- Set notification details based on verification status
    IF NEW.verification_status = 'verified' THEN
        v_title := 'Verification Approved';
        v_message := 'Your student verification has been approved. You now have full access to all features.';
        v_priority := 'high'::public.notification_priority;
    ELSIF NEW.verification_status = 'rejected' THEN
        v_title := 'Verification Requires Attention';
        v_message := 'Your student verification needs additional information. Please review and resubmit.';
        v_priority := 'urgent'::public.notification_priority;
    ELSE
        RETURN NEW;
    END IF;
    
    -- Insert notification
    INSERT INTO public.notifications (
        user_id,
        notification_type,
        priority,
        title,
        message,
        action_url,
        metadata
    ) VALUES (
        v_user_id,
        'verification_update'::public.notification_type,
        v_priority,
        v_title,
        v_message,
        '/student-verification-pending',
        jsonb_build_object(
            'student_id', NEW.id,
            'previous_status', OLD.verification_status,
            'new_status', NEW.verification_status
        )
    );
    
    RETURN NEW;
END;
$func$;

-- 9. Create trigger for verification status changes
CREATE TRIGGER notify_on_verification_change
    AFTER UPDATE OF verification_status ON public.students
    FOR EACH ROW
    WHEN (OLD.verification_status IS DISTINCT FROM NEW.verification_status)
    EXECUTE FUNCTION public.notify_verification_status_change();

-- 10. Create function to notify on allocation changes
CREATE OR REPLACE FUNCTION public.notify_allocation_change()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $func$
DECLARE
    v_user_id UUID;
    v_title TEXT;
    v_message TEXT;
    v_college_name TEXT;
BEGIN
    -- Get college admin user_id
    SELECT up.id, c.name INTO v_user_id, v_college_name
    FROM public.free_account_allocations faa
    JOIN public.colleges c ON faa.college_id = c.id
    JOIN public.user_profiles up ON c.admin_id = up.id
    WHERE faa.id = NEW.allocation_id;
    
    v_title := 'Account Allocation Updated';
    v_message := format('Free account allocation for %s has been updated. Previous: %s, New: %s',
                        v_college_name, OLD.previous_allocated, NEW.new_allocated);
    
    -- Insert notification
    INSERT INTO public.notifications (
        user_id,
        notification_type,
        priority,
        title,
        message,
        action_url,
        metadata
    ) VALUES (
        v_user_id,
        'allocation_change'::public.notification_type,
        'medium'::public.notification_priority,
        v_title,
        v_message,
        '/free-account-allocation-tracker',
        jsonb_build_object(
            'allocation_id', NEW.allocation_id,
            'action_type', NEW.action_type,
            'previous_allocated', OLD.previous_allocated,
            'new_allocated', NEW.new_allocated
        )
    );
    
    RETURN NEW;
END;
$func$;

-- 11. Create trigger for allocation history changes
CREATE TRIGGER notify_on_allocation_change
    AFTER INSERT ON public.allocation_history
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_allocation_change();

-- 12. Create helper function to get unread count
CREATE OR REPLACE FUNCTION public.get_unread_notification_count(user_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT COUNT(*)::INTEGER
FROM public.notifications
WHERE user_id = user_uuid
AND is_read = false
AND is_archived = false;
$$;

-- 13. Create sample notifications for existing users
DO $$
DECLARE
    v_student_user_id UUID;
    v_admin_user_id UUID;
BEGIN
    -- Get a student user
    SELECT user_id INTO v_student_user_id
    FROM public.students
    LIMIT 1;
    
    -- Get a college admin user
    SELECT admin_id INTO v_admin_user_id
    FROM public.colleges
    LIMIT 1;
    
    -- Create sample notifications if users exist
    IF v_student_user_id IS NOT NULL THEN
        INSERT INTO public.notifications (
            user_id,
            notification_type,
            priority,
            title,
            message,
            action_url,
            is_read
        ) VALUES
            (v_student_user_id, 'verification_update'::public.notification_type, 'high'::public.notification_priority,
             'Verification In Progress', 'Your student verification is being reviewed by the college administration.',
             '/student-verification-pending', false),
            (v_student_user_id, 'event_alert'::public.notification_type, 'medium'::public.notification_priority,
             'Upcoming Career Fair', 'Join us for the annual career fair on December 28th. Register now to secure your spot.',
             '/student-dashboard', true),
            (v_student_user_id, 'system_message'::public.notification_type, 'low'::public.notification_priority,
             'Profile Completion', 'Complete your career preferences to get personalized job recommendations.',
             '/student-career-preferences', false);
    END IF;
    
    IF v_admin_user_id IS NOT NULL THEN
        INSERT INTO public.notifications (
            user_id,
            notification_type,
            priority,
            title,
            message,
            action_url,
            is_read
        ) VALUES
            (v_admin_user_id, 'allocation_change'::public.notification_type, 'urgent'::public.notification_priority,
             'Low Account Balance', 'Your free account allocation is running low. Only 5 accounts remaining.',
             '/free-account-allocation-tracker', false),
            (v_admin_user_id, 'verification_update'::public.notification_type, 'medium'::public.notification_priority,
             'Pending Verifications', '3 student verifications are pending your review.',
             '/student-verification-management', false);
    END IF;
END $$;