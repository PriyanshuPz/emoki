import ActionButtons from "@/components/game-ui/action-buttons";
import NoteContainer from "@/components/game-ui/note-container";
import ProfileBar from "@/components/game-ui/profile-bar";

export default function PaperHome() {
  return (
    <main className="bg-lime-50/70 flex h-screen w-full items-center justify-center flex-col">
      <ProfileBar />
      <NoteContainer />
      <ActionButtons />
    </main>
  );
}
