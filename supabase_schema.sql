-- =============================================================================
-- SMART SCHOOL CLASH RESOLVER - SUPABASE POSTGRESQL SCHEMA
-- =============================================================================
-- Copy and paste this script directly into your Supabase project's SQL Editor:
-- (Supabase Dashboard -> Project -> SQL Editor -> New Query -> Run)
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DROP EXISTING TABLES IF ANY (Clean start)
DROP TABLE IF EXISTS timetable_slots CASCADE;
DROP TABLE IF EXISTS allocations CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;

-- 2. CREATE TEACHERS TABLE
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    department TEXT DEFAULT 'General',
    max_periods_weekly INT DEFAULT 35,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE SUBJECTS TABLE
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    code TEXT,
    color_accent TEXT DEFAULT '#3b82f6',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE CLASSES TABLE
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    grade INT NOT NULL,
    section TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE ALLOCATIONS TABLE
CREATE TABLE allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    periods_per_week INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(teacher_id, subject_id, class_id)
);

-- 6. CREATE TIMETABLE_SLOTS TABLE
CREATE TABLE timetable_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    day TEXT NOT NULL,
    period INT NOT NULL,
    teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, day, period)
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS) & ALLOW PUBLIC ACCESS VIA ANON KEY
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on teachers" ON teachers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access on subjects" ON subjects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access on classes" ON classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access on allocations" ON allocations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access on timetable_slots" ON timetable_slots FOR ALL USING (true) WITH CHECK (true);

-- =============================================================================
-- SEED DATA: POPULATE REAL SCHOOL RECORDS
-- =============================================================================

-- Seed Teachers
INSERT INTO teachers (name, department) VALUES
    ('Aima', 'General'),
    ('Anum', 'General'),
    ('Arshia', 'General'),
    ('Atiya', 'General'),
    ('Beenish', 'General'),
    ('Bushra', 'General'),
    ('Eman', 'General'),
    ('Faiza', 'General'),
    ('Farah', 'General'),
    ('Farhat', 'General'),
    ('Habiba', 'General'),
    ('Haleema (Nazra)', 'Islamic Studies'),
    ('Haleema ICT', 'Computer Science'),
    ('Huma', 'General'),
    ('Humaira', 'General'),
    ('Ifza', 'General'),
    ('Ishrat', 'General'),
    ('Kinza', 'General'),
    ('Kiran', 'General'),
    ('Meharyan', 'General'),
    ('Mehmoona (English)', 'English Dept'),
    ('Mehmoona (S.St)', 'Social Studies'),
    ('Mehwish', 'General'),
    ('Misbah Sohail', 'General'),
    ('Mudassira', 'General'),
    ('Musarat', 'General'),
    ('Nabeela', 'General'),
    ('Naseem', 'General'),
    ('Nazia', 'General'),
    ('New 1', 'General'),
    ('Rabiya', 'General'),
    ('Rubab', 'General'),
    ('Rubina Malik', 'General'),
    ('Sadia Sarwar', 'General'),
    ('Sadia Waseem', 'General'),
    ('Saiqa', 'General'),
    ('Saira', 'General'),
    ('Sajida', 'General'),
    ('Saleha', 'General'),
    ('Salma', 'General'),
    ('Samina Gul', 'General'),
    ('Sania', 'General'),
    ('Sarwat', 'General'),
    ('Sehrish', 'General'),
    ('Shazia Sohail', 'General'),
    ('Sidra', 'General'),
    ('Sonia', 'General'),
    ('Sumaira Gul', 'General'),
    ('Sumaira Rashid', 'General'),
    ('Summaiya', 'General'),
    ('Tasneem', 'General'),
    ('Urooj', 'General'),
    ('Yusra', 'General'),
    ('Zarmeen', 'General'),
    ('Zeenat', 'General');

-- Seed Subjects
INSERT INTO subjects (name, code, color_accent) VALUES
    ('Biology', 'BIOL', '#059669'),
    ('Chemistry', 'CHEM', '#047857'),
    ('English', 'ENGL', '#8b5cf6'),
    ('ICT', 'ICT', '#6366f1'),
    ('Islamiat', 'ISLA', '#d97706'),
    ('Maths', 'MATH', '#3b82f6'),
    ('Nazra', 'NAZR', '#eab308'),
    ('Pak. Study', 'PAKS', '#0891b2'),
    ('Physics', 'PHYS', '#0284c7'),
    ('S.St', 'SST', '#06b6d4'),
    ('Science', 'SCIE', '#10b981'),
    ('T.Q', 'TQ', '#f59e0b'),
    ('Urdu', 'URDU', '#ec4899');

