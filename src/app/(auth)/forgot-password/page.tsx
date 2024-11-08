'use client'

import React, { useState } from 'react'
import { useAuth, useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Mail, Lock, KeyRound } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [secondFactor, setSecondFactor] = useState(false)

  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { isLoaded, signIn, setActive } = useSignIn()

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    router.push('/')
    return null
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      setSuccessfulCreation(true)
      toast.success('Password reset code sent to your email.')
    } catch (err: any) {
      console.error('Error:', err.errors[0].longMessage)
      toast.error(err.errors[0].longMessage)
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })

      if (result?.status === 'needs_second_factor') {
        setSecondFactor(true)
        toast.info('Two-factor authentication required.')
      } else if (result?.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        toast.success('Password reset successful. You are now signed in.')
        router.push('/')
      } else {
        console.log(result)
        toast.error('An unexpected error occurred.')
      }
    } catch (err: any) {
      console.error('Error:', err.errors[0].longMessage)
      toast.error(err.errors[0].longMessage)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            {!successfulCreation
              ? "Enter your email to receive a password reset code"
              : "Enter the code sent to your email and your new password"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={!successfulCreation ? handleCreate : handleReset} className="space-y-4">
            {!successfulCreation ? (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Reset Code</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter reset code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
              </>
            )}
            <Button type="submit" className="w-full">
              {!successfulCreation ? "Send Reset Code" : "Reset Password"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-600 mt-2">
            Remember your password?{' '}
            <a href="/sign-in" className="font-medium text-blue-600 hover:underline">
              Sign In
            </a>
          </p>
        </CardFooter>
      </Card>
      {secondFactor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Two-Factor Authentication Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Two-factor authentication is required, but this UI does not handle that yet.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setSecondFactor(false)} className="w-full">
                Close
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}