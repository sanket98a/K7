'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@/i18n/navigation"
import useAuth from "@/hooks/user-auth"
import { AuthErrorMessage } from "./AlertMessages/AuthError"
import { ButtonLoader } from "./Loaders/button-loader"
import google from '@/assets/google.svg'
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {
    setLoginInfo,
    handleLogin,
    errorMessages,
    isFetching
  } = useAuth()

  const t = useTranslations('auth')
  const locale = useLocale()
  const isRTL = locale === 'ar'

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col items-center gap-2 text-center mb-4">
        <h1 className="text-3xl font-poppins font-bold text-slate-700">{t('loginTitle')}</h1>
        <p className="text-balance text-sm text-muted-foreground text-slate-600">
          {t('loginWelcome')}
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2 text-slate-800">
          <Label htmlFor="email">{t('email')}</Label>
          <Input 
            onChange={(e) => setLoginInfo(prev => ({ ...prev, email: e.target.value }))} 
            id="email" 
            type="email" 
            className="border border-slate-600" 
            placeholder="m@example.com" 
            required 
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between text-slate-800">
            <Label htmlFor="password">{t('password')}</Label>
            <Link
              href="#"
              className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-sm underline-offset-4 hover:underline`}
            >
              {t('forgotPassword')}
            </Link>
          </div>
          <Input 
            id="password" 
            onChange={(e) => setLoginInfo(prev => ({ ...prev, password: e.target.value }))} 
            className="border border-slate-600" 
            type="password" 
            required 
          />
        </div>
        <AuthErrorMessage messages={errorMessages} />
        <Button 
          onClick={(e) => handleLogin(e)} 
          disabled={isFetching} 
          type="submit" 
          className="w-full bg-slate-700"
        >
          {isFetching ? <ButtonLoader /> : t('login')}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            {t('orContinueWith')}
          </span>
        </div>
        <div className="oAuthButtons">
          <Button variant="outline" className="w-full">
            <Image src={google} alt="google" className="w-6" />
            <span>{t('google')}</span>
          </Button>
        </div>
      </div>
      <div className="text-center text-sm">
        {t('dontHaveAccount')}{" "}
        <Link href="/signup" className="font-semibold underline underline-offset-4">
          {t('signup')}
        </Link>
      </div>
    </form>
  )
}
