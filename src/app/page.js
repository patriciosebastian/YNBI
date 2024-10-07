import Link from "next/link"

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-4xl font-bold mb-4'>Business Idea Calculator</h1>
      <p className='text-lg mb-4'>
        Evaluate your business ideas based on various factors.
      </p>
      <Link
        href='/calculator'
        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700'
      >
        Start Calculating
      </Link>
    </main>
  );
}
