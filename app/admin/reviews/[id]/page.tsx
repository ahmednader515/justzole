import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminHeading } from "@/components/admin-ui";
import { ReviewForm } from "@/components/review-form";

export default async function EditReview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const review = await db.review.findUnique({ where: { id } });
  if (!review) notFound();
  return (
    <>
      <AdminHeading
        title="Edit review"
        description="Update the review text, display name, or visibility."
      />
      <ReviewForm
        review={{
          id: review.id,
          author: review.author,
          content: review.content,
          published: review.published,
          sortOrder: review.sortOrder,
        }}
      />
    </>
  );
}
