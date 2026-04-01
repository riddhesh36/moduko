import { createContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Sync session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null)
            if (!session?.user) {
                setLoading(false)
            }
        }).catch(err => {
            console.error('Session fetch error:', err)
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null)
                if (!session?.user) {
                    setRole(null)
                    setLoading(false)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
        if (!user) return

        let isMounted = true

        async function fetchRole() {
            try {
                // Add a timeout to prevent infinite hangs
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('fetchRole timed out')), 8000)
                )

                const rolePromise = supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                const { data, error } = await Promise.race([rolePromise, timeoutPromise])

                if (error) throw error
                if (isMounted) {
                    setRole(data?.role || null)
                }
            } catch (err) {
                console.error('Error fetching role:', err.message || err)
                if (isMounted) setRole(null)
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        fetchRole()

        return () => {
            isMounted = false
        }
    }, [user?.id])

    async function login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) throw error
        return data
    }

    async function logout() {
        await supabase.auth.signOut()
        setUser(null)
        setRole(null)
    }

    return (
        <AuthContext.Provider value={{ user, role, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
