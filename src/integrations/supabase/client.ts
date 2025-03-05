
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ppvpmvznshwrjgndjzps.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwdnBtdnpuc2h3cmpnbmRqenBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExOTg2NTYsImV4cCI6MjA1Njc3NDY1Nn0.nkz9L4uqGtR4bdgNdk55xT_bqx7gbdMsM-UtWeLW0yo";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
