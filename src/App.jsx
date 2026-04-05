import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import { useAuth } from './hooks/useAuth'
import { supabase } from './lib/supabase'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import AccountantDashboard from './pages/AccountantDashboard'
import OrderFormPage from './pages/OrderFormPage'
import AccountantOrders from './pages/AccountantOrders'
import AdminDashboard from './pages/AdminDashboard'
import ManageSlots from './pages/ManageSlots'
import PublicOrderForm from './pages/PublicOrderForm'
import SetupGuide from './components/SetupGuide'

function ProtectedRoute({ children, allowedRole }) {
    const { user, role, loading } = useAuth()

    if (loading) {
        return (
            <div className="loading-container" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
                <div className="loading-text">Loading...</div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Role-based redirect
    if (allowedRole && role !== allowedRole) {
        if (!role) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center', marginTop: '10vh' }}>
                    <h2>No Role Assigned</h2>
                    <p>Your user account exists, but no role is assigned in the <code>profiles</code> table.</p>
                    <p>Please run the manual INSERT step from <code>supabase-setup.sql</code> in the Supabase SQL editor.</p>
                    <br />
                    <button className="btn btn-primary" onClick={() => supabase.auth.signOut()}>Logout</button>
                </div>
            )
        }
        return <Navigate to={role === 'admin' ? '/admin' : '/accountant'} replace />
    }

    return children
}

function AppRoutes() {
    const { user, role, loading } = useAuth()

    return (
        <>
            {user && <Navbar />}
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Accountant Routes */}
                <Route
                    path="/accountant"
                    element={
                        <ProtectedRoute allowedRole="accountant">
                            <AccountantDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/accountant/new"
                    element={
                        <ProtectedRoute allowedRole="accountant">
                            <OrderFormPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/accountant/orders"
                    element={
                        <ProtectedRoute allowedRole="accountant">
                            <AccountantOrders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/accountant/slots"
                    element={
                        <ProtectedRoute allowedRole="accountant">
                            <ManageSlots />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Root is now Public Order Form */}
                <Route
                    path="/"
                    element={<PublicOrderForm />}
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    )
}

export default function App() {
    const isSupabaseConfigured =
        import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co'

    if (!isSupabaseConfigured) {
        return <SetupGuide />
    }

    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastProvider>
                    <AppRoutes />
                </ToastProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}
