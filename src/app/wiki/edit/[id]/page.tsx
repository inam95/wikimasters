import { notFound } from "next/navigation";
import WikiEditor from "@/components/wiki-editor";
import { getArticle } from "@/lib/data/articles";
import { stackServerApp } from "@/stack/server";

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { id } = await params;
  const user = await stackServerApp.getUser({ or: "redirect" });

  if (id === "new") {
    return (
      <WikiEditor
        isEditing={true}
        articleId={id}
        initialTitle=""
        initialContent=""
        authorId={user.id}
      />
    );
  }

  const article = await getArticle(+id);

  if (!article) {
    notFound();
  }

  return (
    <WikiEditor
      initialTitle={article.title}
      initialContent={article.content}
      isEditing={true}
      articleId={id}
      authorId={user.id}
    />
  );
}
