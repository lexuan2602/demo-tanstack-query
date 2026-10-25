"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUserBio } from "@/lib/api";
import type { User } from "@/types/user";

type EditBioProps = {
  user: User;
};

export default function EditBio({ user }: EditBioProps) {
  const [bioInput, setBioInput] = useState(user.bio);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newBio: string) => {
      return updateUserBio(user.id, newBio);
    },

    onMutate: async (newBio) => {
      await queryClient.cancelQueries({
        queryKey: ["users"],
      });

      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      queryClient.setQueryData<User[]>(["users"], (oldUsers) => {
        if (!oldUsers) return oldUsers;

        return oldUsers.map((item) =>
          item.id === user.id ? { ...item, bio: newBio } : item,
        );
      });

      return { previousUsers };
    },

    onError: (_error, _newBio, result) => {
      if (result?.previousUsers !== undefined) {
        queryClient.setQueryData(["users"], result.previousUsers);
      }
    },

    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  function handleSave() {
    const newBio = bioInput.trim();

    if (!newBio || mutation.isPending) return;

    mutation.mutate(newBio);
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex gap-2">
        <input
          value={bioInput}
          onChange={(e) => setBioInput(e.target.value)}
          maxLength={200}
          className="min-w-0 flex-1 rounded border px-3 py-2"
          placeholder="Enter bio..."
        />

        <button
          onClick={handleSave}
          disabled={mutation.isPending}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>

      {mutation.isError && (
        <p className="text-sm text-red-600">
          Update failed. Previous data restored.
        </p>
      )}

      {mutation.isSuccess && (
        <p className="text-sm text-green-600">Bio saved successfully!</p>
      )}
    </div>
  );
}
