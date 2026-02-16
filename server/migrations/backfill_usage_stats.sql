-- backfill_usage_stats.sql
-- One-time migration to populate user_usage_stats with historical data

-- 1. Backfill total_scans from existing scans table
INSERT INTO user_usage_stats (user_id, total_scans, link_updates_count, last_updated)
SELECT 
  q.owner_id as user_id,
  COUNT(s.id) as total_scans,
  0 as link_updates_count,  -- Will be zero since we're only tracking new updates going forward
  now() as last_updated
FROM qrs q
LEFT JOIN scans s ON s.qr_id = q.id
WHERE q.owner_id IS NOT NULL
GROUP BY q.owner_id
ON CONFLICT (user_id) 
DO UPDATE SET 
  total_scans = EXCLUDED.total_scans,
  last_updated = now();

-- 2. Verify the results
SELECT 
  user_id,
  total_scans,
  link_updates_count,
  last_updated
FROM user_usage_stats
ORDER BY total_scans DESC
LIMIT 10;
