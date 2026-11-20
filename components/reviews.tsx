import { Quote } from "lucide-react";
import { db } from "@/lib/db";
import { defaultHomepageContent } from "@/lib/homepage-defaults";
import { AccentText } from "./accent-text";

export async function Reviews({
  text = defaultHomepageContent().reviews.text,
}: {
  text?: Record<string, string>;
}) {
  const reviews = await db.review.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }, { id: "asc" }],
  });
  if (!reviews.length) return null;

  return (
    <section
      id="reviews"
      className="reviews-section"
      aria-labelledby="reviews-title"
    >
      <div className="container section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">{text.eyebrow}</div>
            <h2 id="reviews-title">
              <AccentText text={text.title} />
            </h2>
            <p>{text.description}</p>
          </div>
        </div>
        <div className="testimonial-spread">
          {reviews.map((review, index) => (
            <figure
              className={
                index === 0
                  ? "testimonial testimonial-lead"
                  : "testimonial testimonial-note"
              }
              key={review.id}
            >
              <Quote className="review-quote" size={25} aria-hidden="true" />
              <blockquote>{review.content}</blockquote>
              <figcaption>
                <span className="review-avatar" aria-hidden="true">
                  {Array.from(review.author)[0].toUpperCase()}
                </span>
                <span>{review.author}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
