import { ProfileSidebar } from "@/components/ProfileSidebar";
import { Wall } from "@/components/Wall";

export default function Home() {
  return (
    <>
      <header className="bg-brand">
        <div className="mx-auto flex max-w-4xl items-center px-4 py-2">
          <span className="text-xl font-bold tracking-tight text-white">wall</span>
        </div>
      </header>
      <main className="mx-auto flex max-w-4xl flex-col gap-6 bg-white px-4 py-5 sm:flex-row">
        <ProfileSidebar />
        <Wall />
      </main>
    </>
  );
}
