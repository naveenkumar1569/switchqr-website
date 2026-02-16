-- Secure Unrestricted Tables
-- Enable RLS and add policies to restrict access to data owners.
-- Run this in the Supabase SQL Editor.

-- 1. Transactions
-- Sensitive billing data. Users should only see their own.
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
ON transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Usage Events
-- Analytics logs. Users can view their own logs (if exposed in UI), otherwise private.
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage events"
ON usage_events FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 3. User Usage Stats
-- Aggregated stats shown in dashboard. RESTRICTED to owner.
ALTER TABLE user_usage_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage stats"
ON user_usage_stats FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 4. Workspaces
-- Organization data. Users can view/update the workspace they are attached to.
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- Allow read access if the user's profile points to this workspace
CREATE POLICY "Users can view own workspace"
ON workspaces FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT workspace_id FROM profiles WHERE id = auth.uid()
  )
);

-- Allow update access if the user's profile points to this workspace
CREATE POLICY "Users can update own workspace"
ON workspaces FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT workspace_id FROM profiles WHERE id = auth.uid()
  )
);
