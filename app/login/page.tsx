'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

export default function Login() {
  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')
  // const [view, setView] = useState('sign-in')
  const router = useRouter()
  const supabase = createClientComponentClient()

  // const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   await supabase.auth.signUp({
  //     email,
  //     password,
  //     options: {
  //       emailRedirectTo: `${location.origin}/auth/callback`,
  //     },
  //   })
  //   setView('check-email')
  // }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github'
    })
    console.log(data, error)
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <button className='w-64 h-16 border-2'
        onClick={() => handleSignIn}>
        Sign in
      </button>
    </div>
  )
}
