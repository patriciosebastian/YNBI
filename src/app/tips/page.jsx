export default function Tips() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold font-sans text-center text-balance">Tips</h1>
      {/* turn main nav into component and place here */}

      {/* Aside Nav */}
      <aside className="hidden lg:block lg:fixed right-28">
        <nav>
          <ul>
            <li><a href="#scoring-mechanisms">Scoring</a></li>
          </ul>
        </nav>
      </aside>

      {/* Scoring Mechanisms */}
      <section id="scoring-mechanisms">
        <h2 className="text-2xl font-bold text-balance">Scoring Mechanisms</h2>
        <article>
          <p>
            Note everyone values every scoring category the same. So, the app is designed to give you flexibility in how you score and prioritize your ideas, allowing you to use the <strong>Default Scoring</strong>, <strong>Custom Scoring</strong>, or <strong>Preset Scoring</strong>. Here&apos;s a breakdown of each:
          </p>

          {/* default scoring mechanisms */}
          <h3 className="text-xl">1. Default Scoring System</h3>
          <p>
            The app uses a <strong>default scoring system</strong> to balance the weight of each factor. These factors include:
          </p>
          <ul>
            <li className="list-inside list-disc"><strong>Effort</strong> (1x weight): How much work is involved in getting the idea off the ground.</li>
            <li className="list-inside list-disc"><strong>Knowledge</strong> (1.2x weight): How much expertise is needed to execute the idea.</li>
            <li className="list-inside list-disc"><strong>Interest</strong> (2x weight): Your personal enthusiasm or passion for the idea.</li>
            <li className="list-inside list-disc"><strong>Fun</strong> (1.5x weight): How enjoyable you think working on the idea will be.</li>
            <li className="list-inside list-disc"><strong>Time</strong> (1x weight): The time required to complete or see progress with the idea.</li>
            <li className="list-inside list-disc"><strong>Difficulty</strong> (1x weight): The general challenges you foresee in executing the idea.</li>
          </ul>
          <p>
            The default system is well-balanced and works for most users as a starting point for evaluating their ideas.
          </p>

          <h3 className="text-xl">2. Custom Scoring</h3>
          <p>
            <strong>Custom Weights</strong>: You can adjust each factor&apos;s weight manually to reflect your priorities. This allows you to fine-tune the scoring mechanism to match your unique situation or preferences.
          </p>
          <p>
            For instance, if you&apos;re passionate about your idea and enjoy what you&apos;re doing, you may assign more weight to <em>interest</em> and <em>fun</em> while downplaying <em>time</em> or <em>difficulty</em>. Conversely, if you&apos;re more focused on executing quickly, you can weigh <em>time</em> and <em>effort</em> more heavily.
          </p>

          {/* preset scoring options */}
          <h3 className="text-xl">3. Preset Scoring Options</h3>
          <p>
            The app provides <strong>preset scoring options</strong> that cater to specific priorities or goals:
          </p>
          <ul>
            <li className="list-inside list-disc"><strong>Time-Critical</strong>: Prioritize quick execution by giving more weight to <em>time</em> while keeping other factors balanced. Ideal for when you need to launch quickly.</li>
            <li className="list-inside list-disc"><strong>Passion-Driven</strong>: Focus on personal fulfillment, where <em>interest</em> and <em>fun</em> carry more weight. This is for users looking to pursue something they genuinely enjoy.</li>
            <li className="list-inside list-disc"><strong>Effort-Optimized</strong>: Minimize workload by giving more importance to <em>effort</em> and <em>difficulty</em>. This preset is perfect for balancing multiple projects or starting something manageable.</li>
          </ul>

          <h3 className="text-xl">How Scoring is Calculated</h3>
          <p>
            Each idea&apos;s score is calculated based on both <strong>positive</strong> and <strong>negative</strong> factors:
          </p>
          <ul>
            <li className="list-inside list-disc"><strong>Positive Factors</strong> include: Interest, Fun, Knowledge</li>
            <li className="list-inside list-disc"><strong>Negative Factors</strong> include: Effort, Difficulty, Time</li>
          </ul>
          <p>
            The app calculates a <strong>weighted score</strong> by balancing the positive factors against the negative ones, giving you an overall rating for each idea. The idea with the highest score is presented as the best one to pursue.
          </p>
        </article>
      </section>

      {/*  */}
    </main>
  );
}