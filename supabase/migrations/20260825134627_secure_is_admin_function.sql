-- The initial schema explicitly granted this helper to anon. Remove that
-- legacy grant so it remains callable only while evaluating authenticated RLS.
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
