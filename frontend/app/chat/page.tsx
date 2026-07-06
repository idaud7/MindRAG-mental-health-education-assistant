import ChatWindow from "@/components/ChatWindow";
import CrisisBanner from "@/components/CrisisBanner";
import Header from "@/components/Header";

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#070b14]">
      <Header />
      <CrisisBanner />
      <section className="flex flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6">
        <ChatWindow />
      </section>
    </main>
  );
}
