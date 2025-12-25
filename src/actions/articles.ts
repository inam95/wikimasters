"use server";

import { stackServerApp } from "@/stack/server";

type CreateArticleInput = {
  title: string;
  content: string;
  authorId: string;
  imageUrl?: string;
};

type UpdateArticleInput = {
  id: string;
  title?: string;
  content?: string;
  imageUrl?: string;
};

export async function createArticle(data: CreateArticleInput) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("❌ Unauthorized");
  }

  console.log("createArticle called", data);
  return { success: true, message: "Article created" };
}

export async function updateArticle(data: UpdateArticleInput) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("❌ Unauthorized");
  }

  console.log("updateArticle called", data);
  return { success: true, message: "Article updated" };
}

export async function deleteArticleForm(id: string) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("❌ Unauthorized");
  }

  console.log("deleteArticle called", id);
  return { success: true, message: "Article deleted" };
}
