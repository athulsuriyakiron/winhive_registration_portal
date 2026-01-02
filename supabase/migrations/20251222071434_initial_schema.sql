-- Location: supabase/migrations/20251222071434_initial_schema.sql
-- Schema Analysis: Fresh project - no existing tables
-- Integration Type: Complete new schema
-- Module: Authentication + Student Registration System

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('student', 'college_admin', 'admin');
CREATE TYPE public.verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE public.membership_tier AS ENUM ('free', 'premium', 'enterprise');
CREATE TYPE public.student_status AS ENUM ('active', 'inactive', 'graduated');

-- 2. Core User Profiles Table (Critical intermediary for PostgREST)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role public.user_role DEFAULT 'student'::public.user_role,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Colleges/Institutions Table
CREATE TABLE public.colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    accreditation TEXT,
    website_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    admin_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    verification_status public.verification_status DEFAULT 'pending'::public.verification_status,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Students Registration Table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
    enrollment_number TEXT UNIQUE,
    course TEXT NOT NULL,
    branch TEXT,
    year_of_study INTEGER,
    graduation_year INTEGER,
    cgpa DECIMAL(3,2),
    date_of_birth DATE,
    gender TEXT,
    student_status public.student_status DEFAULT 'active'::public.student_status,
    verification_status public.verification_status DEFAULT 'pending'::public.verification_status,
    skills TEXT[],
    resume_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Memberships Table
CREATE TABLE public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    tier public.membership_tier DEFAULT 'free'::public.membership_tier,
    start_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    payment_id TEXT,
    amount DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Career Preferences Table
CREATE TABLE public.career_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    preferred_industries TEXT[],
    preferred_locations TEXT[],
    expected_salary_min DECIMAL(10,2),
    expected_salary_max DECIMAL(10,2),
    job_types TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_colleges_code ON public.colleges(code);
CREATE INDEX idx_colleges_verification_status ON public.colleges(verification_status);
CREATE INDEX idx_students_user_id ON public.students(user_id);
CREATE INDEX idx_students_college_id ON public.students(college_id);
CREATE INDEX idx_students_enrollment ON public.students(enrollment_number);
CREATE INDEX idx_students_verification_status ON public.students(verification_status);
CREATE INDEX idx_memberships_user_id ON public.memberships(user_id);
CREATE INDEX idx_memberships_tier ON public.memberships(tier);
CREATE INDEX idx_career_preferences_student_id ON public.career_preferences(student_id);

-- 8. Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_preferences ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies

-- Pattern 1: Core user table - Simple ownership
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Colleges - Admin can manage, everyone can read verified
CREATE POLICY "public_read_verified_colleges"
ON public.colleges
FOR SELECT
TO public
USING (verification_status = 'verified'::public.verification_status);

CREATE POLICY "college_admins_manage_own_colleges"
ON public.colleges
FOR ALL
TO authenticated
USING (admin_id = auth.uid())
WITH CHECK (admin_id = auth.uid());

-- Students - Pattern 2: Simple user ownership
CREATE POLICY "users_manage_own_students"
ON public.students
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Memberships - Pattern 2: Simple user ownership
CREATE POLICY "users_manage_own_memberships"
ON public.memberships
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Career Preferences - Students can manage their own
CREATE POLICY "students_manage_own_career_preferences"
ON public.career_preferences
FOR ALL
TO authenticated
USING (
    student_id IN (
        SELECT id FROM public.students WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    student_id IN (
        SELECT id FROM public.students WHERE user_id = auth.uid()
    )
);

-- 10. Trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, phone, role, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 11. Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_colleges
    BEFORE UPDATE ON public.colleges
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_students
    BEFORE UPDATE ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_memberships
    BEFORE UPDATE ON public.memberships
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 12. Mock Data for Testing
DO $$
DECLARE
    student_user_id UUID := gen_random_uuid();
    college_admin_id UUID := gen_random_uuid();
    college_uuid UUID := gen_random_uuid();
    student_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (student_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'student@example.com', crypt('student123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Rahul Kumar", "phone": "9876543210", "role": "student"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (college_admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@iitmadras.ac.in', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Priya Sharma", "phone": "9876543211", "role": "college_admin"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- College data
    INSERT INTO public.colleges (id, name, code, address, city, state, country, accreditation, website_url, contact_email, contact_phone, admin_id, verification_status)
    VALUES
        (college_uuid, 'Indian Institute of Technology Madras', 'IITM', 'Sardar Patel Road', 'Chennai', 'Tamil Nadu', 'India', 'NAAC A++', 'https://www.iitm.ac.in', 'info@iitm.ac.in', '044-22574000', college_admin_id, 'verified'::public.verification_status);

    -- Student registration data
    INSERT INTO public.students (id, user_id, college_id, enrollment_number, course, branch, year_of_study, graduation_year, cgpa, date_of_birth, gender, verification_status, skills)
    VALUES
        (student_uuid, student_user_id, college_uuid, 'IITM2021CS001', 'B.Tech', 'Computer Science', 4, 2025, 8.75, '2003-05-15', 'Male', 'verified'::public.verification_status, ARRAY['React', 'Node.js', 'Python', 'Machine Learning']);

    -- Membership data
    INSERT INTO public.memberships (user_id, tier, end_date, amount)
    VALUES
        (student_user_id, 'free'::public.membership_tier, now() + interval '1 year', 0.00);

    -- Career preferences
    INSERT INTO public.career_preferences (student_id, preferred_industries, preferred_locations, expected_salary_min, expected_salary_max, job_types)
    VALUES
        (student_uuid, ARRAY['Technology', 'Finance', 'Consulting'], ARRAY['Bangalore', 'Mumbai', 'Hyderabad'], 800000.00, 1500000.00, ARRAY['Full-time', 'Internship']);
END $$;