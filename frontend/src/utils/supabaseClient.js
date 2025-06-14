import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fzzzyroecljjizkjucud.supabase.co';  // замени
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6enp5cm9lY2xqaml6a2p1Y3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTI0MDUsImV4cCI6MjA2NTM4ODQwNX0.PIp4mGwwz1kB3YIAYxtf1yI50KxFyFFFkNYrYle_J9g';                     // замени

export const supabase = createClient(supabaseUrl, supabaseAnonKey);