-- Seed Classes
INSERT INTO classes (name, grade, section) VALUES
    ('1 Blue', 1, 'Blue'),
    ('1 Pink', 1, 'Pink'),
    ('1 Red', 1, 'Red'),
    ('1 White', 1, 'White'),
    ('2 Blue', 2, 'Blue'),
    ('2 Pink', 2, 'Pink'),
    ('2 Red', 2, 'Red'),
    ('2 White', 2, 'White'),
    ('3 Blue', 3, 'Blue'),
    ('3 Green', 3, 'Green'),
    ('3 Pink', 3, 'Pink'),
    ('3 Red', 3, 'Red'),
    ('3 White', 3, 'White'),
    ('4 Blue', 4, 'Blue'),
    ('4 Green', 4, 'Green'),
    ('4 Pink', 4, 'Pink'),
    ('4 Red', 4, 'Red'),
    ('4 White', 4, 'White'),
    ('5 Blue', 5, 'Blue'),
    ('5 Pink', 5, 'Pink'),
    ('5 Red', 5, 'Red'),
    ('5 White', 5, 'White'),
    ('6 Blue', 6, 'Blue'),
    ('6 Pink', 6, 'Pink'),
    ('6 Red', 6, 'Red'),
    ('6 White', 6, 'White'),
    ('7 Blue', 7, 'Blue'),
    ('7 Pink', 7, 'Pink'),
    ('7 Red', 7, 'Red'),
    ('7 White', 7, 'White'),
    ('8 Blue', 8, 'Blue'),
    ('8 Pink', 8, 'Pink'),
    ('9 Blue', 9, 'Blue'),
    ('9 Pink', 9, 'Pink'),
    ('10 Blue', 10, 'Blue'),
    ('10 Pink', 10, 'Pink');

