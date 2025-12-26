"use server";

import redis from "@/cache";
import sendCelebrationEmail from "@/email/celebration-email";

const mileStones = [10, 50, 100, 1000, 10000];

const keyFor = (id: number) => `pageviews:article:${id}`;

export async function incrementPageView(id: number) {
  const articleKey = keyFor(id);
  const newVal = await redis.incr(articleKey);

  if (mileStones.includes(newVal)) {
    sendCelebrationEmail(id, newVal);
  }

  return +newVal;
}
