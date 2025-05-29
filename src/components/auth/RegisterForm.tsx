"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
    email: z.string().email({ message: "Email tidak valid" }),
    password: z.string().min(6, { message: "Password minimal 6 karakter" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Konfirmasi password minimal 6 karakter" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { register: registerUser, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log("Form values:", data);
      setError(null);
      await registerUser(data.name, data.email, data.password);
    } catch (err) {
      console.error(err);
      setError("Registrasi gagal. Silakan coba lagi.");
    }
  };

  return (
    <div className="max-w-md mx-auto w-full text-white">
      <h1 className="text-4xl font-bold mb-2">Selamat Datang!</h1>
      <p className="mb-6 text-sm">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-white hover:underline">
          Masuk
        </Link>
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2 text-sm">
          <label htmlFor="name" className="block font-medium">
            Nama Lengkap
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Masukkan nama lengkap Anda"
            className="w-full h-10 bg-gray-100 text-black"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-red-500 text-xs">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

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
            placeholder="Masukkan password Anda"
            className="w-full h-10 bg-gray-100 text-black"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-xs">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2 text-sm ">
          <label htmlFor="confirmPassword" className="block font-medium">
            Konfirmasi Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Konfirmasi password Anda"
            className="w-full h-10 bg-gray-100 text-black"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        {error && <div className="text-red-500 text-xs">{error}</div>}

        <Button
          type="submit"
          className="w-full bg-primary-200 cursor-pointer text-white h-10 rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "Daftar"}
        </Button>
      </form>
    </div>
  );
}
