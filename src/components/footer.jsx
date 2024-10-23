import Link from "next/link"

export default function Footer() {
  return (
    <footer className="text-center">
      <Link href="/" className="text-blue-500">Purchase the Notion template here</Link><br />
      <span>&copy;2024 Your New Business Idea</span>
    </footer>
  );
}