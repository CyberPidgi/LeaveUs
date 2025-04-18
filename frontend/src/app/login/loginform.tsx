"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/app/login/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/login/components/form";
import { Input } from "./components/input";
import { PasswordField } from "./components/password-input";
import { useAuth } from "../AuthProvider";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function MyForm() {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const { login } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const axiosJwt = axios.create();
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await login(values);
    console.log("result", result)   
    if (result){
        toast.success('Login successful', { id: 'login'});
    } else {
        toast.error('Invalid credentials', { id: 'login'});
    }
  }
  useEffect(() => {
    const Auth = (token: string) => {
      try {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        const userRole = decodedToken.role;
        const axiosIntercept = axios.interceptors.request.use((config: any) => {
          config.headers["Authorization"] = `Bearer ${token}`;
          return config;
        });
        console.log(role);
        if (userRole) {
          router.push(`/${userRole}-dashboard`);
        } else {
          router.push(`/login`);
        }
        return () => {
          axios.interceptors.request.eject(axiosIntercept);
        };
      } catch {
        console.error("Token Decoding error");
      }
    };
    if (token) {
      Auth(token);
    } else {
      router.push("/login");
    }
  }, [token]);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100 p-6 min-w-screen"
      style={{
        backgroundImage: "url('./IIITKbetter.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 bg-white/30 shadow-lg backdrop-blur-lg rounded-xl p-8 border border-gray-200"
          >
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Login
              </h2>
              <p className="text-sm text-gray-700">
                Enter your credentials to access your account
              </p>
            </div>

            <div className="space-y-4">
              {/* Username Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      UserId
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-black transition-all duration-200 text-sm shadow-sm "
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Password
                    </FormLabel>
                    <FormControl>
                      <PasswordField
                        placeholder="Enter your password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-black transition-all duration-200 text-sm shadow-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-medium rounded-lg py-2.5 text-sm shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Sign in
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
