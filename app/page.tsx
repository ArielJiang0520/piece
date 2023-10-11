import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Index() {
  redirect('/worlds')
  return (
    <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
      <div className="flex flex-col items-center mb-4 lg:mb-12">
        <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
        <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
          The fastest way to start building apps with{' '}
          <strong>Supabase</strong> and <strong>Next.js</strong>
        </p>
        <div className="bg-foreground py-3 px-6 rounded-lg font-mono text-sm text-background">
          Get started by editing <strong>app/page.tsx</strong>
        </div>
      </div>
      <div className="flex flex-col items-center mb-4 lg:mb-12">
        <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
        <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
          The fastest way to start building apps with{' '}
          <strong>Supabase</strong> and <strong>Next.js</strong>
        </p>
        <div className="bg-foreground py-3 px-6 rounded-lg font-mono text-sm text-background">
          Get started by editing <strong>app/page.tsx</strong>
        </div>
      </div>
      <div className="flex flex-col items-center mb-4 lg:mb-12">
        <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
        <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
          The fastest way to start building apps with{' '}
          <strong>Supabase</strong> and <strong>Next.js</strong>
        </p>
        <div className="bg-foreground py-3 px-6 rounded-lg font-mono text-sm text-background">
          Get started by editing <strong>app/page.tsx</strong>
        </div>
      </div>
      <div className="flex flex-col items-center mb-4 lg:mb-12">
        <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
        <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
          The fastest way to start building apps with{' '}
          <strong>Supabase</strong> and <strong>Next.js</strong>
        </p>
        <div className="bg-foreground py-3 px-6 rounded-lg font-mono text-sm text-background">
          Get started by editing <strong>app/page.tsx</strong>
        </div>
      </div>
      <div className="flex flex-col items-center mb-4 lg:mb-12">
        <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
        <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
          The fastest way to start building apps with{' '}
          <strong>Supabase</strong> and <strong>Next.js</strong>
        </p>
        <div className="bg-foreground py-3 px-6 rounded-lg font-mono text-sm text-background">
          Get started by editing <strong>app/page.tsx</strong>
        </div>
      </div>
      <div className="flex flex-col items-center mb-4 lg:mb-12">
        <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
        <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
          The fastest way to start building apps with{' '}
          <strong>Supabase</strong> and <strong>Next.js</strong>
        </p>
        <div className="bg-foreground py-3 px-6 rounded-lg font-mono text-sm text-background">
          Get started by editing <strong>app/page.tsx</strong>
        </div>
      </div>
      <div className="flex flex-col items-center mb-4 lg:mb-12">
        <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
        <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
          The fastest way to start building apps with{' '}
          <strong>Supabase</strong> and <strong>Next.js</strong>
        </p>
        <div className="bg-foreground py-3 px-6 rounded-lg font-mono text-sm text-background">
          Get started by editing <strong>app/page.tsx</strong>
        </div>
      </div>
    </div>
  )
}
