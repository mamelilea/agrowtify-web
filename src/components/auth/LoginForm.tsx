"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data.email, data.password);
    } catch (err) {
      console.error(err);
      setError("Login gagal. Silakan periksa email dan password Anda.");
    }
  };

  return (
    <div className="max-w-md mx-auto w-full text-white">
      <h1 className="text-4xl font-bold mb-2">Selamat Datang!</h1>
      <p className="mb-6 text-sm">
        Tidak punya akun?{" "}
        <Link
          href="/register"
          className="font-bold text-white hover:underline"
        >
          Daftar
        </Link>
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2 text-sm">
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Masukkan email Anda"
            className="w-full h-10 bg-gray-100 text-black"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-xs">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <label htmlFor="password" className="block font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Masukkan password anda"
            className="w-full h-10 bg-gray-100 text-black"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-xs">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {error && <div className="text-red-500 text-xs">{error}</div>}

        <Button
          type="submit"
          className="w-full bg-primary-200 hover:bg-primary-300 cursor-pointer text-white h-10 rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "Masuk"}
        </Button>
      </form>
    </div>
  );
}
