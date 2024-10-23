import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="w-full justify-center items-center mb-8 rounded shadow-sm">
      <ul className="w-1/3">
        <li></li>
      </ul>
      <ul className="w-1/3">
        <li className="mx-auto text-2xl sm:text-3xl lg:text-4xl"><Link href="/" className="font-bold">YNBI</Link></li>
      </ul>
      <ul className="w-1/3">
        <li className="ml-auto"><Link href="/how-to-use" className="contrast">How to Use</Link></li>
      </ul>
    </nav>
  );
}