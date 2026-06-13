import MundialArgentinaMatch from "./components/MundialArgentinaMatch";
import MundialHero from "./components/MundialHero";
import MundialNews from "./components/MundialNews";
import MundialTodayMatches from "./components/MundialTodayMatches";
import MundialGroups from "./components/MundialGroups";
import MundialBracket from "./components/MundialBracket";

export default function Mundial2026Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <MundialHero />
      <MundialTodayMatches />
      <MundialArgentinaMatch /> 
      <MundialGroups />
      <MundialBracket />
      <MundialNews />
    </main>
  );
}