"use client";
import { useActionState, useState } from "react";
import { VideoUploadField } from "./video-upload-field";
import { saveProduct } from "@/lib/actions";
import { DiscountDeadlineField } from "./discount-deadline-field";

type EditableProduct = {
  id: string;
  title: string;
  description: string;
  game: string;
  category: string;
  price: string | null;
  discountPercent: number;
  discountEndsAt: string | null;
  currency: string;
  videoUrl: string | null;
  discordUrl: string | null;
  status: string;
  featured: boolean;
  published: boolean;
  features: string[];
};
export function ProductForm({ product: p }: { product?: EditableProduct }) {
  const [state, action, pending] = useActionState(saveProduct, {});
  const [uploading, setUploading] = useState(false);
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
          <div className="form-row">
            <label>
              <span>Discount (%)</span>
              <input
                name="discountPercent"
                type="number"
                min="0"
                max="100"
                step="1"
                defaultValue={p?.discountPercent ?? 0}
              />
            </label>
            <DiscountDeadlineField initial={p?.discountEndsAt} />
          </div>
          <p className="field-help">
            Use 0 for no discount. The deadline uses your device’s local time.
            Leave it blank for no countdown. The regular price returns when the
            countdown ends.
          </p>
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
            <h2>Product video</h2>
            <VideoUploadField
              name="videoUrl"
              initial={p?.videoUrl || ""}
              onUploadingChange={setUploading}
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
        <button className="button" disabled={pending || uploading}>
          {pending ? "Saving…" : "Save product"}
        </button>
        <a href="/admin/products" className="button button-outline">
          Cancel
        </a>
      </div>
    </form>
  );
}
