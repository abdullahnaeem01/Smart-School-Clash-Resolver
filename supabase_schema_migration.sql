-- =============================================================================
-- Run this ONCE in Supabase SQL Editor to upgrade your database.
-- Smart School Clash Resolver - Schema Upgrade Migration
-- =============================================================================

-- Ensure UUID extension exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADD P.E (PHYSICAL EDUCATION) SUBJECT
INSERT INTO subjects (name, code, color_accent) 
VALUES ('P.E', 'PE', '#16a34a') 
ON CONFLICT (name) DO NOTHING;

-- 2. CREATE CURRICULUM TABLE
CREATE TABLE IF NOT EXISTS curriculum (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade INT NOT NULL,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    periods_per_week INT NOT NULL DEFAULT 1,
    max_per_day INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(grade, subject_id)
);

-- 3. CREATE TEACHER_SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS teacher_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(teacher_id, subject_id)
);

-- 4. CREATE SCHOOL_SETTINGS TABLE
CREATE TABLE IF NOT EXISTS school_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE CHANGE_LOG TABLE
CREATE TABLE IF NOT EXISTS change_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    description TEXT,
    old_value JSONB,
    new_value JSONB,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ENABLE ROW LEVEL SECURITY (RLS) & SET PERMISSIVE POLICIES
ALTER TABLE curriculum ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_log ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'curriculum' AND policyname = 'Allow public access on curriculum') THEN
        CREATE POLICY "Allow public access on curriculum" ON curriculum FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teacher_subjects' AND policyname = 'Allow public access on teacher_subjects') THEN
        CREATE POLICY "Allow public access on teacher_subjects" ON teacher_subjects FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'school_settings' AND policyname = 'Allow public access on school_settings') THEN
        CREATE POLICY "Allow public access on school_settings" ON school_settings FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'change_log' AND policyname = 'Allow public access on change_log') THEN
        CREATE POLICY "Allow public access on change_log" ON change_log FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 7. SEED SCHOOL SETTINGS
INSERT INTO school_settings (key, value) VALUES
    ('school_name', 'Smart School'),
    ('periods_per_day', '7'),
    ('break_after_period', '3'),
    ('working_days', '["Monday","Tuesday","Wednesday","Thursday","Friday"]'),
    ('period_times', '[{"period":1,"start":"08:00","end":"08:45"},{"period":2,"start":"08:45","end":"09:30"},{"period":3,"start":"09:30","end":"10:15"},{"period":"break","start":"10:15","end":"10:45"},{"period":4,"start":"10:45","end":"11:25"},{"period":5,"start":"11:25","end":"12:05"},{"period":6,"start":"12:05","end":"12:45"},{"period":7,"start":"12:45","end":"01:25"},{"period":8,"start":"01:25","end":"02:05"}]')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 8. SEED CURRICULUM FOR ALL GRADES 1 TO 10 (35 PERIODS PER WEEK EACH)
