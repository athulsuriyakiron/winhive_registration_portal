-- Location: supabase/migrations/20251222170249_success_stories.sql
-- Schema Analysis: Existing tables include students, user_profiles, colleges
-- Integration Type: NEW_MODULE - Adding success stories functionality
-- Dependencies: students, colleges, user_profiles tables

-- Create success_stories table
CREATE TABLE public.success_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    story_content TEXT NOT NULL,
    video_url TEXT,
    before_role TEXT,
    after_role TEXT NOT NULL,
    before_salary INTEGER,
    after_salary INTEGER NOT NULL,
    company_name TEXT NOT NULL,
    company_logo_url TEXT,
    industry TEXT,
    placement_year INTEGER,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_success_stories_student_id ON public.success_stories(student_id);
CREATE INDEX idx_success_stories_industry ON public.success_stories(industry);
CREATE INDEX idx_success_stories_placement_year ON public.success_stories(placement_year);
CREATE INDEX idx_success_stories_is_published ON public.success_stories(is_published);
CREATE INDEX idx_success_stories_is_featured ON public.success_stories(is_featured);

-- Enable RLS
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can read published stories
CREATE POLICY "public_read_published_stories"
ON public.success_stories
FOR SELECT
TO public
USING (is_published = true);

-- Students can manage their own stories
CREATE POLICY "students_manage_own_stories"
ON public.success_stories
FOR ALL
TO authenticated
USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()))
WITH CHECK (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_success_stories
BEFORE UPDATE ON public.success_stories
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Mock data
DO $$
DECLARE
    student1_id UUID;
    student2_id UUID;
    college1_id UUID;
BEGIN
    -- Get existing student and college IDs
    SELECT id INTO student1_id FROM public.students LIMIT 1;
    SELECT id INTO college1_id FROM public.colleges LIMIT 1;
    
    -- Create sample success stories
    IF student1_id IS NOT NULL THEN
        INSERT INTO public.success_stories (
            student_id,
            title,
            story_content,
            video_url,
            before_role,
            after_role,
            before_salary,
            after_salary,
            company_name,
            company_logo_url,
            industry,
            placement_year,
            is_featured,
            is_published
        ) VALUES
        (
            student1_id,
            'From Campus to Google: My Journey with Winhive',
            'When I started my final year, I was worried about placements. Winhive''s premium features helped me prepare systematically. The mock interviews and resume reviews made all the difference. Today, I am working at Google as a Software Engineer with a package that exceeded my expectations.',
            'https://www.youtube.com/watch?v=sample1',
            'Final Year Student',
            'Software Engineer',
            0,
            2400000,
            'Google',
            'https://logo.clearbit.com/google.com',
            'Technology',
            2024,
            true,
            true
        ),
        (
            student1_id,
            'Breaking into Product Management',
            'Transitioning from engineering to product management seemed impossible. Winhive connected me with mentors who guided my journey. The industry insights and networking events were invaluable. Now I work at Microsoft as an Associate Product Manager.',
            'https://www.youtube.com/watch?v=sample2',
            'Software Developer Intern',
            'Associate Product Manager',
            600000,
            1800000,
            'Microsoft',
            'https://logo.clearbit.com/microsoft.com',
            'Technology',
            2024,
            true,
            true
        ),
        (
            student1_id,
            'My Data Science Success Story',
            'Coming from a non-CS background, breaking into Data Science was challenging. Winhive''s resources and community support helped me build the right skills. The project showcase feature landed me interviews at top companies. I am now a Data Scientist at Amazon.',
            null,
            'Mathematics Graduate',
            'Data Scientist',
            0,
            2000000,
            'Amazon',
            'https://logo.clearbit.com/amazon.com',
            'Technology',
            2024,
            false,
            true
        );
    END IF;
END $$;