"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth";
import { db } from "./db";
import { homepageDefinitions, homepageKeys } from "./homepage-defaults";
import type { FormState } from "./actions";
import { isProductVideoUrl } from "./video";

export async function saveHomepage(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  if (
    [...form.entries()].some(
      ([key, value]) => key.endsWith("Uploading") && value === "yes",
    )
  )
    return { error: "Wait for video uploads to finish before saving." };
  const updates = [];
  for (const key of homepageKeys) {
    const text: Record<string, string> = {};
    for (const [name, definition] of Object.entries(
      homepageDefinitions[key].fields,
    )) {
      const parsed = z
        .string()
        .max(12000)
        .safeParse(form.get(`${key}.${name}`));
      if (!parsed.success)
        return {
          error: `${homepageDefinitions[key].label}: ${definition.label} must be at most 12,000 characters.`,
        };
      if (
        key === "products" &&
        /^(first|second|third)VideoUrl$/.test(name) &&
        parsed.data &&
        !isProductVideoUrl(parsed.data)
      )
        return {
          error: `${definition.label}: use a YouTube link or a public HTTPS MP4 / WebM video URL.`,
        };
      text[name] = parsed.data;
    }
    const data = { text, visible: form.get(`${key}.visible`) === "on" };
    updates.push(
      db.homepageSection.upsert({
        where: { key },
        create: { key, ...data },
        update: data,
      }),
    );
  }
  try {
    await db.$transaction(updates);
  } catch {
    return { error: "Your changes could not be saved. Please try again." };
  }
  revalidatePath("/", "layout");
  return { success: "Homepage updated. Your changes are now live." };
}
