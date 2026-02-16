-- usage_tracking.sql
-- Migration to set up advanced usage tracking and atomic increments.
-- NOTE: These tables are intended for backend/service role access; RLS is not required
-- unless you specifically want to expose usage events to users via the client SDK.

-- 1. Append-only audit log for actions
CREATE TABLE IF NOT EXISTS usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  event_type text NOT NULL, -- 'link_update'
  qr_id bigint REFERENCES qrs(id),
  old_url text,
  new_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Performance projection for fast O(1) limit checks
CREATE TABLE IF NOT EXISTS user_usage_stats (
  user_id uuid PRIMARY KEY REFERENCES profiles(id),
  total_scans bigint DEFAULT 0,
  link_updates_count bigint DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

-- 3. Optimized Index
CREATE INDEX IF NOT EXISTS idx_usage_events_user_type_time
  ON usage_events(user_id, event_type, created_at DESC);

-- 4. RPC: Atomic Scan Increment
-- Handles upsert into user_usage_stats
CREATE OR REPLACE FUNCTION increment_total_scans(user_id_param uuid, qr_id_param bigint, inc_param int DEFAULT 1)
RETURNS void AS $$
BEGIN
  INSERT INTO user_usage_stats (user_id, total_scans, last_updated)
  VALUES (user_id_param, inc_param, now())
  ON CONFLICT (user_id)
  DO UPDATE SET 
    total_scans = user_usage_stats.total_scans + inc_param,
    last_updated = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RPC: Atomic Link Update tracking
-- Combined operation: Increments projection count AND inserts audit row
CREATE OR REPLACE FUNCTION increment_link_updates(user_id_param uuid, qr_id_param bigint, old_url_param text, new_url_param text)
RETURNS void AS $$
BEGIN
  -- 1. Increment stats
  INSERT INTO user_usage_stats (user_id, link_updates_count, last_updated)
  VALUES (user_id_param, 1, now())
  ON CONFLICT (user_id)
  DO UPDATE SET 
    link_updates_count = user_usage_stats.link_updates_count + 1,
    last_updated = now();

  -- 2. Log audit event
  INSERT INTO usage_events (user_id, event_type, qr_id, old_url, new_url)
  VALUES (user_id_param, 'link_update', qr_id_param, old_url_param, new_url_param);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
