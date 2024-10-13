import BusinessIdeaTable from "@/components/businessIdeaTable"

export default function Home() {
  return (
    <main className='max-w-5xl mx-auto p-6'>
      <h1 className='text-4xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200'>
        Your Next Business Idea
      </h1>

      <BusinessIdeaTable />
    </main>
  );
}
