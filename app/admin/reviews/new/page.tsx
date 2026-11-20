import { requireAdmin } from "@/lib/auth";
import { AdminHeading } from "@/components/admin-ui";
import { ReviewForm } from "@/components/review-form";

export default async function NewReview() {
  await requireAdmin();
  return (
    <>
      <AdminHeading
        title="Add a review"
        description="Share a customer’s experience with the community."
      />
      <ReviewForm />
    </>
  );
}
