// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ display:'grid', placeItems:'center', minHeight:'60vh' }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Hemp’in Auth</h1>
        <p>Go to <Link href="/login" style={{ textDecoration:'underline' }}>Login</Link></p>
      </div>
    </main>
  );
}