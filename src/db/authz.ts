import { eq } from "drizzle-orm";
import { articles } from "@/db/schema";
import db from ".";

export const authorizeUserToEditArticle =
  async function authorizeUserToEditArticle(
    loggedInUserId: string,
    articleId: number,
  ) {
    const response = await db
      .select({
        authorId: articles.authorId,
      })
      .from(articles)
      .where(eq(articles.id, articleId));

    if (response.length === 0) {
      return false;
    }

    return response[0].authorId === loggedInUserId;
  };
