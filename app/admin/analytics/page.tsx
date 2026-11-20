import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminHeading, Stat, EmptyAdmin } from "@/components/admin-ui";
export default async function Analytics({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  await requireAdmin();
  const { days: raw } = await searchParams;
  const days = [7, 30, 90].includes(Number(raw)) ? Number(raw) : 30;
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - days + 1);
  const [sales, clicks, users, products] = await Promise.all([
    db.sale.findMany({
      where: { soldAt: { gte: since } },
      include: { product: { select: { title: true } } },
    }),
    db.event.findMany({
      where: { createdAt: { gte: since }, type: "DISCORD_CLICK" },
      select: { createdAt: true, productId: true },
    }),
    db.user.count({ where: { role: "USER", createdAt: { gte: since } } }),
    db.product.count({ where: { published: true } }),
  ]);
  const revenue: Record<string, number> = {};
  const ranking: Record<string, { title: string; units: number }> = {};
  for (const s of sales) {
    revenue[s.currency] =
      (revenue[s.currency] || 0) + Number(s.unitPrice) * s.quantity;
    ranking[s.productId] ??= { title: s.product.title, units: 0 };
    ranking[s.productId].units += s.quantity;
  }
  const buckets = Array.from({ length: days }, (_, i) => {
    const d = new Date(since);
    d.setUTCDate(d.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    return {
      date: key,
      count: sales
        .filter((s) => s.soldAt.toISOString().slice(0, 10) === key)
        .reduce((sum, s) => sum + s.quantity, 0),
    };
  });
  const peak = Math.max(1, ...buckets.map((b) => b.count));
  return (
    <>
      <AdminHeading
        title="Analytics"
        description="A clear view of your catalog’s performance."
      />
      <div className="period-tabs">
        {[7, 30, 90].map((d) => (
          <a key={d} href={`?days=${d}`} className={days === d ? "active" : ""}>
            Last {d} days
          </a>
        ))}
      </div>
      <div className="stats-grid">
        <Stat
          label="Units sold"
          value={sales.reduce((sum, s) => sum + s.quantity, 0)}
          detail={`${sales.length} recorded transactions`}
        />
        <Stat
          label="Discord referrals"
          value={clicks.length}
          detail="Outbound clicks, not unique visitors"
        />
        <Stat
          label="New accounts"
          value={users}
          detail={`During the last ${days} days`}
        />
        <Stat
          label="Published products"
          value={products}
          detail="Currently visible in catalog"
        />
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Sales activity</h2>
            <p className="field-help">
              Units sold per day · UTC · Last {days} days
            </p>
          </div>
          <span className="chart-legend">
            <i /> Units sold
          </span>
        </div>
        <div
          className="bar-chart"
          role="img"
          aria-label={`Daily sales chart for the last ${days} days. Total ${sales.reduce((sum, s) => sum + s.quantity, 0)} units.`}
        >
          {buckets.map((b) => (
            <div
              className="chart-column"
              key={b.date}
              title={`${b.date}: ${b.count} units`}
            >
              <div
                className="chart-bar"
                style={{
                  height: `${Math.max(b.count ? 3 : 0, (b.count / peak) * 100)}%`,
                }}
              />
            </div>
          ))}
        </div>
        <div className="chart-axis">
          <span>{buckets[0].date}</span>
          <span>{buckets[buckets.length - 1].date}</span>
        </div>
        {!sales.length && (
          <p className="field-help">
            No recorded sales in this period. Add completed Discord sales to
            populate the chart.
          </p>
        )}
      </section>
      <div className="admin-columns">
        <section className="panel">
          <h2>Recorded revenue</h2>
          <p className="field-help">
            Currencies are reported separately. Based on manually recorded
            sales.
          </p>
          {Object.keys(revenue).length ? (
            Object.entries(revenue).map(([currency, total]) => (
              <div className="revenue-row" key={currency}>
                <span>{currency}</span>
                <strong>
                  {total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </div>
            ))
          ) : (
            <EmptyAdmin
              title="No revenue recorded"
              description="Sales entered in this period will appear here."
            />
          )}
        </section>
        <section className="panel">
          <h2>Top products</h2>
          {Object.values(ranking).length ? (
            Object.values(ranking)
              .sort((a, b) => b.units - a.units)
              .slice(0, 5)
              .map((p) => (
                <div className="activity-row" key={p.title}>
                  <b>{p.title}</b>
                  <span>{p.units} units</span>
                </div>
              ))
          ) : (
            <EmptyAdmin
              title="No ranking yet"
              description="Your top-selling products will appear as you record sales."
            />
          )}
        </section>
      </div>
    </>
  );
}
