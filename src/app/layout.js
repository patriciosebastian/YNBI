import localFont from "next/font/local"
import "../styles/globals.css"

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

export const metadata = {
  title: "Your New Business Idea",
  description: "Evaluate and compare your business ideas to identify the best one to start next, with detailed analysis and actionable insights to guide your next steps.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Try to use Next Head later */}
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.classless.slate.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
