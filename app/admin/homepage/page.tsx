import { requireAdmin } from "@/lib/auth";
import { getHomepageContent } from "@/lib/homepage";
import { AdminHeading } from "@/components/admin-ui";
import { HomepageForm } from "@/components/homepage-form";

export default async function HomepageEditor() {
  await requireAdmin();
  const content = await getHomepageContent();
  return (
    <>
      <AdminHeading
        title="Homepage"
        description="Edit the text and choose which sections your visitors see."
      />
      <HomepageForm content={content} />
    </>
  );
}
