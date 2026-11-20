"use client";

import { useState } from "react";
import { Upload, LoaderCircle } from "lucide-react";
import { ProductVideo } from "./video";

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
  async function upload(file?: File) {
    if (!file) return;
    setError("");
    if (
      !["video/mp4", "video/webm"].includes(file.type) ||
      !file.size ||
      file.size > 25 * 1024 * 1024
    ) {
      setError("Choose an MP4 or WebM video up to 25 MB.");
      return;
    }
    setUploading(true);
    onUploadingChange?.(true);
    try {
      const data = new FormData();
      data.set("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");
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
          {uploading ? "Uploading video…" : "Choose a video to upload"}
        </span>
        <small>Up to 25 MB</small>
        <input
          type="file"
          aria-label={`Upload ${label}`}
          accept="video/mp4,video/webm"
          disabled={uploading}
          onChange={(e) => upload(e.target.files?.[0])}
        />
      </label>
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
