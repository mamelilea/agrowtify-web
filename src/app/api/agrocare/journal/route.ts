import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth-node'; // Adjust the import path based on your project structure

// Mock journal data
const mockJournals = [
  {
    id: '1',
    date: Math.floor(new Date('2024-04-26').getTime() / 1000),
    title: 'Kembali Segar',
    content: 'Daun yang kemarin layu mulai terlihat segar kembali setelah aku menyiramnya sesuai jadwal yang biasanya.',
    imageUrl: '/images/mock/journal-1.jpg', // Replace with actual mock image path
  },
  {
    id: '2',
    date: Math.floor(new Date('2024-04-25').getTime() / 1000),
    title: 'Ada Sedikit Layu',
    content: 'Siang tadi aku melihat tanaman ku ada yang layu karena cuaca nya yang sangat panas. Mungkin karena tadi pagi aku lupa menyiram nya',
    imageUrl: '/images/mock/journal-2.jpg', // Replace with actual mock image path
  },
  {
    id: '3',
    date: Math.floor(new Date('2024-04-24').getTime() / 1000),
    title: 'Mulai Tumbuh',
    content: 'Hari ini daun kecil mulai tumbuh, aku tetap menyiramnya pagi dan sore seperti biasa. Senang melihat perubahan yang ada.',
    imageUrl: '/images/mock/journal-3.jpg', // Replace with actual mock image path
  },
  {
    id: '4',
    date: Math.floor(new Date('2024-04-23').getTime() / 1000),
    title: 'Tunas Pertama Muncul',
    content: 'Hari ini aku merasa senang! karena setelah beberapa hari menyiram dan merawat dengan sabar, akhirnya tanamanku menunjukkan tunas pertama nya.',
    imageUrl: '/images/mock/journal-4.jpg', // Replace with actual mock image path
  },
   {
    id: '5',
    date: Math.floor(new Date('2024-04-22').getTime() / 1000),
    title: 'Persiapan Tanam',
    content: 'Memulai menanam benih hari ini. Tanah sudah digemburkan dan diberi pupuk organik. Semoga tumbuh subur!',
    imageUrl: '/images/mock/journal-5.jpg', // Replace with actual mock image path
  },
    {
    id: '6',
    date: Math.floor(new Date('2024-04-21').getTime() / 1000),
    title: 'Penyiraman Rutin',
    content: 'Melakukan penyiraman rutin di pagi hari. Cuaca cukup cerah, jadi perlu memastikan tanah tetap lembab.',
    imageUrl: '/images/mock/journal-6.jpg', // Replace with actual mock image path
  },
];

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '-', 10) || undefined;
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder') || 'asc'; // default ascending

  let journals = [...mockJournals];

  // Apply sorting
  if (sortBy === 'date') {
    journals.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.date - b.date;
      } else {
        return b.date - a.date;
      }
    });
  }

  // Apply limit
  if (limit !== undefined) {
    journals = journals.slice(0, limit);
  }

  return NextResponse.json(journals);
}