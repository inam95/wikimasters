"use server";

import redis from "@/cache";

const keyFor = (id: number) => `pageviews:article:${id}`;

export async function incrementPageView(id: number) {
  const articleKey = keyFor(id);
  const newVal = await redis.incr(articleKey);
  return +newVal;
}
