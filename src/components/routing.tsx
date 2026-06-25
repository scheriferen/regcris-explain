import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

interface Props {
  children: React.ReactNode
  requiredRole?: 'admin' | 'coordinator'
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { currentUser } = useAuth()

  // not logged in at all → back to login
  if (!currentUser) return <Navigate to="/" replace />

  // logged in but wrong role → back to login
  if (requiredRole && currentUser.role !== requiredRole) return <Navigate to="/" replace />

  return <>{children}</>
}