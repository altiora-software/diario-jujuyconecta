import MundialHero from "./components/MundialHero";
import MundialNews from "./components/MundialNews";
import MundialTodayMatches from "./components/MundialTodayMatches";

export default function Mundial2026Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <MundialHero />
      <MundialTodayMatches />
      <MundialNews />
    </main>
  );
}