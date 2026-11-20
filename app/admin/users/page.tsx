import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminHeading, EmptyAdmin } from "@/components/admin-ui";
import { DeleteUser } from "@/components/delete-user";
export default async function Users({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requireAdmin();
  const { q = "", page = "1" } = await searchParams;
  const requestedPage = Math.max(1, Number.parseInt(page) || 1);
  const where = q
    ? {
        OR: [
          { email: { contains: q, mode: "insensitive" as const } },
          { name: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};
  const total = await db.user.count({ where });
  const current = Math.min(requestedPage, Math.max(1, Math.ceil(total / 50)));
  const users = await db.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (current - 1) * 50,
    take: 50,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return (
    <>
      <AdminHeading
        title="Community accounts"
        description="View and manage the people registered on your website."
      />
      <form className="user-search">
        <input
          name="q"
          placeholder="Search by name or email"
          defaultValue={q}
          aria-label="Search users"
        />
        <button className="button button-outline">Search</button>
      </form>
      <section className="panel">
        <div className="panel-heading">
          <h2>Users</h2>
          <span className="muted">{total} accounts</span>
        </div>
        {users.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <b>{u.name}</b>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className="tag">{u.role}</span>
                    </td>
                    <td>{u.createdAt.toLocaleDateString("en-GB")}</td>
                    <td>
                      {u.role === "ADMIN" ? (
                        <span className="muted">Protected admin</span>
                      ) : (
                        <DeleteUser id={u.id} name={u.name} email={u.email} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyAdmin
            title="No matching users"
            description="Try a different search."
          />
        )}
        <div className="pagination">
          {current > 1 && (
            <a href={`?q=${encodeURIComponent(q)}&page=${current - 1}`}>
              Previous
            </a>
          )}
          <span>
            Page {current} of {Math.max(1, Math.ceil(total / 50))}
          </span>
          {current * 50 < total && (
            <a href={`?q=${encodeURIComponent(q)}&page=${current + 1}`}>Next</a>
          )}
        </div>
      </section>
    </>
  );
}
