"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { loginService } from "@/lib/auth";

const testUser = {
  id: "1",
  email: "fahadabbas817@gmail.com",
  password: "password",
};

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});
const signupSchema = z.object({
    name: z.string({message:"Please Enter Your Name"}),
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState: any, formData: FormData) {
    console.log('I am being triggered')
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;
// try {
//     await loginService({email,password})
    
// } catch (error) {
//     console.log(error)
// }

  if (email !== testUser.email || password !== testUser.password) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }

 console.log('successful',email,password)
  redirect("/dashboard");
}


// export async function signUp(prevState: any, formData: FormData) {
//   const result = signupSchema.safeParse(Object.fromEntries(formData));

//   if (!result.success) {
//     return {
//       errors: result.error.flatten().fieldErrors,
//     };
//   }

//   const {name,email, password } = result.data;
// // try {
// //     await loginService({email,password})
    
// // } catch (error) {
// //     console.log(error)
// // }

//   if (email !== testUser.email || password !== testUser.password) {
//     return {
//       errors: {
//         email: ["Invalid email or password"],
//       },
//     };
//   }

 

//   redirect("/login");
// }

