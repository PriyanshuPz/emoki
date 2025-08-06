"use client";
import { authClient } from "@/lib/auth-client";

const avatarUrl = "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix";

export default function ProfileBar() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center fixed top-4 left-0 w-full px-6 z-10">
        <div className="paper-card px-4 py-2 rounded-lg">Loading...</div>
      </div>
    );
  }

  const user = session?.user;
  if (!user) {
    return (
      <div className="flex items-center justify-center fixed top-4 left-0 w-full px-6 z-10">
        <div className="flex items-center gap-4 px-4 py-2 rounded-sm shadow border-2">
          Please log in to see your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-0 w-full px-6 z-10">
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-3 px-4 py-2 rounded-sm shadow border-2">
          <img
            src={user.image || avatarUrl}
            alt="Avatar"
            width={32}
            height={32}
            className="object-cover bg-gray-200 rounded-full border-2 border-gray-300"
          />
          <div className="text-sm font-semibold text-gray-800">
            {user.name || "Anonymous"}
          </div>
        </div>
      </div>
    </div>
  );
}
