"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveHomepage } from "@/lib/homepage-actions";
import { VideoUploadField } from "./video-upload-field";
import {
  homepageDefinitions,
  homepageKeys,
  type HomepageContent,
} from "@/lib/homepage-defaults";

export function HomepageForm({ content }: { content: HomepageContent }) {
  const [state, action, pending] = useActionState(saveHomepage, {});
  const [uploads, setUploads] = useState<Record<string, boolean>>({});
  const uploading = Object.values(uploads).some(Boolean);
  const [visibility, setVisibility] = useState(() =>
    Object.fromEntries(homepageKeys.map((key) => [key, content[key].visible])),
  );
  return (
    <form action={action} className="stack-form homepage-editor">
      <div className="panel homepage-editor-intro">
        <div>
          <h2>Your homepage, your words.</h2>
          <p>
            Edit a section below, then save all changes. Hiding a section
            preserves its text. Product details and individual reviews stay in
            their dedicated pages.
          </p>
        </div>
        <Link
          className="button button-outline"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          View homepage
        </Link>
      </div>
      <div className="homepage-editor-links">
        <Link href="/admin/products">Manage products</Link>
        <Link href="/admin/reviews">Manage customer reviews</Link>
      </div>
      {homepageKeys.map((key) => (
        <details
          className="panel homepage-editor-section"
          key={key}
          open={key === "hero" || undefined}
        >
          <summary>
            <span>{homepageDefinitions[key].label}</span>
            <span
              className={`tag ${visibility[key] ? "status-available" : "status-sold_out"}`}
            >
              {visibility[key] ? "Visible" : "Hidden"}
            </span>
          </summary>
          <div className="stack-form homepage-editor-fields">
            <label className="checkbox">
              <input
                type="checkbox"
                name={`${key}.visible`}
                checked={visibility[key]}
                onChange={(event) =>
                  setVisibility((current) => ({
                    ...current,
                    [key]: event.target.checked,
                  }))
                }
              />
              Show this section
            </label>
            {Object.entries(homepageDefinitions[key].fields).map(
              ([name, definition]) =>
                key === "products" &&
                /^(first|second|third)VideoUrl$/.test(name) ? (
                  <VideoUploadField
                    key={name}
                    name={`${key}.${name}`}
                    label={definition.label}
                    initial={content[key].text[name]}
                    onUploadingChange={(busy) =>
                      setUploads((current) => ({ ...current, [name]: busy }))
                    }
                  />
                ) : (
                  <label key={name}>
                    <span>{definition.label}</span>
                    {definition.multiline ? (
                      <textarea
                        name={`${key}.${name}`}
                        rows={5}
                        maxLength={12000}
                        defaultValue={content[key].text[name]}
                      />
                    ) : (
                      <input
                        name={`${key}.${name}`}
                        maxLength={12000}
                        defaultValue={content[key].text[name]}
                      />
                    )}
                  </label>
                ),
            )}
          </div>
        </details>
      ))}
      <div className="homepage-save-bar">
        {state.error && (
          <p className="form-error" role="alert">
            {state.error}
          </p>
        )}
        {state.success && (
          <p className="form-success" role="status">
            {state.success}
          </p>
        )}
        <button className="button" disabled={pending || uploading}>
          {pending ? "Saving…" : "Save all changes"}
        </button>
      </div>
    </form>
  );
}
