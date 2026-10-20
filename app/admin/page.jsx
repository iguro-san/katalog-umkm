import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createClient } from "@/lib/supabase/server";
import { supabaseServer } from "@/lib/supabase";

export default async function HalamanAdminProduk() {
  let daftarProduk = [];
  let pesanError = null;

  try {
    const supabase = await createClient();
    let { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("created_at", { ascending: false });

    if (error && supabaseServer) {
      const res = await supabaseServer
        .from("produk")
        .select("*")
        .order("created_at", { ascending: false });
      data = res.data;
      error = res.error;
    }

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message;
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Produk</h1>
          <p className="mt-1 text-sm text-teks-lembut">Kelola daftar produk katalog toko.</p>
        </div>
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {pesanError && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          Gagal mengambil data produk: {pesanError}
        </div>
      )}

      {!pesanError && daftarProduk.length === 0 ? (
        <p className="text-teks-lembut italic">Belum ada produk</p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
