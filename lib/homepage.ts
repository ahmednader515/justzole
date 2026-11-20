import { cache } from "react";
import { db } from "./db";
import { mergeHomepageContent } from "./homepage-defaults";

export const getHomepageContent = cache(async () => {
  return mergeHomepageContent(await db.homepageSection.findMany());
});
