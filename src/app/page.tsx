import { WikiCard } from "@/components/wiki-card";
import { getArticles } from "@/lib/data/articles";

export default async function Home() {
  const articles = await getArticles();
  return (
    <div>
      <main className="max-w-2xl mx-auto mt-10 flex flex-col gap-6">
        {articles.map((article) => (
          <WikiCard
            key={article.id}
            title={article.title}
            author={article.author ?? ""}
            date={article.createdAt}
            summary={article.content}
            href={`/wiki/${article.id}`}
          />
        ))}
      </main>
    </div>
  );
}
