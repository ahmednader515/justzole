"use client";

import { useState } from "react";
import { Upload, LoaderCircle } from "lucide-react";
import { ProductVideo } from "./video";
import {
  readUploadTicket,
  uploadVideoFile,
  videoUploadSchema,
} from "@/lib/upload";

export function VideoUploadField({
  name,
  label = "Video preview",
  initial,
  onUploadingChange,
}: {
  name: string;
  label?: string;
  initial: string;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const [url, setUrl] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  async function upload(file?: File) {
    if (!file) return;
    setError("");
    if (
      !videoUploadSchema.safeParse({ type: file.type, size: file.size }).success
    ) {
      setError("Choose an MP4 or WebM video up to 1 GB.");
      return;
    }
    setUploading(true);
    setProgress(0);
    onUploadingChange?.(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: file.type, size: file.size }),
      });
      const result = await readUploadTicket(response);
      await uploadVideoFile(result.uploadUrl, file, setProgress);
      setUrl(result.url);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }
  return (
    <div className="media-field">
      <label>
        {label}
        <input
          type="url"
          name={name}
          value={url}
          disabled={uploading}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
        />
      </label>
      <p className="field-help">
        Paste a YouTube link or upload an MP4 / WebM. Previews autoplay muted
        and loop without controls.
      </p>
      <label className="upload-zone">
        {uploading ? (
          <LoaderCircle size={20} className="spin" />
        ) : (
          <Upload size={20} />
        )}
        <span>
          {uploading
            ? `Uploading video… ${progress}%`
            : "Choose a video to upload"}
        </span>
        <small>MP4 / WebM · Up to 1 GB</small>
        <input
          type="file"
          aria-label={`Upload ${label}`}
          accept="video/mp4,video/webm"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            void upload(file);
          }}
        />
      </label>
      {uploading && (
        <progress
          aria-label={`${label} upload progress`}
          max={100}
          value={progress}
          style={{ width: "100%", accentColor: "#ff2448" }}
        />
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {url && <ProductVideo url={url} title={label} preview />}
      <input
        type="hidden"
        name={`${name}Uploading`}
        value={uploading ? "yes" : "no"}
      />
    </div>
  );
}
