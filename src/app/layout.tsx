import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL, APP_NAME, APP_STORE_ID } from "@/lib/constants";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} - Discover Wellington`,
    template: `%s - ${APP_NAME}`,
  },
  description:
    "Follow locals, find the best spots, and see what's happening in Wellington.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    locale: "en_NZ",
  },
  twitter: {
    card: "summary_large_image",
  },
  other: {
    "apple-itunes-app": `app-id=${APP_STORE_ID}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NZ" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches)){d.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
