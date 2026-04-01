import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/Toast'

export default function Login() {
    const { user, role, login, loading: authLoading } = useAuth()
    const { addToast } = useToast()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Redirect if already logged in
    if (user && role) {
        return <Navigate to={role === 'admin' ? '/admin' : '/accountant'} replace />
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password')
            return
        }

        try {
            setLoading(true)
            await login(email.trim(), password)
            addToast('Welcome to Modak Order Manager!', 'success')
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.')
            addToast('Login failed. Please check your credentials.', 'error')
        } finally {
            setLoading(false)
        }
    }

    if (authLoading) {
        return (
            <div className="login-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <div className="loading-text">Loading...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-logo">
                    <img src="/modak.png" alt="Modak" style={{ height: '4rem', display: 'inline-block' }} />
                </div>
                <h1>Modak Order Manager</h1>
                <p className="login-subtitle">Manage your homemade modak orders with ease</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="login-email">Email Address</label>
                        <input
                            id="login-email"
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoComplete="email"
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="form-error" style={{ marginBottom: '0.75rem', justifyContent: 'center' }}>
                            ⚠ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                    >
                        {loading ? '⏳ Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <img src="/modak.png" alt="Modak" className="modak-icon" /> Made with love, for a business made with love
                </div>
            </div>
        </div>
    )
}
