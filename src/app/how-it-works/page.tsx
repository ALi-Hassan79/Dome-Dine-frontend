import Link from "next/link";
import { Search, MessageCircle, ShieldCheck, PinIcon } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const STUDENT_STEPS = [
  {
    icon: Search,
    title: "Search & filter",
    body: "Browse hostels and mess near your campus. Filter by university, gender, price, and availability.",
  },
  {
    icon: MessageCircle,
    title: "Contact directly",
    body: "See real ratings and reviews, then message the owner on WhatsApp straight from the listing.",
  },
];

const OWNER_STEPS = [
  {
    icon: PinIcon,
    title: "List your place",
    body: "Post your hostel or mess with photos, price, and details in a few minutes.",
  },
  {
    icon: ShieldCheck,
    title: "Get approved",
    body: "An admin reviews new listings before they go live, keeping the board trustworthy for students.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 board-texture px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-14">
            <h1 className="font-display text-5xl text-chalk mb-3">How it works</h1>
            <p className="text-chalk/60 max-w-md mx-auto">
              A notice board for hostels and mess near your campus — built by students, for
              students.
            </p>
          </div>

          <section className="mb-14">
            <h2 className="font-display text-2xl text-yellow mb-5">For students</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {STUDENT_STEPS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="bg-paper text-ink p-5 torn-top shadow-lg">
                  <Icon className="text-marker mb-2" size={22} />
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-ink/70">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-14">
            <h2 className="font-display text-2xl text-yellow mb-5">For owners</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {OWNER_STEPS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="bg-paper text-ink p-5 torn-top shadow-lg">
                  <Icon className="text-marker mb-2" size={22} />
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-ink/70">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-yellow text-ink font-medium px-6 py-2.5 rounded-sm hover:brightness-95 transition"
            >
              Browse listings
            </Link>
            <Link
              href="/list-your-place"
              className="bg-paper text-ink font-medium px-6 py-2.5 rounded-sm hover:brightness-95 transition"
            >
              List your place
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}