INSERT INTO curriculum (grade, subject_id, periods_per_week, max_per_day)
SELECT grade_num, s.id, ppw, mpd
FROM (
    VALUES
    -- Grade 1: English=6, Urdu=6, Maths=5, Science=4, S.St=4, ICT=2, Islamiat=3, Nazra=3, P.E=2 (total 35)
    (1, 'English', 6, 2),
    (1, 'Urdu', 6, 2),
    (1, 'Maths', 5, 1),
    (1, 'Science', 4, 1),
    (1, 'S.St', 4, 1),
    (1, 'ICT', 2, 1),
    (1, 'Islamiat', 3, 1),
    (1, 'Nazra', 3, 1),
    (1, 'P.E', 2, 1),

    -- Grade 2: English=6, Urdu=6, Maths=5, Science=4, S.St=4, ICT=3, Islamiat=3, Nazra=3, P.E=1 (total 35)
    (2, 'English', 6, 2),
    (2, 'Urdu', 6, 2),
    (2, 'Maths', 5, 1),
    (2, 'Science', 4, 1),
    (2, 'S.St', 4, 1),
    (2, 'ICT', 3, 1),
    (2, 'Islamiat', 3, 1),
    (2, 'Nazra', 3, 1),
    (2, 'P.E', 1, 1),

    -- Grade 3: English=6, Urdu=6, Maths=5, Science=4, S.St=4, ICT=3, Islamiat=3, Nazra=3, P.E=1 (total 35)
    (3, 'English', 6, 2),
    (3, 'Urdu', 6, 2),
    (3, 'Maths', 5, 1),
    (3, 'Science', 4, 1),
    (3, 'S.St', 4, 1),
    (3, 'ICT', 3, 1),
    (3, 'Islamiat', 3, 1),
    (3, 'Nazra', 3, 1),
    (3, 'P.E', 1, 1),

    -- Grade 4: English=6, Urdu=6, Maths=5, Science=4, S.St=4, ICT=3, Islamiat=3, Nazra=3, P.E=1 (total 35)
    (4, 'English', 6, 2),
    (4, 'Urdu', 6, 2),
    (4, 'Maths', 5, 1),
    (4, 'Science', 4, 1),
    (4, 'S.St', 4, 1),
    (4, 'ICT', 3, 1),
    (4, 'Islamiat', 3, 1),
    (4, 'Nazra', 3, 1),
    (4, 'P.E', 1, 1),

    -- Grade 5: English=6, Urdu=6, Maths=5, Science=4, S.St=4, ICT=3, Islamiat=3, Nazra=3, P.E=1 (total 35)
    (5, 'English', 6, 2),
    (5, 'Urdu', 6, 2),
    (5, 'Maths', 5, 1),
    (5, 'Science', 4, 1),
    (5, 'S.St', 4, 1),
    (5, 'ICT', 3, 1),
    (5, 'Islamiat', 3, 1),
    (5, 'Nazra', 3, 1),
    (5, 'P.E', 1, 1),

    -- Grade 6: English=6, Urdu=6, Maths=5, Science=4, S.St=4, ICT=3, Islamiat=3, T.Q=3, P.E=1 (total 35)
    (6, 'English', 6, 2),
    (6, 'Urdu', 6, 2),
    (6, 'Maths', 5, 1),
    (6, 'Science', 4, 1),
    (6, 'S.St', 4, 1),
    (6, 'ICT', 3, 1),
    (6, 'Islamiat', 3, 1),
    (6, 'T.Q', 3, 1),
    (6, 'P.E', 1, 1),

    -- Grade 7: English=6, Urdu=6, Maths=5, Science=4, S.St=4, ICT=3, Islamiat=3, T.Q=3, P.E=1 (total 35)
    (7, 'English', 6, 2),
    (7, 'Urdu', 6, 2),
    (7, 'Maths', 5, 1),
    (7, 'Science', 4, 1),
    (7, 'S.St', 4, 1),
    (7, 'ICT', 3, 1),
    (7, 'Islamiat', 3, 1),
    (7, 'T.Q', 3, 1),
    (7, 'P.E', 1, 1),

    -- Grade 8: English=5, Urdu=5, Maths=5, Physics=4, Chemistry=5, Biology=4, Islamiat=3, T.Q=3, P.E=1 (total 35)
    (8, 'English', 5, 1),
    (8, 'Urdu', 5, 1),
    (8, 'Maths', 5, 1),
    (8, 'Physics', 4, 1),
    (8, 'Chemistry', 5, 1),
    (8, 'Biology', 4, 1),
    (8, 'Islamiat', 3, 1),
    (8, 'T.Q', 3, 1),
    (8, 'P.E', 1, 1),

    -- Grade 9: English=5, Urdu=5, Maths=5, Physics=4, Chemistry=5, Biology=4, Islamiat=3, T.Q=3, P.E=1 (total 35)
    (9, 'English', 5, 1),
    (9, 'Urdu', 5, 1),
    (9, 'Maths', 5, 1),
    (9, 'Physics', 4, 1),
    (9, 'Chemistry', 5, 1),
    (9, 'Biology', 4, 1),
    (9, 'Islamiat', 3, 1),
    (9, 'T.Q', 3, 1),
    (9, 'P.E', 1, 1),

    -- Grade 10: English=5, Urdu=5, Maths=5, Physics=4, Chemistry=5, Biology=4, T.Q=3, Pak. Study=3, P.E=1 (total 35)
    (10, 'English', 5, 1),
    (10, 'Urdu', 5, 1),
    (10, 'Maths', 5, 1),
    (10, 'Physics', 4, 1),
    (10, 'Chemistry', 5, 1),
    (10, 'Biology', 4, 1),
    (10, 'T.Q', 3, 1),
    (10, 'Pak. Study', 3, 1),
    (10, 'P.E', 1, 1)
) AS v(grade_num, subj_name, ppw, mpd)
JOIN subjects s ON s.name = v.subj_name
ON CONFLICT (grade, subject_id) 
DO UPDATE SET periods_per_week = EXCLUDED.periods_per_week, max_per_day = EXCLUDED.max_per_day;

