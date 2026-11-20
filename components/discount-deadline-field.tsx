"use client";
import { useEffect, useState } from "react";

function localInputValue(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

export function DiscountDeadlineField({
  initial,
}: {
  initial?: string | null;
}) {
  const [value, setValue] = useState("");
  const [iso, setIso] = useState(initial ?? "");
  useEffect(() => {
    setValue(initial ? localInputValue(new Date(initial)) : "");
  }, [initial]);
  function change(value: string) {
    setValue(value);
    const date = new Date(value);
    setIso(value && Number.isFinite(date.getTime()) ? date.toISOString() : "");
  }
  return (
    <div className="discount-deadline-field">
      <label>
        Discount ends at
        <input
          aria-label="Discount ends at"
          type="datetime-local"
          value={value}
          onChange={(event) => change(event.target.value)}
        />
      </label>
      <input type="hidden" name="discountEndsAt" value={iso} />
      <div className="discount-deadline-actions">
        <button
          type="button"
          className="text-button"
          onClick={() =>
            change(localInputValue(new Date(Date.now() + 48 * 3600000)))
          }
        >
          Set 2 days
        </button>
        <button
          type="button"
          className="text-button"
          onClick={() => change("")}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
