import  { Inter } from "next/font/google"
import "../styles/globals.css"

const inter = Inter({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: "Your New Business Idea",
  description: "Evaluate and compare your business ideas to identify the best one to start next, with detailed analysis and actionable insights to guide your next steps.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`bg-slate-850 ${inter.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.slate.min.css"
        />
      </head>
      <body
        className="h-full !font-sans antialiased"
      >
        {children}
      </body>
    </html>
  );
}
