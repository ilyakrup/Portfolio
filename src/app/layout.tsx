import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Илья — Frontend & Product Developer | Разработка чат-ботов TG, VK, MAX",
  description:
    "Портфолио Ильи: разработка современных веб-приложений на Next.js с 3D-анимациями и интеллектуальных чат-ботов для Telegram, ВКонтакте и платформы MAX. Живые кейсы на Vercel.",
  keywords: [
    "Frontend Developer",
    "Product Developer",
    "Разработка чат-ботов",
    "Telegram боты",
    "VK боты",
    "MAX платформа",
    "Next.js",
    "React Three Fiber",
    "3D портфолио",
    "Vercel",
  ],
  authors: [{ name: "Илья" }],
  openGraph: {
    title: "Илья — Frontend & Product Developer",
    description:
      "Создание современных веб-сервисов и умных чат-ботов для бизнеса. Смотрите живые проекты на Vercel.",
    type: "website",
    locale: "ru_RU",
  },
};

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050508] text-zinc-100 min-h-screen relative`}
      >
        {children}
      </body>
    </html>
  );
}
