// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kwwxpnayqiuamosfacde.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3d3hwbmF5cWl1YW1vc2ZhY2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2ODIzNjAsImV4cCI6MjA1OTI1ODM2MH0.jZfjZ3Fw_RdKCMgk_thfzGbHkaC-rEB7ZQFhabOKHXk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);