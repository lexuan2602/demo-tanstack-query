import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

import { getUsersFromStore } from "@/lib/demo-store";
import UserList from "@/app/users/user-list";

// Demo này cần đọc dữ liệu mới theo request
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: getUsersFromStore,
  });

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-2xl font-bold">User Management Dashboard</h1>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserList />
      </HydrationBoundary>
    </main>
  );
}
