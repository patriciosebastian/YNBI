import Link from "next/link"

export default function Footer() {
  return (
    <footer className="text-center">
      <Link href="https://patriciosalazar.ck.page/products/your-next-business-idea-notion-template" className="text-blue-500" target="_blank">Purchase the Notion template here</Link><br />
      <span>&copy;2024 Your Next Business Idea</span>
    </footer>
  );
}