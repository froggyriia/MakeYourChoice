// utils/validation.js
import { supabase } from '../utils/supabaseClient';

export const isInnopolisEmail = (email) =>
    email.endsWith('@innopolis.university');

export async function isAdmin(email) {
        try {
        const { data, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) {
               console.error('Not an admin or database error:', error);
               return false;
        }

        return true;
    } catch (err) {
        console.error('Unexpected error in isAdmin:', err);
        return false;
  }
  };

export async function isStudent(email) {
    const { data, error } = await supabase
        .from('emails_groups')
        .select('email')
        .eq('email', email)
        .single();

    return !error && data;
}