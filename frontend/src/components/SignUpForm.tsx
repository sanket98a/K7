'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGoogle } from "react-icons/fa"
import Link from "next/link"
import useAuth from "@/hooks/user-auth"
import { AuthErrorMessage } from "./Error/AuthError"
import { ButtonLoader } from "./Loaders/button-loader"
import google from '@/assets/google.svg'
import Image from "next/image"

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {setSignupInfo,errorMessages,handleSignUp,isFetching} = useAuth()
  return (
    <form className={cn("flex flex-col gap-6 ", className)} {...props}>
      <div className="flex flex-col  items-center gap-2 text-center mb-4">
        <h1 className="text-3xl font-poppins font-bold text-slate-700">Sign Up for K7</h1>
        <p className="text-balance text-sm text-muted-foreground text-slate-600">
          Please Provide the following details to create an account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2 text-slate-800">
          <Label htmlFor="email Name">Name</Label>
          <Input id="name" onChange={(e)=>setSignupInfo(prev=>({...prev,name:e.target.value}))} type="text" className="border border-slate-600" placeholder="john" required />
        </div>
        {/* {errorMessages.name && <p className="text-red-500">{errorMessages.name[0]}</p>} */}
        <div className="grid gap-2 text-slate-800">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" onChange={(e)=>setSignupInfo(prev=>({...prev,email:e.target.value}))} className="border border-slate-600" placeholder="m@example.com" required />
        </div>
        {/* {errorMessages.email && <p className="text-red-500">{errorMessages.email[0]}</p>} */}
        <div className="grid gap-2 text-slate-800">
            <Label htmlFor="password">Password</Label>
          
          <Input id="password" onChange={(e)=>setSignupInfo(prev=>({...prev,password:e.target.value}))} className="border border-slate-600" type="password" required />
        </div>
        {/* {errorMessages.password && <p className="text-red-500">{errorMessages.password[0]}</p>} */}
        <AuthErrorMessage messages={errorMessages}  />
        <Button onClick={(e)=>handleSignUp(e)} disabled={isFetching} type="submit" className="w-full bg-slate-700">
          {isFetching?<ButtonLoader/>:'Signup'}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
           <div className="oAuthButtons">
                     
                        <Button variant="outline" className="w-full">
                        <Image src={google} alt="google"  className="w-6 " />
                          <span className=""> Google</span>
                        </Button>
                      </div>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className=" font-semibold underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  )
}
