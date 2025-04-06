'use client'

import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Halaman tidak ditemukan</h1>
      <p className="mb-6 text-gray-600">Halaman yang kamu cari tidak tersedia.</p>
      <button
        onClick={() => router.push('/')}
        className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Kembali ke Home
      </button>
    </div>
  )
}
