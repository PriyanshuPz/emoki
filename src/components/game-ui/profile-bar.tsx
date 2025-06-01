"use client";
import { authClient } from "@/lib/auth-client";
import { gameFont } from "@/lib/font";
import { cn } from "@/lib/utils";

const avatarUrl = "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix";

export default function ProfileBar() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-between fixed top-0 left-0 w-full p-4 z-10">
        Loading...
      </div>
    );
  }

  const user = session?.user;
  if (!user) {
    return (
      <div className="flex items-center justify-between fixed top-0 left-0 w-full p-4 z-10">
        Please log in to see your profile.
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <div className="flex items-center justify-between fixed top-0 left-0 w-full p-4 z-10">
        <img
          src={avatarUrl}
          alt="Avatar"
          width={32}
          height={32}
          className="object-cover bg-blue-200 rounded-full"
        />
        <div className={cn(gameFont.className, "flex items-center gap-3 mt-1")}>
          <div className="flex items-center gap-1 text-gray-600">
            <span className="text-xs font-medium">1230 XP</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <span className="text-xs font-medium">Streak: 0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
