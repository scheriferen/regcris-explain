import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

export interface Account {
  id: string
  username: string
  role: string
  is_active: boolean
  terminated: boolean
  terminated_at: string | null
  created_at: string
}

export async function fetchAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('id, username, role, is_active, terminated, terminated_at, created_at')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as Account[]
}

export async function createAccount(username: string, password: string, role: 'supervisor' | 'admin' = 'supervisor') {
  const hashed = await bcrypt.hash(password, 10)
  const { error } = await supabase
    .from('accounts')
    .insert({ username, password: hashed, role, is_active: true })
  if (error) throw error
}

// pass newPassword as "" to leave the password unchanged
export async function updateAccount(id: string, username: string, newPassword: string) {
  const updates: Record<string, any> = { username }
  if (newPassword) updates.password = await bcrypt.hash(newPassword, 10)

  const { error } = await supabase.from('accounts').update(updates).eq('id', id)
  if (error) throw error
}

export async function setActive(id: string, isActive: boolean) {
  const { error } = await supabase.from('accounts').update({ is_active: isActive }).eq('id', id)
  if (error) throw error
}

export async function terminateAccount(id: string) {
  const today = new Date().toISOString().split('T')[0]
  const { error } = await supabase
    .from('accounts')
    .update({ terminated: true, is_active: false, terminated_at: today })
    .eq('id', id)
  if (error) throw error
}

export async function clearTerminated() {
  const { error } = await supabase.from('accounts').delete().eq('terminated', true)
  if (error) throw error
}