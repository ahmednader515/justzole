"use client";
import { useActionState, useState } from "react";
import { recordSale } from "@/lib/actions";
export function SaleForm({
  products,
}: {
  products: {
    id: string;
    title: string;
    price: string | null;
    currency: string;
  }[];
}) {
  const [state, action, pending] = useActionState(recordSale, {});
  const [selected, setSelected] = useState(products[0]?.id || "");
  const product = products.find((p) => p.id === selected);
  return (
    <form action={action} className="stack-form">
      <label>
        Product
        <select
          name="productId"
          required
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </label>
      <div className="form-row">
        <label>
          Quantity sold
          <input
            name="quantity"
            type="number"
            min="1"
            max="100000"
            step="1"
            required
            defaultValue={1}
          />
        </label>
        <label>
          <span>Price per unit ({product?.currency || "EGP"})</span>
          <input
            key={selected}
            name="unitPrice"
            type="number"
            min="0"
            max="9999999999"
            step="0.01"
            required
            defaultValue={product?.price ?? 0}
          />
        </label>
      </div>
      <label>
        <span>
          Note <span className="muted">(optional)</span>
        </span>
        <input
          name="note"
          maxLength={500}
          placeholder="Discord reference or sale details"
        />
      </label>
      <label className="checkbox">
        <input type="checkbox" name="soldOut" /> Mark this product as sold out
      </label>
      <p className="field-help">
        Record a purchase already completed on Discord. This creates a new sale
        entry each time you submit.
      </p>
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
      <button className="button" disabled={pending || !products.length}>
        {pending ? "Recording…" : "Record sale"}
      </button>
    </form>
  );
}
