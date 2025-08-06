import ProfileBar from "@/components/game-ui/profile-bar";
import ChitMakerView from "@/components/game-ui/chit-maker-view";

export default function PaperHome() {
  return (
    <main className="min-h-screen bg-paper-100 flex flex-col py-20 px-4 w-full">
      <ProfileBar />
      <ChitMakerView />
    </main>
  );
}
