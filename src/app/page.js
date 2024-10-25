import BusinessIdeaTable from "@/components/businessIdeaTable"

export default function Home() {
  return (
    <>
      <h1 className="text-base text-center text-balance font-normal mb-12">
        <span className="font-bold">Have many business and side project ideas?</span> Enter them in the table below to compare them on a scale and make the best decision on Your Next Business Idea. After you click the Calculate Best Idea button, you can <span className="underline">generate a free AI analysis on your top idea</span>.
      </h1>
      <BusinessIdeaTable />
    </>
  );
}
