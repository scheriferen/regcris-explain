import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

export async function login(username: string, password: string) {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('username', username)
    .eq('is_active', true)
    .single()

  console.log('data:', data)
  console.log('error:', error)

  if (error || !data) throw new Error('Invalid username or password')

  const match = await bcrypt.compare(password, data.password)
  console.log('password match:', match)

  if (!match) throw new Error('Invalid username or password')

  return data
}