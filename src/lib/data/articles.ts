import { desc, eq } from "drizzle-orm";
import redis from "@/cache";
import db from "@/db";
import { articles, usersSync } from "@/db/schema";
import { stackServerApp } from "@/stack/server";

export async function getArticles() {
  await stackServerApp.getUser({ or: "redirect" });
  const cached = await redis.get<typeof response>("articles:all");
  if (cached) {
    return cached;
  }
  const response = await db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      content: articles.content,
      createdAt: articles.createdAt,
      author: usersSync.name,
      imageUrl: articles.imageUrl,
      summary: articles.summary,
    })
    .from(articles)
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id))
    .orderBy(desc(articles.createdAt));

  await redis.set("articles:all", response, {
    ex: 60,
  });
  return response;
}

export async function getArticle(id: number) {
  await stackServerApp.getUser({ or: "redirect" });
  const response = await db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      content: articles.content,
      createdAt: articles.createdAt,
      author: usersSync.name,
      imageUrl: articles.imageUrl,
      summary: articles.summary,
    })
    .from(articles)
    .where(eq(articles.id, id))
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id));

  return response[0] ? response[0] : null;
}
