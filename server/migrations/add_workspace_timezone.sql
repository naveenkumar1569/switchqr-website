-- ============================================================================
-- Workspace-Anchored Timezone Migration
-- ============================================================================
-- This migration creates the workspaces table and migrates timezone handling
-- from profile-level to workspace-level for consistent analytics aggregation.
-- ============================================================================

-- Create workspaces table if it does not exist
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE workspaces IS 
'Workspaces represent the analytics context. All team members in a workspace see consistent analytics.';

COMMENT ON COLUMN workspaces.timezone IS 
'IANA timezone used for analytics aggregation and scheduling (e.g., Asia/Kolkata, America/New_York)';

-- Add workspace_id to profiles if missing
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);

COMMENT ON COLUMN profiles.workspace_id IS 
'Reference to the workspace this profile belongs to. Used for timezone resolution in analytics.';

-- Backfill: create 1 workspace per existing profile (safe default for migration)
-- This ensures existing users get a workspace with UTC timezone
INSERT INTO workspaces (id, name, timezone)
SELECT gen_random_uuid(), 'Default Workspace', 'UTC'
WHERE NOT EXISTS (SELECT 1 FROM workspaces);

-- Link all profiles to the first workspace if workspace_id is null
-- In a multi-tenant system, you would customize this logic
UPDATE profiles
SET workspace_id = (
    SELECT id FROM workspaces LIMIT 1
)
WHERE workspace_id IS NULL;

-- Add workspace_id to campaigns for timezone inheritance
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);

COMMENT ON COLUMN campaigns.workspace_id IS 
'Reference to the workspace this campaign belongs to. Used for timezone inheritance.';

-- Add optional campaign timezone override
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS timezone TEXT;

COMMENT ON COLUMN campaigns.timezone IS 
'Optional IANA timezone override. If NULL, inherits from workspace timezone. Used for campaign-specific analytics.';

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_workspace_id ON profiles(workspace_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_workspace_id ON campaigns(workspace_id);

-- ============================================================================
-- SQL RPC Functions for Timezone-Aware Aggregation
-- ============================================================================

-- Function: Get daily scans with timezone-aware grouping
CREATE OR REPLACE FUNCTION get_daily_scans(
    p_qr_ids UUID[],
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ,
    p_timezone TEXT
)
RETURNS TABLE(day DATE, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (scanned_at AT TIME ZONE p_timezone)::DATE AS day,
        COUNT(*)::BIGINT
    FROM scans
    WHERE qr_id = ANY(p_qr_ids)
      AND scanned_at >= p_start_date
      AND scanned_at <= p_end_date
    GROUP BY day
    ORDER BY day;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_daily_scans IS 
'Returns daily scan counts grouped by the specified timezone. Used for analytics aggregation.';

-- Function: Get hourly scans with timezone-aware grouping
CREATE OR REPLACE FUNCTION get_hourly_scans(
    p_qr_ids UUID[],
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ,
    p_timezone TEXT
)
RETURNS TABLE(hour INTEGER, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        EXTRACT(HOUR FROM (scanned_at AT TIME ZONE p_timezone))::INTEGER AS hour,
        COUNT(*)::BIGINT
    FROM scans
    WHERE qr_id = ANY(p_qr_ids)
      AND scanned_at >= p_start_date
      AND scanned_at <= p_end_date
    GROUP BY hour
    ORDER BY hour;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_hourly_scans IS 
'Returns hourly scan counts grouped by the specified timezone. Used for peak time analytics.';

-- ============================================================================
-- Migration Complete
-- ============================================================================
-- Next steps:
-- 1. Run this migration: psql -d your_database -f add_workspace_timezone.sql
-- 2. Update backend to use resolveAnalyticsTimezone()
-- 3. Remove browser timezone from frontend API calls
-- ============================================================================
