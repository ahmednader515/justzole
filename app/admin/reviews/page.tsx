import Link from "next/link";
import { Pencil } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminHeading, EmptyAdmin } from "@/components/admin-ui";
import { DeleteReview } from "@/components/delete-review";

export default async function AdminReviews() {
  await requireAdmin();
  const reviews = await db.review.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }, { id: "asc" }],
  });
  return (
    <>
      <AdminHeading
        title="Reviews"
        description="Manage the customer reviews shown on your website."
        action
        actionHref="/admin/reviews/new"
        actionLabel="Add review"
      />
      {reviews.length ? (
        <div className="admin-reviews-list">
          {reviews.map((review) => (
            <article className="panel admin-review-card" key={review.id}>
              <div className="panel-heading">
                <div>
                  <h2>{review.author}</h2>
                  <p className="field-help">
                    {review.published ? "Published" : "Draft"} · Display order:{" "}
                    {review.sortOrder}
                  </p>
                </div>
                <div className="table-actions">
                  <Link
                    className="icon-button"
                    href={`/admin/reviews/${review.id}`}
                    aria-label={`Edit review by ${review.author}`}
                  >
                    <Pencil size={16} />
                  </Link>
                  <DeleteReview id={review.id} author={review.author} />
                </div>
              </div>
              <p className="admin-review-content">{review.content}</p>
            </article>
          ))}
        </div>
      ) : (
        <section className="panel">
          <EmptyAdmin
            title="No reviews yet"
            description="Add a customer review to feature it on the homepage."
          />
        </section>
      )}
    </>
  );
}
