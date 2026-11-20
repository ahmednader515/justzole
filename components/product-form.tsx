"use client";
import { useActionState, useState } from "react";
import { Upload, LoaderCircle } from "lucide-react";
import { saveProduct } from "@/lib/actions";
import { ProductVideo } from "./video";
import { getYouTubeEmbedUrl } from "@/lib/video";
type EditableProduct = {
  id: string;
  title: string;
  description: string;
  game: string;
  category: string;
  price: string | null;
  currency: string;
  imageUrl: string | null;
  videoUrl: string | null;
  discordUrl: string | null;
  status: string;
  featured: boolean;
  published: boolean;
  features: string[];
};
function MediaField({
  name,
  label,
  initial,
  accept,
}: {
  name: string;
  label: string;
  initial: string;
  accept: string;
}) {
  const [url, setUrl] = useState(initial),
    [uploading, setUploading] = useState(false),
    [error, setError] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.set("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setUrl(result.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
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
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
        />
      </label>
      {name === "videoUrl" && (
        <p className="field-help">
          Paste a YouTube link, or upload an MP4 or WebM video.
        </p>
      )}
      <label className="upload-zone">
        {uploading ? (
          <LoaderCircle size={20} className="spin" />
        ) : (
          <Upload size={20} />
        )}
        <span>
          {uploading
            ? "Uploading to Cloudflare…"
            : "Choose a file to upload to Cloudflare R2"}
        </span>
        <small>Up to 25 MB, or paste a hosted URL above</small>
        <input
          type="file"
          accept={accept}
          disabled={uploading}
          onChange={(e) => upload(e.target.files?.[0])}
        />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {name === "imageUrl" && url && (
        <img className="media-preview" src={url} alt="Product image preview" />
      )}
      {name === "videoUrl" && getYouTubeEmbedUrl(url) && (
        <ProductVideo url={url} />
      )}
      <input
        type="hidden"
        name={`${name}Uploading`}
        value={uploading ? "yes" : "no"}
      />
    </div>
  );
}
export function ProductForm({ product: p }: { product?: EditableProduct }) {
  const [state, action, pending] = useActionState(saveProduct, {});
  return (
    <form action={action} className="stack-form product-edit-form">
      <input type="hidden" name="id" value={p?.id || ""} />
      <div className="form-columns">
        <section className="panel">
          <h2>Product details</h2>
          <label>
            Product name
            <input
              name="title"
              required
              minLength={2}
              maxLength={150}
              defaultValue={p?.title}
              placeholder="e.g. your product name"
            />
          </label>
          <div className="form-row">
            <label>
              Game
              <input
                name="game"
                required
                defaultValue={p?.game}
                placeholder="Game name"
              />
            </label>
            <label>
              Category
              <input
                name="category"
                required
                defaultValue={p?.category || "Scripts"}
                placeholder="Scripts, tools…"
              />
            </label>
          </div>
          <label>
            Description
            <textarea
              name="description"
              rows={6}
              required
              minLength={10}
              maxLength={10000}
              defaultValue={p?.description}
              placeholder="What does this product do?"
            />
          </label>
          <label>
            <span>
              Features <span className="muted">(one per line)</span>
            </span>
            <textarea
              name="features"
              rows={5}
              defaultValue={p?.features.join("\n")}
              placeholder="List the features customers should know about"
            />
          </label>
          <div className="form-row">
            <label>
              <span>
                Display price <span className="muted">(optional)</span>
              </span>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                max="9999999999"
                defaultValue={p?.price ?? ""}
                placeholder="Ask on Discord"
              />
            </label>
            <label>
              Currency
              <input
                name="currency"
                required
                pattern="[A-Z]{3}"
                maxLength={3}
                defaultValue={p?.currency || "USD"}
              />
            </label>
          </div>
          <label>
            <span>
              Discord product link <span className="muted">(optional)</span>
            </span>
            <input
              name="discordUrl"
              type="url"
              defaultValue={p?.discordUrl || ""}
              placeholder="https://discord.com/channels/…"
            />
          </label>
          <p className="field-help">
            Leave blank to use the server invite. No payments are collected on
            this website.
          </p>
        </section>
        <div>
          <section className="panel">
            <h2>Product media</h2>
            <MediaField
              name="imageUrl"
              label="Cover image"
              initial={p?.imageUrl || ""}
              accept="image/jpeg,image/png,image/webp,image/gif"
            />
            <MediaField
              name="videoUrl"
              label="Video showcase"
              initial={p?.videoUrl || ""}
              accept="video/mp4,video/webm"
            />
          </section>
          <section className="panel">
            <h2>Visibility & availability</h2>
            <label>
              Status
              <select name="status" defaultValue={p?.status || "AVAILABLE"}>
                <option value="AVAILABLE">Available</option>
                <option value="SOLD_OUT">Sold out</option>
                <option value="COMING_SOON">Coming soon</option>
              </select>
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                name="published"
                defaultChecked={p?.published ?? true}
              />{" "}
              Published in catalog
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={p?.featured ?? false}
              />{" "}
              Featured product
            </label>
          </section>
        </div>
      </div>
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <div className="form-actions">
        <button className="button" disabled={pending}>
          {pending ? "Saving…" : "Save product"}
        </button>
        <a href="/admin/products" className="button button-outline">
          Cancel
        </a>
      </div>
    </form>
  );
}
