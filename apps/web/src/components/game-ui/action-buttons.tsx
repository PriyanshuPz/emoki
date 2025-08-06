"use client";

import { TiArchive, TiDownloadOutline, TiRefreshOutline } from "react-icons/ti";
import { SoundButton } from "./sound-button";

export default function ActionButtons() {
  return (
    <div className="fixed bottom-4 space-x-0 flex">
      <SoundButton
        size="icon"
        className="rounded-r-none rounded-l-xl w-16 h-16 transform transition-transform active:scale-90 shadow-lg"
        variant="danger"
        // soundType="error"
      >
        <TiRefreshOutline className="w-10 h-10 text-gray-100" />
      </SoundButton>
      <SoundButton
        size="icon"
        soundType="complete"
        className="rounded-none w-16 h-16 transform transition-transform active:scale-90 shadow-lg"
        variant="super"
      >
        <TiDownloadOutline className="w-8 h-8 text-gray-100" />
      </SoundButton>
      <SoundButton
        size="icon"
        className="rounded-l-none rounded-r-xl w-16 h-16 transform transition-transform active:scale-90 shadow-lg"
        variant="secondary"
        soundType="click"
      >
        <TiArchive className="w-8 h-8 text-gray-100" />
      </SoundButton>
    </div>
  );
}
