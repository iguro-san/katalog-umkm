"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginAdmin(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Login gagal: " + error.message };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/admin/login");
}

export async function gantiPasswordAdmin(prevState, formData) {
  const supabase = await createClient();

  // Memeriksa apakah admin sudah login di server (Aturan Keamanan #3)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  const passwordBaru = formData.get("password_baru");
  const konfirmasiPassword = formData.get("konfirmasi_password");

  if (!passwordBaru || passwordBaru.length < 8) {
    return { error: "Password baru minimal harus 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak cocok." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return { error: "Gagal mengganti password: " + error.message };
  }

  return { success: "Password berhasil diperbarui." };
}