"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/api";
import EditBio from "@/app/users/edit-bio";

export default function UserList() {
  const {
    data: users,
    isPending,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    refetchInterval: 5000,
    staleTime: 30_000,
  });

  if (isPending) {
    return <p>Loading users...</p>;
  }

  if (isError) {
    return <p>Could not load users.</p>;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Users</h2>

          {isFetching && (
            <span className="text-sm text-blue-600">Synchronizing...</span>
          )}
        </div>

        <button
          onClick={() => void refetch()}
          className="rounded bg-gray-200 px-3 py-2"
        >
          Refresh
        </button>
      </div>

      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="rounded-lg border p-4">
            <h3 className="font-semibold">{user.name}</h3>

            <p className="mt-1 text-gray-600">Bio: {user.bio}</p>

            <EditBio user={user} />
          </li>
        ))}
      </ul>
    </section>
  );
}
