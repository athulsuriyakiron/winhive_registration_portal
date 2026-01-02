-- Location: supabase/migrations/20251222073416_free_account_allocations.sql
-- Schema Analysis: Existing student management system with colleges, students, memberships
-- Integration Type: Extension - Adding free account allocation tracking
-- Dependencies: colleges table

-- Create allocation status enum
CREATE TYPE public.allocation_status AS ENUM ('active', 'depleted', 'expired');

-- Create free account allocations table
CREATE TABLE public.free_account_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    course TEXT NOT NULL,
    batch_year INTEGER NOT NULL,
    total_quota INTEGER NOT NULL DEFAULT 0,
    allocated_count INTEGER NOT NULL DEFAULT 0,
    available_count INTEGER NOT NULL DEFAULT 0,
    allocation_status public.allocation_status DEFAULT 'active'::public.allocation_status,
    renewal_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES public.user_profiles(id),
    CONSTRAINT valid_allocation_counts CHECK (allocated_count <= total_quota AND available_count >= 0)
);

-- Create allocation history table for audit trail
CREATE TABLE public.allocation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    allocation_id UUID NOT NULL REFERENCES public.free_account_allocations(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    previous_allocated INTEGER,
    new_allocated INTEGER,
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    performed_by UUID REFERENCES public.user_profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_allocations_college_id ON public.free_account_allocations(college_id);
CREATE INDEX idx_allocations_course_batch ON public.free_account_allocations(course, batch_year);
CREATE INDEX idx_allocations_status ON public.free_account_allocations(allocation_status);
CREATE INDEX idx_allocation_history_allocation_id ON public.allocation_history(allocation_id);
CREATE INDEX idx_allocation_history_student_id ON public.allocation_history(student_id);

-- Enable RLS
ALTER TABLE public.free_account_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: College admins can manage their college's allocations
CREATE POLICY "college_admins_manage_allocations"
ON public.free_account_allocations
FOR ALL
TO authenticated
USING (
    college_id IN (
        SELECT c.id FROM public.colleges c WHERE c.admin_id = auth.uid()
    )
)
WITH CHECK (
    college_id IN (
        SELECT c.id FROM public.colleges c WHERE c.admin_id = auth.uid()
    )
);

-- RLS Policy: College admins can view allocation history for their colleges
CREATE POLICY "college_admins_view_allocation_history"
ON public.allocation_history
FOR SELECT
TO authenticated
USING (
    allocation_id IN (
        SELECT fa.id FROM public.free_account_allocations fa
        JOIN public.colleges c ON fa.college_id = c.id
        WHERE c.admin_id = auth.uid()
    )
);

-- RLS Policy: System can create allocation history
CREATE POLICY "system_create_allocation_history"
ON public.allocation_history
FOR INSERT
TO authenticated
WITH CHECK (performed_by = auth.uid());

-- Function to automatically update available_count
CREATE OR REPLACE FUNCTION public.update_allocation_available_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    NEW.available_count := NEW.total_quota - NEW.allocated_count;
    
    -- Update status based on available count
    IF NEW.available_count <= 0 THEN
        NEW.allocation_status := 'depleted'::public.allocation_status;
    ELSIF NEW.renewal_date IS NOT NULL AND NEW.renewal_date < CURRENT_TIMESTAMP THEN
        NEW.allocation_status := 'expired'::public.allocation_status;
    ELSE
        NEW.allocation_status := 'active'::public.allocation_status;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger to update available count before insert/update
CREATE TRIGGER update_available_count_trigger
BEFORE INSERT OR UPDATE ON public.free_account_allocations
FOR EACH ROW
EXECUTE FUNCTION public.update_allocation_available_count();

-- Trigger for updated_at timestamp
CREATE TRIGGER set_updated_at_allocations
BEFORE UPDATE ON public.free_account_allocations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Function to get allocation statistics by college
CREATE OR REPLACE FUNCTION public.get_college_allocation_stats(college_uuid UUID)
RETURNS TABLE(
    total_quota BIGINT,
    total_allocated BIGINT,
    total_available BIGINT,
    active_allocations BIGINT,
    depleted_allocations BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT
        COALESCE(SUM(fa.total_quota), 0) as total_quota,
        COALESCE(SUM(fa.allocated_count), 0) as total_allocated,
        COALESCE(SUM(fa.available_count), 0) as total_available,
        COUNT(*) FILTER (WHERE fa.allocation_status = 'active') as active_allocations,
        COUNT(*) FILTER (WHERE fa.allocation_status = 'depleted') as depleted_allocations
    FROM public.free_account_allocations fa
    WHERE fa.college_id = college_uuid;
$$;

-- Mock data for testing
DO $$
DECLARE
    existing_college_id UUID;
    existing_admin_id UUID;
    allocation1_id UUID := gen_random_uuid();
    allocation2_id UUID := gen_random_uuid();
    allocation3_id UUID := gen_random_uuid();
BEGIN
    -- Get existing college and admin IDs
    SELECT c.id, c.admin_id INTO existing_college_id, existing_admin_id
    FROM public.colleges c
    LIMIT 1;
    
    -- Only create mock data if college exists
    IF existing_college_id IS NOT NULL THEN
        -- Create sample allocations
        INSERT INTO public.free_account_allocations 
            (id, college_id, course, batch_year, total_quota, allocated_count, created_by, renewal_date, notes)
        VALUES
            (allocation1_id, existing_college_id, 'B.Tech Computer Science', 2025, 100, 75, existing_admin_id, '2025-12-31'::TIMESTAMPTZ, 'Final year batch allocation for 2025'),
            (allocation2_id, existing_college_id, 'B.Tech Electrical Engineering', 2025, 80, 45, existing_admin_id, '2025-12-31'::TIMESTAMPTZ, 'Final year EE batch allocation'),
            (allocation3_id, existing_college_id, 'M.Tech Computer Science', 2025, 50, 50, existing_admin_id, '2025-12-31'::TIMESTAMPTZ, 'Masters program allocation - fully allocated');
        
        -- Create allocation history entries
        INSERT INTO public.allocation_history 
            (allocation_id, action_type, previous_allocated, new_allocated, performed_by, notes)
        VALUES
            (allocation1_id, 'INITIAL_ALLOCATION', 0, 75, existing_admin_id, 'Initial allocation for CS batch'),
            (allocation2_id, 'INITIAL_ALLOCATION', 0, 45, existing_admin_id, 'Initial allocation for EE batch'),
            (allocation3_id, 'QUOTA_EXHAUSTED', 45, 50, existing_admin_id, 'Final 5 accounts allocated');
    END IF;
END $$;