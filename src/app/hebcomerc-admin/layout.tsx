import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel – HEB Comerc",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        body > header,
        body > footer { display: none !important; }
        body > main { padding: 0 !important; }
        body { background: #0b0f1a !important; }
      `}</style>
      {children}
    </>
  );
}
