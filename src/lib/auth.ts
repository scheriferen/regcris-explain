import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

export async function login(username: string, password: string) {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('username', username)
    .eq('is_active', true)
    .single()

  if (error || !data) throw new Error('Invalid username or password')

  const match = await bcrypt.compare(password, data.password)
  if (!match) throw new Error('Invalid username or password')

  return data // has role, is_active, etc.
}