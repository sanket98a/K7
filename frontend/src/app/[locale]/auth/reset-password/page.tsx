import React from 'react'

const Page = () => {
  return (
    <div>page</div>
  )
}

export default Page

// import { ResetPasswordForm } from "./reset-password-form"

// export default function ResetPasswordPage({
//   searchParams,
// }: {
//   searchParams: { token?: string }
// }) {
//   const token = searchParams.token || ""

//   return (
//     <div className="container flex h-screen w-full flex-col items-center justify-center">
//       <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
//         <div className="flex flex-col space-y-2 text-center">
//           <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
//           <p className="text-sm text-muted-foreground">Enter your new password below.</p>
//         </div>
//         <ResetPasswordForm
//          token={token}
//           />
//       </div>
//     </div>
//   ) 
// }
