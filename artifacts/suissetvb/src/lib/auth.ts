import { supabase } from './supabase';

export const upsertUser = async (user: any) => {
  try {
    const { id, user_metadata, email } = user;
    
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingUser) {
      await supabase.from('users').insert({
        id,
        email,
        nom: user_metadata?.nom || '',
        prenom: user_metadata?.prenom || '',
        pays: user_metadata?.pays || '',
        telephone: user_metadata?.telephone || '',
        date_inscription: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error upserting user:', error);
  }
};
