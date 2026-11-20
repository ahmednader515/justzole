import Link from "next/link";
import { Plus } from "lucide-react";

export function ProductQuestions() {
  return (
    <section
      className="container section product-questions"
      aria-labelledby="product-questions-title"
    >
      <div className="section-heading">
        <div>
          <div className="eyebrow">FOR HONOR / JUST ZOLE</div>
          <h2 id="product-questions-title">
            For Honor scripts, previews & support.
          </h2>
          <p>
            Find product details here. Talk to the team on Discord before you
            buy.
          </p>
        </div>
      </div>
      <div className="question-accordion">
        <details open>
          <summary>
            <span className="question-index">01</span>
            <h3>Looking for For Honor hacks?</h3>
            <Plus size={18} aria-hidden="true" />
          </summary>
          <p>
            Browse the{" "}
            <Link href="/products">Just Zole For Honor script catalog</Link> to
            compare listed features, prices, and availability. Watch the
            available video previews and ask the team which product fits your
            setup.
          </p>
        </details>
        <details>
          <summary>
            <span className="question-index">02</span>
            <h3>How do I buy a For Honor script?</h3>
            <Plus size={18} aria-hidden="true" />
          </summary>
          <p>
            Open a product, review its details, then use its Discord button to
            contact Just Zole. Purchases and product support are handled through
            Discord; this website does not collect payments.
          </p>
        </details>
        <details>
          <summary>
            <span className="question-index">03</span>
            <h3>Where can I check compatibility and setup?</h3>
            <Plus size={18} aria-hidden="true" />
          </summary>
          <p>
            Check the features on each product page and confirm platform,
            configuration, and setup requirements with the team on Discord.
            Product details and current availability are specific to each
            listing.
          </p>
        </details>
      </div>
    </section>
  );
}
