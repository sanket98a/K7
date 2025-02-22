"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginService, signupService } from "@/lib/auth";
import { useAppStore } from "@/state/store";

const useAuth = () => {
  const router = useRouter();
  const{userInfo,setUserInfo}:any=useAppStore()

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string[] }>({});

  const testUser = {
    id: "1",
    email: "fahadabbas817@gmail.com",
    password: "password",
  };

  const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).trim(),
  });
  const signupSchema = z.object({
    name: z.string({ message: "Please enter your name" }).trim(),
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).trim(),
  });

  const handleLogin = async(e:any) => {
    e.preventDefault();
    const schemaTest = loginSchema.safeParse(loginInfo);

    if (!schemaTest.success) {
      setErrorMessages(schemaTest.error.flatten().fieldErrors);
      return;
    }

    try {
      const result = await loginService(loginInfo)
      setUserInfo(result)
      console.log(result)
      console.log(userInfo)
      router.push("/dashboard");

    } catch (error) {
      console.log(error)
    }

    // if (loginInfo.email !== testUser.email || loginInfo.password !== testUser.password) {
    //   setErrorMessages({ email: ["Invalid email or password"] });
    //   return;
    // }

    setErrorMessages({});
  
  };

  const handleLSignUp = async(e:any) => {
    e.preventDefault();
    const schemaTest = signupSchema.safeParse(signupInfo);

    if (!schemaTest.success) {
      setErrorMessages(schemaTest.error.flatten().fieldErrors);
      return;
    }

    try {
      const result = await signupService(signupInfo)
      console.log(result)
      router.push("/login");
    } catch (error:any) {
      console.log(error.detail)
      console.log(error)
      setErrorMessages(error?.detail)
    }

    // if (loginInfo.email !== testUser.email || loginInfo.password !== testUser.password) {
    //   setErrorMessages({ email: ["Invalid email or password"] });
    //   return;
    // }

    setErrorMessages({});
    
  };

  return {
    loginInfo,
    setLoginInfo,
    handleLogin,
    errorMessages,
    signupInfo,setSignupInfo,handleLSignUp
  };
};

export default useAuth;