-- Seed Allocations Linking Teachers, Subjects & Classes
INSERT INTO allocations (teacher_id, subject_id, class_id, periods_per_week)
(
    (SELECT id FROM teachers WHERE name = 'Rubab'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '10 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Rubab'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '10 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Rubab'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '9 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Rubab'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '8 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Rubina Malik'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '9 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Rubina Malik'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '8 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Rubina Malik'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '7 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Rubina Malik'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '7 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Zeenat'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '7 Red'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Zeenat'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '7 White'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Zeenat'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '6 White'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Zeenat'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '4 Red'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Beenish'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '6 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Beenish'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '6 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Beenish'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '6 Red'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Beenish'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '5 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Samina Gul'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '5 Red'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Samina Gul'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '5 White'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Samina Gul'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '5 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Samina Gul'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '4 White'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Misbah Sohail'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '4 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Misbah Sohail'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '4 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Misbah Sohail'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '4 Green'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Misbah Sohail'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '3 Green'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Faiza'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '3 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Faiza'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '3 White'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Faiza'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '3 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Faiza'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '3 Red'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Eman'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '2 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Eman'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '2 Red'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Eman'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '1 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Eman'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '1 White'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Sumaira Rashid'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '2 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Sumaira Rashid'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '2 White'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Sumaira Rashid'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '1 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Sumaira Rashid'),
    (SELECT id FROM subjects WHERE name = 'Maths'),
    (SELECT id FROM classes WHERE name = '1 Red'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Mehmoona (English)'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '10 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Mehmoona (English)'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '10 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Mehmoona (English)'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '9 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Mehmoona (English)'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '9 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Ishrat'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '8 Pink'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Ishrat'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '8 Blue'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Ishrat'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '6 Pink'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Ishrat'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '6 Red'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Kiran'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '6 Blue'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Kiran'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '6 White'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Kiran'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '7 Pink'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Kiran'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '7 Red'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Salma'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '7 Blue'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Salma'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '7 White'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Salma'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '5 Red'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Zarmeen'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '5 Pink'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Zarmeen'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '4 Red'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Zarmeen'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '4 Blue'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Zarmeen'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '4 White'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Farah'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '5 Blue'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Farah'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '5 White'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Farah'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '4 Pink'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Farah'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '4 Green'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Tasneem'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '3 Blue'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Tasneem'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '3 White'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Tasneem'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '3 Green'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Sarwat'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '3 Red'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Sarwat'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '2 Blue'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Sarwat'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '2 White'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Sarwat'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '1 Pink'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Anum'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '2 Pink'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Anum'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '3 Pink'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Anum'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '1 Blue'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Anum'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '1 White'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Urooj'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '2 Red'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Urooj'),
    (SELECT id FROM subjects WHERE name = 'English'),
    (SELECT id FROM classes WHERE name = '1 Red'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Sadia Waseem'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '10 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Sadia Waseem'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '10 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Sadia Waseem'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '9 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Sadia Waseem'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '8 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Sadia Waseem'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '8 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Sonia'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '9 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Sonia'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '7 Pink'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Naseem'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '7 Red'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Naseem'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '7 Blue'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Naseem'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '7 White'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Naseem'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '5 Red'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Nazia'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '6 Pink'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Nazia'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '6 Blue'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Nazia'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '5 Blue'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Nazia'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '6 White'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Summaiya'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '5 Pink'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Summaiya'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '4 Pink'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Summaiya'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '3 Pink'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Summaiya'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '6 Red'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'New 1'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '5 White'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Shazia Sohail'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '4 Blue'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Shazia Sohail'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '4 White'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Shazia Sohail'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '4 Red'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Shazia Sohail'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '3 Red'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Saiqa'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '3 Blue'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Saiqa'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '4 Green'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Saiqa'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '3 White'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Saiqa'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '3 Green'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Atiya'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '1 Red'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Atiya'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '1 White'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Atiya'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '2 Red'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Atiya'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '2 White'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Nabeela'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '1 Pink'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Nabeela'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '1 Blue'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Nabeela'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '2 Pink'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Nabeela'),
    (SELECT id FROM subjects WHERE name = 'Urdu'),
    (SELECT id FROM classes WHERE name = '2 Blue'),
    6
),
(
    (SELECT id FROM teachers WHERE name = 'Meharyan'),
    (SELECT id FROM subjects WHERE name = 'Biology'),
    (SELECT id FROM classes WHERE name = '10 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Meharyan'),
    (SELECT id FROM subjects WHERE name = 'Biology'),
    (SELECT id FROM classes WHERE name = '10 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Meharyan'),
    (SELECT id FROM subjects WHERE name = 'Biology'),
    (SELECT id FROM classes WHERE name = '9 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Meharyan'),
    (SELECT id FROM subjects WHERE name = 'Biology'),
    (SELECT id FROM classes WHERE name = '9 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Meharyan'),
    (SELECT id FROM subjects WHERE name = 'Biology'),
    (SELECT id FROM classes WHERE name = '8 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Meharyan'),
    (SELECT id FROM subjects WHERE name = 'Biology'),
    (SELECT id FROM classes WHERE name = '8 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Saira'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '7 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Saira'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '7 White'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Saira'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '6 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Saira'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '5 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Saira'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '5 Red'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Saira'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '5 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Kinza'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '7 Red'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Kinza'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '6 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Kinza'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '6 White'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Kinza'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '5 White'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Kinza'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '4 White'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Ifza'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '6 Red'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Ifza'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '3 Green'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Ifza'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '4 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Ifza'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '4 Red'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Ifza'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '4 Green'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Ifza'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '8 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sadia Sarwar'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '3 White'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sadia Sarwar'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '4 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sadia Sarwar'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '3 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Yusra'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '2 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Yusra'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '2 White'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Yusra'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '2 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Yusra'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '2 Red'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Yusra'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '3 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Yusra'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '3 Red'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Saleha'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '1 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Saleha'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '1 Red'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Saleha'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '1 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Saleha'),
    (SELECT id FROM subjects WHERE name = 'Science'),
    (SELECT id FROM classes WHERE name = '1 White'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sajida'),
    (SELECT id FROM subjects WHERE name = 'Chemistry'),
    (SELECT id FROM classes WHERE name = '10 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Sajida'),
    (SELECT id FROM subjects WHERE name = 'Chemistry'),
    (SELECT id FROM classes WHERE name = '9 Blue'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Sajida'),
    (SELECT id FROM subjects WHERE name = 'Chemistry'),
    (SELECT id FROM classes WHERE name = '8 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sajida'),
    (SELECT id FROM subjects WHERE name = 'Chemistry'),
    (SELECT id FROM classes WHERE name = '8 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sajida'),
    (SELECT id FROM subjects WHERE name = 'Chemistry'),
    (SELECT id FROM classes WHERE name = '7 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sidra'),
    (SELECT id FROM subjects WHERE name = 'Physics'),
    (SELECT id FROM classes WHERE name = '10 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sidra'),
    (SELECT id FROM subjects WHERE name = 'Physics'),
    (SELECT id FROM classes WHERE name = '10 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sidra'),
    (SELECT id FROM subjects WHERE name = 'Physics'),
    (SELECT id FROM classes WHERE name = '9 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sidra'),
    (SELECT id FROM subjects WHERE name = 'Physics'),
    (SELECT id FROM classes WHERE name = '9 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sidra'),
    (SELECT id FROM subjects WHERE name = 'Physics'),
    (SELECT id FROM classes WHERE name = '8 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sadia Sarwar'),
    (SELECT id FROM subjects WHERE name = 'Chemistry'),
    (SELECT id FROM classes WHERE name = '10 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Sadia Sarwar'),
    (SELECT id FROM subjects WHERE name = 'Chemistry'),
    (SELECT id FROM classes WHERE name = '9 Pink'),
    5
),
(
    (SELECT id FROM teachers WHERE name = 'Sumaira Gul'),
    (SELECT id FROM subjects WHERE name = 'T.Q'),
    (SELECT id FROM classes WHERE name = '10 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Sumaira Gul'),
    (SELECT id FROM subjects WHERE name = 'T.Q'),
    (SELECT id FROM classes WHERE name = '10 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Sumaira Gul'),
    (SELECT id FROM subjects WHERE name = 'T.Q'),
    (SELECT id FROM classes WHERE name = '9 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Sumaira Gul'),
    (SELECT id FROM subjects WHERE name = 'T.Q'),
    (SELECT id FROM classes WHERE name = '8 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Sumaira Gul'),
    (SELECT id FROM subjects WHERE name = 'T.Q'),
    (SELECT id FROM classes WHERE name = '8 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Sumaira Gul'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '9 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Sumaira Gul'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '8 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Sumaira Gul'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '8 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Farhat'),
    (SELECT id FROM subjects WHERE name = 'T.Q'),
    (SELECT id FROM classes WHERE name = '9 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Farhat'),
    (SELECT id FROM subjects WHERE name = 'T.Q'),
    (SELECT id FROM classes WHERE name = '7 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Farhat'),
    (SELECT id FROM subjects WHERE name = 'T.Q'),
    (SELECT id FROM classes WHERE name = '7 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Farhat'),
    (SELECT id FROM subjects WHERE name = 'T.Q'),
    (SELECT id FROM classes WHERE name = '7 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Farhat'),
    (SELECT id FROM subjects WHERE name = 'T.Q'),
    (SELECT id FROM classes WHERE name = '7 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Farhat'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '9 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Farhat'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '7 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Farhat'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '7 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'New 1'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '6 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'New 1'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '6 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'New 1'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '6 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'New 1'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '6 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'New 1'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '5 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'New 1'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '5 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Huma'),
    (SELECT id FROM subjects WHERE name = 'T.Q'),
    (SELECT id FROM classes WHERE name = '6 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Huma'),
    (SELECT id FROM subjects WHERE name = 'T.Q'),
    (SELECT id FROM classes WHERE name = '6 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Huma'),
    (SELECT id FROM subjects WHERE name = 'T.Q'),
    (SELECT id FROM classes WHERE name = '6 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Huma'),
    (SELECT id FROM subjects WHERE name = 'T.Q'),
    (SELECT id FROM classes WHERE name = '6 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Huma'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '7 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Huma'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '7 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Huma'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '5 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Huma'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '5 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Aima'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '3 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Aima'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '3 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Aima'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '3 Green'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Aima'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '4 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Aima'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '4 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Aima'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '4 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Aima'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '4 Green'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Aima'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '4 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Arshia'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '1 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Arshia'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '1 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Arshia'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '2 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Arshia'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '2 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Arshia'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '2 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Arshia'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '2 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Arshia'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '3 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Arshia'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '3 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Saleha'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '1 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Saleha'),
    (SELECT id FROM subjects WHERE name = 'Islamiat'),
    (SELECT id FROM classes WHERE name = '1 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Mehwish'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '6 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Mehwish'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '6 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Mehwish'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '6 White'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Mehwish'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '7 Red'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Mehwish'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '7 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Mehwish'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '7 White'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sehrish'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '7 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sehrish'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '6 Red'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sehrish'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '5 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sehrish'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '5 Red'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sehrish'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '4 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Sehrish'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '4 White'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Bushra'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '5 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Bushra'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '5 White'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Bushra'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '4 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Bushra'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '4 Red'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Bushra'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '3 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Bushra'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '4 Green'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Habiba'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '3 Red'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Habiba'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '3 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Habiba'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '3 White'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Habiba'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '2 Red'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Habiba'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '2 White'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Habiba'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '3 Green'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Mehmoona (S.St)'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '1 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Mehmoona (S.St)'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '1 Red'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Mehmoona (S.St)'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '1 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Mehmoona (S.St)'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '1 White'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Mehmoona (S.St)'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '2 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Mehmoona (S.St)'),
    (SELECT id FROM subjects WHERE name = 'S.St'),
    (SELECT id FROM classes WHERE name = '2 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Salma'),
    (SELECT id FROM subjects WHERE name = 'Pak. Study'),
    (SELECT id FROM classes WHERE name = '10 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Salma'),
    (SELECT id FROM subjects WHERE name = 'Pak. Study'),
    (SELECT id FROM classes WHERE name = '10 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Musarat'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '9 Pink'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Musarat'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '9 Blue'),
    4
),
(
    (SELECT id FROM teachers WHERE name = 'Musarat'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '7 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Musarat'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '7 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Musarat'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '7 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Musarat'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '7 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Musarat'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '8 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Musarat'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '8 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Humaira'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '6 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Humaira'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '6 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Humaira'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '6 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Humaira'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '6 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Humaira'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '5 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Humaira'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '5 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Humaira'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '5 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Humaira'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '5 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Rabiya'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '2 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Rabiya'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '2 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Rabiya'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '3 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Rabiya'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '3 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Rabiya'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '4 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Rabiya'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '4 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Rabiya'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '3 Green'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Rabiya'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '1 Pink'),
    2
),
(
    (SELECT id FROM teachers WHERE name = 'Rabiya'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '1 Blue'),
    2
),
(
    (SELECT id FROM teachers WHERE name = 'Haleema ICT'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '2 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Haleema ICT'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '2 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Haleema ICT'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '3 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Haleema ICT'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '3 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Haleema ICT'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '4 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Haleema ICT'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '4 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Haleema ICT'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '4 Green'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Haleema ICT'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '1 Red'),
    2
),
(
    (SELECT id FROM teachers WHERE name = 'Haleema ICT'),
    (SELECT id FROM subjects WHERE name = 'ICT'),
    (SELECT id FROM classes WHERE name = '1 White'),
    2
),
(
    (SELECT id FROM teachers WHERE name = 'Sania'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '1 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Sania'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '2 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Sania'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '3 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Sania'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '3 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Sania'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '4 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Sania'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '4 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Sania'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '5 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Sania'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '5 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Mudassira'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '1 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Mudassira'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '2 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Mudassira'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '3 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Mudassira'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '3 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Mudassira'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '4 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Mudassira'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '4 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Mudassira'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '5 Pink'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Mudassira'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '5 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Haleema (Nazra)'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '1 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Haleema (Nazra)'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '1 White'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Haleema (Nazra)'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '2 Red'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Haleema (Nazra)'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '2 Blue'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Haleema (Nazra)'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '3 Green'),
    3
),
(
    (SELECT id FROM teachers WHERE name = 'Haleema (Nazra)'),
    (SELECT id FROM subjects WHERE name = 'Nazra'),
    (SELECT id FROM classes WHERE name = '4 Green'),
    3
);

-- =============================================================================
-- END OF SCHEMA SCRIPT
-- =============================================================================
