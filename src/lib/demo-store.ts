import "server-only";
import type { User } from "@/types/user";

const users: User[] = [
  {
    id: "1",
    name: "Nguyen Van An",
    bio: "Frontend Developer",
  },
  {
    id: "2",
    name: "Tran Thi Binh",
    bio: "Backend Developer",
  },
  {
    id: "3",
    name: "Le Minh Cuong",
    bio: "Full-stack Developer",
  },
];

export async function getUsersFromStore(): Promise<User[]> {
  return users.map((user) => ({ ...user }));
}

export async function updateBioInStore(id: string, bio: string): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (bio.trim().toLowerCase() === "fail") {
    throw new Error("Simulated server error");
  }

  const user = users.find((u) => u.id === id);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  user.bio = bio.trim();

  return { ...user };
}
