"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveReview } from "@/lib/review-actions";

type EditableReview = {
  id: string;
  author: string;
  content: string;
  published: boolean;
  sortOrder: number;
};

export function ReviewForm({ review }: { review?: EditableReview }) {
  const [state, action, pending] = useActionState(saveReview, {});
  return (
    <form action={action} className="stack-form">
      <input type="hidden" name="id" value={review?.id || ""} />
      <section className="panel stack-form">
        <label>
          Reviewer display name
          <input
            name="author"
            required
            maxLength={80}
            defaultValue={review?.author || "Community member"}
          />
        </label>
        <p className="field-help">
          Use “Community member” when the reviewer’s name is not provided.
        </p>
        <label>
          Review text
          <textarea
            name="content"
            required
            minLength={3}
            maxLength={5000}
            rows={8}
            defaultValue={review?.content}
            placeholder="Paste the customer’s review…"
          />
        </label>
        <label>
          Display order
          <input
            name="sortOrder"
            type="number"
            required
            min={0}
            max={100000}
            step={1}
            defaultValue={review?.sortOrder ?? 0}
          />
        </label>
        <p className="field-help">Lower numbers appear first.</p>
        <label className="checkbox">
          <input
            type="checkbox"
            name="published"
            defaultChecked={review?.published ?? true}
          />{" "}
          Published on the website
        </label>
      </section>
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <div className="form-actions">
        <button className="button" disabled={pending}>
          {pending ? "Saving…" : "Save review"}
        </button>
        <Link className="button button-outline" href="/admin/reviews">
          Cancel
        </Link>
      </div>
    </form>
  );
}
