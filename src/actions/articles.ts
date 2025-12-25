"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import slugify from "slugify";
import db from "@/db";
import { authorizeUserToEditArticle } from "@/db/authz";
import { articles } from "@/db/schema";
import { ensureUserExists } from "@/db/sync-user";
import { stackServerApp } from "@/stack/server";

type CreateArticleInput = {
  title: string;
  content: string;
  authorId: string;
  imageUrl?: string;
};

type UpdateArticleInput = {
  title: string;
  content: string;
  imageUrl: string;
};

export async function createArticle(data: CreateArticleInput) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("❌ Unauthorized");
  }
  await ensureUserExists(user);

  const result = await db
    .insert(articles)
    .values({
      title: data.title,
      slug: slugify(data.title, { lower: true, strict: true }),
      content: data.content,
      authorId: user.id,
      published: true,
    })
    .returning({ id: articles.id });

  return { success: true, message: "Article created", id: result[0].id };
}

export async function updateArticle(id: string, data: UpdateArticleInput) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("❌ Unauthorized");
  }

  await ensureUserExists(user);

  if (!(await authorizeUserToEditArticle(user.id, +id))) {
    throw new Error("❌ Forbidden");
  }

  await db
    .update(articles)
    .set({
      title: data.title,
      slug: slugify(data.title, { lower: true, strict: true }),
      content: data.content,
    })
    .where(eq(articles.id, +id));

  return { success: true, message: "Article updated" };
}

export async function deleteArticle(id: string) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("❌ Unauthorized");
  }

  await ensureUserExists(user);
  if (!(await authorizeUserToEditArticle(user.id, +id))) {
    throw new Error("❌ Forbidden");
  }

  await db.delete(articles).where(eq(articles.id, +id));

  return { success: true, message: "Article deleted" };
}

export const deleteArticleForm = async (formData: FormData) => {
  const id = formData.get("id");
  if (!id) {
    throw new Error("❌ Invalid request");
  }
  await deleteArticle(id as string);
  redirect("/");
};
