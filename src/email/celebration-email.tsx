import { eq } from "drizzle-orm";
import db from "@/db";
import { articles, usersSync } from "@/db/schema";
import resend from "@/email";
import CelebrationTemplate from "./templates/celebration-template";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:3000`;

export default async function sendCelebrationEmail(
  articleId: number,
  pageviews: number,
) {
  const response = await db
    .select({
      email: usersSync.email,
      id: usersSync.id,
      name: usersSync.name,
      articleTitle: articles.title,
    })
    .from(articles)
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id))
    .where(eq(articles.id, articleId));

  const { email, id, name, articleTitle } = response[0];

  if (!email) {
    return;
  }

  const emailRes = await resend.emails.send({
    from: "Wikimasters <onboarding@resend.dev>",
    to: "mfihassan99@gmail.com",
    subject: `✨ Your article on Wikimasters has reached ${pageviews} pageviews!`,
    react: (
      <CelebrationTemplate
        name={name ?? "User"}
        pageviews={pageviews}
        articleTitle={articleTitle}
        articleUrl={`${baseUrl}/wiki/${articleId}`}
      />
    ),
  });

  if (!emailRes.error) {
    console.log(
      `📧 sent ${id} a celebration for getting ${pageviews} on article ${articleId}`,
    );
  } else {
    console.log(
      `❌ error sending ${id} a celebration for getting ${pageviews} on article ${articleId}`,
      emailRes.error,
    );
  }
}
