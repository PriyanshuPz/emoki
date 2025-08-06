"use client";

import Link from "next/link";
import { TiArchive, TiDownloadOutline, TiRefreshOutline } from "react-icons/ti";
import { SoundButton } from "./sound-button";
import VaultSelector from "./vault-selector";
import { cn } from "@/lib/utils";

interface ActionButtonsProps {
  content?: string;
  onClear?: () => void;
  onSave?: () => void;
  isLoading?: boolean;
}

export default function ActionButtons({
  content,
  onClear,
  onSave,
  isLoading,
}: ActionButtonsProps) {
  const handleRefresh = () => {
    if (isLoading) return;
    onClear?.();
  };

  const hasContent = content?.trim();

  return (
    <div className="fixed bottom-8 space-x-1 flex">
      <SoundButton
        size="icon"
        className="w-16 h-16 border-s-2 rounded-e-none rounded-s-2xl"
        onClick={handleRefresh}
        disabled={isLoading}
        title="Clear chit"
      >
        <TiRefreshOutline className="w-8 h-8 text-gray-700" />
      </SoundButton>

      <SoundButton
        size="icon"
        variant={hasContent ? "primary" : "outline"}
        soundType="complete"
        className={"w-16 h-16"}
        onClick={onSave}
        disabled={isLoading || !hasContent}
        title="Quick save chit"
      >
        <TiDownloadOutline className="w-8 h-8" />
      </SoundButton>

      <Link href="/vaults">
        <SoundButton
          size="icon"
          className="w-16 h-16 rounded-s-none rounded-e-2xl"
          soundType="click"
          disabled={isLoading}
          title="Manage vaults"
        >
          <TiArchive className="w-8 h-8 text-gray-700" />
        </SoundButton>
      </Link>
    </div>
  );
}
