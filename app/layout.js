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
  title: {
    default: "Kushang Acharya | Frontend Engineer & Web Architect",
    template: "%s | Kushang Acharya"
  },
  description: "MSc IT graduate and Frontend Developer crafting premium, high-performance web applications with Next.js, React, and modern UI/UX architecture.",
  keywords: [
    "Kushang Acharya",
    "Frontend Engineer",
    "Web Architect",
    "Next.js Developer",
    "React Developer",
    "UI/UX Portfolio",
    "JavaScript Developer",
    "MSc IT Graduate",
    "Software Engineer Portfolio",
    "Vadodara Developer",
    "India Web Developer"
  ],
  authors: [{ name: "Kushang Acharya", url: "https://kushangacharya.vercel.app" }],
  creator: "Kushang Acharya",
  publisher: "Kushang Acharya",
  alternates: {
    canonical: "https://kushangacharya.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Kushang Acharya | Frontend Engineer & Web Architect",
    description: "MSc IT graduate and Frontend Developer crafting premium, high-performance web applications with Next.js, React, and modern UI/UX architecture.",
    url: "https://kushangacharya.vercel.app",
    siteName: "Kushang Acharya Portfolio",
    images: [
      {
        url: "/profile-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kushang Acharya - Frontend Engineer Portrait",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kushang Acharya | Frontend Engineer & Web Architect",
    description: "MSc IT graduate and Frontend Developer crafting premium, high-performance web applications with Next.js, React, and modern UI/UX architecture.",
    images: ["/profile-image.jpg"],
  },
  verification: {
    google: "google-site-verification-placeholder",
  },
};

export const viewport = {
  themeColor: "#16130b",
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://kushangacharya.vercel.app/#person",
        "name": "Kushang Acharya",
        "jobTitle": "Frontend Engineer & Web Architect",
        "url": "https://kushangacharya.vercel.app",
        "sameAs": [
          "https://github.com/Kushang1901",
          "https://linkedin.com/in/kushang-acharya"
        ],
        "image": "https://kushangacharya.vercel.app/profile-image.jpg",
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "MSc IT Graduate"
        },
        "knowsAbout": [
          "React.js",
          "Next.js",
          "JavaScript",
          "HTML5",
          "CSS3",
          "Tailwind CSS",
          "Node.js",
          "MongoDB",
          "Python",
          "Java",
          "Frontend Development",
          "UI/UX Design"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://kushangacharya.vercel.app/#website",
        "url": "https://kushangacharya.vercel.app",
        "name": "Kushang Acharya Portfolio",
        "publisher": {
          "@id": "https://kushangacharya.vercel.app/#person"
        }
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetBrainsMono.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

