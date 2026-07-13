import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-head",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  metadataBase: new URL("https://kushangacharya.vercel.app"),
  title: "Kushang Acharya | Frontend-first Developer",
  description: "A premium Next.js portfolio for Kushang Acharya, featuring an editorial dark theme, selected projects, technical skills, and contact details.",
  keywords: "Kushang Acharya, Frontend Developer, Next.js Portfolio, React, JavaScript, Web Developer, India",
  authors: [{ name: "Kushang Acharya" }],
  openGraph: {
    title: "Kushang Acharya | Frontend-first Developer",
    description: "Premium Next.js portfolio with a refined editorial dark theme.",
    images: [
      {
        url: "/profile-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kushang Acharya Portfolio",
      },
    ],
    url: "https://kushangacharya.vercel.app/",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#16130b",
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetBrainsMono.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

