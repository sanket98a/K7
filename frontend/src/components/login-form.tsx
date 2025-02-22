'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGoogle } from "react-icons/fa"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { login } from "@/actions/auth-action"
import { useActionState, useState } from "react"
import useAuth from "@/hooks/user-auth"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {

  

const {  loginInfo,
  setLoginInfo,
  handleLogin,
  errorMessages} = useAuth()



 


  return (
    <form  className={cn("flex flex-col gap-6 ", className)} {...props}>
      <div className="flex flex-col  items-center gap-2 text-center mb-4">
        <h1 className="text-3xl font-poppins font-bold text-slate-700">Login to K7</h1>
        <p className="text-balance text-sm text-muted-foreground text-slate-600">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
      {errorMessages.detail && <p className="text-red-500">{errorMessages.detail}</p>}
        <div className="grid gap-2 text-slate-800">
          <Label htmlFor="email">Email</Label>
          <Input onChange={(e)=>setLoginInfo(prev=>({...prev,email:e.target.value}))} id="email" type="email" className="border border-slate-600" placeholder="m@example.com" required />
        </div>
        {errorMessages.email && <p className="text-red-500">{errorMessages.email[0]}</p>}
        <div className="grid gap-2">
          <div className="flex items-center text-slate-800">
            <Label htmlFor="password">Password</Label>
            <Link
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input id="password" onChange={(e)=>setLoginInfo(prev=>({...prev,password:e.target.value}))} className="border border-slate-600" type="password" required />
        </div>
        {errorMessages.password && <p className="text-red-500">{errorMessages.password[0]}</p>}
        <Button onClick={(e)=>handleLogin(e)} type="submit" className="w-full bg-slate-700">
          Login
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
           <div className="oAuthButtons">
                     
                        <Button variant="outline" className="w-full">
                          <FaGoogle className="h-8 " />
                          <span className=""> Google</span>
                        </Button>
                      </div>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className=" font-semibold underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  )
}