-- 9. SEED TEACHER_SUBJECTS JOIN TABLE
INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT t.id, s.id
FROM (
    VALUES
    -- Maths Teachers
    ('Rubab', 'Maths'),
    ('Rubina Malik', 'Maths'),
    ('Zeenat', 'Maths'),
    ('Beenish', 'Maths'),
    ('Samina Gul', 'Maths'),
    ('Misbah Sohail', 'Maths'),
    ('Faiza', 'Maths'),
    ('Eman', 'Maths'),
    ('Sumaira Rashid', 'Maths'),

    -- English Teachers
    ('Mehmoona (English)', 'English'),
    ('Ishrat', 'English'),
    ('Kiran', 'English'),
    ('Salma', 'English'),
    ('Salma', 'Pak. Study'),
    ('Zarmeen', 'English'),
    ('Farah', 'English'),
    ('Tasneem', 'English'),
    ('Sarwat', 'English'),
    ('Anum', 'English'),
    ('Urooj', 'English'),

    -- Urdu Teachers
    ('Sadia Waseem', 'Urdu'),
    ('Sonia', 'Urdu'),
    ('Naseem', 'Urdu'),
    ('Nazia', 'Urdu'),
    ('Summaiya', 'Urdu'),
    ('New 1', 'Urdu'),
    ('New 1', 'Islamiat'),
    ('Shazia Sohail', 'Urdu'),
    ('Saiqa', 'Urdu'),
    ('Atiya', 'Urdu'),
    ('Nabeela', 'Urdu'),

    -- Science / Biology / Chemistry / Physics
    ('Meharyan', 'Biology'),
    ('Saira', 'Science'),
    ('Kinza', 'Science'),
    ('Ifza', 'Science'),
    ('Sadia Sarwar', 'Science'),
    ('Sadia Sarwar', 'Chemistry'),
    ('Yusra', 'Science'),
    ('Saleha', 'Science'),
    ('Saleha', 'Islamiat'),
    ('Sajida', 'Chemistry'),
    ('Sidra', 'Physics'),

    -- T.Q / Islamiat
    ('Sumaira Gul', 'T.Q'),
    ('Sumaira Gul', 'Islamiat'),
    ('Farhat', 'T.Q'),
    ('Farhat', 'Islamiat'),
    ('Huma', 'T.Q'),
    ('Huma', 'Islamiat'),
    ('Aima', 'Islamiat'),
    ('Arshia', 'Islamiat'),

    -- S.St
    ('Mehwish', 'S.St'),
    ('Sehrish', 'S.St'),
    ('Bushra', 'S.St'),
    ('Habiba', 'S.St'),
    ('Mehmoona (S.St)', 'S.St'),

    -- ICT
    ('Musarat', 'ICT'),
    ('Humaira', 'ICT'),
    ('Rabiya', 'ICT'),
    ('Haleema ICT', 'ICT'),

    -- Nazra
    ('Sania', 'Nazra'),
    ('Mudassira', 'Nazra'),
    ('Haleema (Nazra)', 'Nazra')
) AS v(t_name, s_name)
JOIN teachers t ON t.name = v.t_name
JOIN subjects s ON s.name = v.s_name
ON CONFLICT (teacher_id, subject_id) DO NOTHING;

-- =============================================================================
-- MIGRATION COMPLETE!
-- =============================================================================
