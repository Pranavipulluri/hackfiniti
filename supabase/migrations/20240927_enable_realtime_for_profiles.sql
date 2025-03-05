
-- Enable realtime for profiles table
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
