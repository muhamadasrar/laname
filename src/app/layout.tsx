import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laname Store — Belanja Hemat, Produk Terbaik",
  description: "Temukan produk terbaik dengan harga termurah. Belanja aman langsung di Shopee dengan diskon eksklusif.",
  keywords: "belanja online, promo shopee, diskon, affiliate, produk murah",
  openGraph: {
    title: "Laname Store — Belanja Hemat, Produk Terbaik",
    description: "Temukan produk terbaik dengan harga termurah.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* Meta Pixel Code - Replace YOUR_PIXEL_ID with actual pixel ID */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'YOUR_PIXEL_ID');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#F5F5F5]">
        {children}
      </body>
    </html>
  );
}
