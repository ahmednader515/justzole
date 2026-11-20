import { z } from "zod";

export const MAX_VIDEO_BYTES = 1024 * 1024 * 1024;
export const videoUploadSchema = z.object({
  type: z.enum(["video/mp4", "video/webm"]),
  size: z.number().int().positive().max(MAX_VIDEO_BYTES),
});

export async function readUploadTicket(
  response: Response,
): Promise<{ uploadUrl: string; url: string }> {
  const body = await response.text();
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    /* Hosting errors may be plain text or HTML. */
  }
  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string"
        ? data.error
        : response.status === 413
          ? "The server rejected the request as too large. Refresh the page to use direct video uploads."
          : `Could not prepare the upload (${response.status}). Please try again.`,
    );
  }
  if (typeof data?.uploadUrl !== "string" || typeof data?.url !== "string")
    throw new Error(
      "The server returned an invalid upload response. Refresh the page and try again.",
    );
  return data;
}

export function uploadVideoFile(
  uploadUrl: string,
  file: File,
  onProgress: (progress: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", uploadUrl);
    request.setRequestHeader("Content-Type", file.type);
    request.timeout = 30 * 60 * 1000;
    request.upload.onprogress = (event) => {
      if (event.lengthComputable)
        onProgress(Math.round((event.loaded / event.total) * 100));
    };
    request.onload = () =>
      request.status >= 200 && request.status < 300
        ? resolve()
        : reject(
            new Error(
              `Video storage rejected the upload (${request.status}). Please retry; if it continues, check R2 permissions.`,
            ),
          );
    request.onerror = () =>
      reject(
        new Error(
          "Could not reach video storage. Check your connection and the R2 bucket CORS settings for this domain.",
        ),
      );
    request.ontimeout = () =>
      reject(
        new Error("The upload timed out. Check your connection and try again."),
      );
    request.onabort = () =>
      reject(new Error("The upload was cancelled. Please try again."));
    request.send(file);
  });
}
