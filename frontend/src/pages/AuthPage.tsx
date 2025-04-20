import React from 'react'
import { Navigate } from 'react-router-dom'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'

const AuthPage = () => {
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (user) {
    return <Navigate to="/chat" replace />
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1d27] rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome to Doctor AI</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#4f46e5',
                  brandAccent: '#4338ca',
                }
              }
            }
          }}
          providers={[]}
        />
      </div>
    </div>
  )
}

export default AuthPage