export default function SetupGuide() {
    return (
        <div className="page-container" style={{ maxWidth: '800px' }}>
            <div className="card" style={{ padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src="/modak.png" alt="Modak" style={{ height: '3.5rem', display: 'inline-block' }} />
                    <h1 style={{ marginTop: '1rem', color: 'var(--primary)' }}>Welcome to Modak Order Manager!</h1>
                    <p style={{ color: 'var(--text-muted)' }}>You're almost there. Just a little setup needed.</p>
                </div>

                <div style={{ background: 'var(--warning-light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--warning)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        ⚠️ Supabase Backend Not Configured
                    </h3>
                    <p>This application relies on Supabase for database and authentication. To get started, you need to connect your own free Supabase project.</p>
                </div>

                <div style={{ marginTop: '2.5rem' }}>
                    <h3>🔧 Quick Setup Steps:</h3>

                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <strong>1. Create a Project</strong>
                            <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>Go to <a href="https://supabase.com" target="_blank" rel="noreferrer">supabase.com</a>, sign in, and create a new project (the free tier is perfect).</p>
                        </div>

                        <div>
                            <strong>2. Run the SQL Setup Script</strong>
                            <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                                In your Supabase dashboard, go to <strong>SQL Editor</strong>. Copy the contents of the <code>supabase-setup.sql</code> file included in this project, paste it into the editor, and click Run.
                            </p>
                        </div>

                        <div>
                            <strong>3. Configure Auth & Users</strong>
                            <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                                Go to <strong>Authentication → Providers → Email</strong> and disable "Confirm email".<br />
                                Then go to <strong>Authentication → Users</strong> and create two users: <code>accountant@yourdomain.com</code> and <code>admin@yourdomain.com</code>.<br />
                                Finally, insert their UUIDs into the <code>profiles</code> table as described at the bottom of the SQL script.
                            </p>
                        </div>

                        <div>
                            <strong>4. Connect this App</strong>
                            <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                                Go to <strong>Project Settings → API</strong>. Copy your <code>Project URL</code> and <code>anon</code> public key.<br />
                                Create a <code>.env.local</code> file in the root of this codebase and add them:
                            </p>
                            <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: 'var(--radius-sm)', marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                VITE_SUPABASE_URL=https://your-project.supabase.co<br />
                                VITE_SUPABASE_ANON_KEY=your-anon-key-here
                            </pre>
                        </div>
                    </div>

                    <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Once you've added your credentials to <code>.env.local</code>, restart the development server.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
