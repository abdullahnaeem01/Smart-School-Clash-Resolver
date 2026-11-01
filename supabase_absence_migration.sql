-- =============================================================================
-- TEACHER ABSENCE & TEMPORARY TIMETABLE MANAGEMENT
-- Migration Script v1.0
-- Run ONCE in Supabase SQL Editor.
-- This script is purely additive — it does NOT modify any existing tables.
-- =============================================================================

-- Enable UUID extension (already enabled, safe to re-run)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- TABLE 1: teacher_absences
-- Stores registered teacher absence records (long leave).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS teacher_absences (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id      UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    reason          TEXT,
    notes           TEXT,
    status          TEXT NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'inactive', 'closed')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT absence_dates_valid CHECK (end_date >= start_date)
);

ALTER TABLE teacher_absences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access teacher_absences" ON teacher_absences;
CREATE POLICY "Public access teacher_absences"
    ON teacher_absences FOR ALL USING (true) WITH CHECK (true);

-- Index for common lookups
CREATE INDEX IF NOT EXISTS idx_absences_teacher ON teacher_absences(teacher_id);
CREATE INDEX IF NOT EXISTS idx_absences_dates ON teacher_absences(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_absences_status ON teacher_absences(status);

-- -----------------------------------------------------------------------------
-- TABLE 2: absence_arrangements
-- Admin decisions: how each affected lesson group is handled (combine/substitute).
-- One record per arrangement decision within an absence.
-- Max 2 sections per combine arrangement (enforced at application level).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS absence_arrangements (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    absence_id              UUID NOT NULL REFERENCES teacher_absences(id) ON DELETE CASCADE,
    arrangement_type        TEXT NOT NULL CHECK (arrangement_type IN ('combine', 'substitute')),
    subject_id              UUID REFERENCES subjects(id) ON DELETE SET NULL,
    conducting_teacher_id   UUID REFERENCES teachers(id) ON DELETE SET NULL,
    period                  INT,          -- the period number in the temp timetable (may differ from original)
    day_of_week             TEXT,         -- 'Monday'..'Friday', or NULL if specific-date-only
    recurrence              TEXT NOT NULL DEFAULT 'all'
                                CHECK (recurrence IN ('all', 'selected_dates', 'specific')),
    notes                   TEXT,
    approved                BOOLEAN NOT NULL DEFAULT FALSE,
    approved_by             TEXT,         -- free-text admin name (no login required)
    approved_at             TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE absence_arrangements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access absence_arrangements" ON absence_arrangements;
CREATE POLICY "Public access absence_arrangements"
    ON absence_arrangements FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_arrangements_absence ON absence_arrangements(absence_id);
CREATE INDEX IF NOT EXISTS idx_arrangements_type ON absence_arrangements(arrangement_type);

-- -----------------------------------------------------------------------------
-- TABLE 3: absence_arrangement_sections
-- Which sections (classes) participate in each arrangement.
-- For 'combine' arrangements: exactly 2 classes (enforced at app level).
-- For 'substitute' arrangements: exactly 1 class.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS absence_arrangement_sections (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    arrangement_id      UUID NOT NULL REFERENCES absence_arrangements(id) ON DELETE CASCADE,
    class_id            UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    original_period     INT,          -- the period this class has the subject in the permanent timetable
    UNIQUE (arrangement_id, class_id)
);

ALTER TABLE absence_arrangement_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access absence_arrangement_sections" ON absence_arrangement_sections;
CREATE POLICY "Public access absence_arrangement_sections"
    ON absence_arrangement_sections FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_arr_sections_arrangement ON absence_arrangement_sections(arrangement_id);
CREATE INDEX IF NOT EXISTS idx_arr_sections_class ON absence_arrangement_sections(class_id);

-- -----------------------------------------------------------------------------
-- TABLE 4: absence_arrangement_dates
-- Controls which specific calendar dates each arrangement applies to.
-- Only used when recurrence = 'selected_dates' or 'specific'.
-- For recurrence = 'all': all weekdays within absence period automatically apply.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS absence_arrangement_dates (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    arrangement_id      UUID NOT NULL REFERENCES absence_arrangements(id) ON DELETE CASCADE,
    date                DATE NOT NULL,
    applies             BOOLEAN NOT NULL DEFAULT TRUE,  -- FALSE = explicitly excluded
    UNIQUE (arrangement_id, date)
);

ALTER TABLE absence_arrangement_dates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access absence_arrangement_dates" ON absence_arrangement_dates;
CREATE POLICY "Public access absence_arrangement_dates"
    ON absence_arrangement_dates FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_arr_dates_arrangement ON absence_arrangement_dates(arrangement_id);
CREATE INDEX IF NOT EXISTS idx_arr_dates_date ON absence_arrangement_dates(date);

-- -----------------------------------------------------------------------------
-- TABLE 5: temp_timetable_slots
-- The generated temporary schedule.
-- Never overwrites timetable_slots — this is a completely separate layer.
-- Applies only to dates within the registered absence period.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS temp_timetable_slots (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    absence_id              UUID NOT NULL REFERENCES teacher_absences(id) ON DELETE CASCADE,
    arrangement_id          UUID REFERENCES absence_arrangements(id) ON DELETE SET NULL,
    date                    DATE NOT NULL,
    period                  INT NOT NULL,
    -- class_ids: JSONB array of class UUIDs (multiple for combined lessons)
    class_ids               JSONB NOT NULL DEFAULT '[]',
    subject_id              UUID REFERENCES subjects(id) ON DELETE SET NULL,
    teacher_id              UUID REFERENCES teachers(id) ON DELETE SET NULL,   -- covering teacher
    original_teacher_id     UUID REFERENCES teachers(id) ON DELETE SET NULL,   -- absent teacher
    slot_type               TEXT NOT NULL DEFAULT 'unchanged'
                                CHECK (slot_type IN ('unchanged','combined','substitute','unresolved','pe')),
    change_reason           TEXT,
    published               BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE temp_timetable_slots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access temp_timetable_slots" ON temp_timetable_slots;
CREATE POLICY "Public access temp_timetable_slots"
    ON temp_timetable_slots FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_temp_slots_absence ON temp_timetable_slots(absence_id);
CREATE INDEX IF NOT EXISTS idx_temp_slots_date ON temp_timetable_slots(date);
CREATE INDEX IF NOT EXISTS idx_temp_slots_teacher ON temp_timetable_slots(teacher_id);
CREATE INDEX IF NOT EXISTS idx_temp_slots_type ON temp_timetable_slots(slot_type);

-- -----------------------------------------------------------------------------
-- TABLE 6: absence_approval_log
-- Full audit trail of admin reviews and publish actions.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS absence_approval_log (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    absence_id      UUID NOT NULL REFERENCES teacher_absences(id) ON DELETE CASCADE,
    action          TEXT NOT NULL CHECK (action IN ('submitted','approved','rejected','revised','published','unpublished')),
    acted_by        TEXT,         -- free-text admin name
    notes           TEXT,
    snapshot        JSONB,        -- full arrangement snapshot at time of action
    acted_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE absence_approval_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access absence_approval_log" ON absence_approval_log;
CREATE POLICY "Public access absence_approval_log"
    ON absence_approval_log FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_approval_log_absence ON absence_approval_log(absence_id);
CREATE INDEX IF NOT EXISTS idx_approval_log_action ON absence_approval_log(action);

-- =============================================================================
-- DONE
-- 6 new tables created:
--   teacher_absences
--   absence_arrangements
--   absence_arrangement_sections
--   absence_arrangement_dates
--   temp_timetable_slots
--   absence_approval_log
--
-- All tables have RLS enabled with public read/write policies.
-- No existing tables were modified.
-- =============================================================================
SELECT 'Absence management migration completed successfully.' AS result;
