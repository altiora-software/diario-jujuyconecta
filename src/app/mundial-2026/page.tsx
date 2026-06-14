import MundialTodayMatches from "./components/MundialTodayMatches";
import MundialNews from "./components/MundialNews";
import MundialGroups from "./components/MundialGroups";
import MundialBracket from "./components/MundialBracket";
import FixtureHero from "./fixture/components/FixtureHero";
import FixtureArgentina from "./fixture/components/FixtureArgentina";
import { matches } from "./fixture/data/matches";


import {
  isArgentinaMatch,
  getArgentinaGroup,
  getCurrentOrNextMatchDay,
  getNextArgentinaMatch,
} from "./fixture/components/fixture-utils";

export default function Mundial2026Page() {
  const featuredDay = getCurrentOrNextMatchDay(matches);

const nextArgentinaMatch = getNextArgentinaMatch(matches);
const argentinaMatches = matches.filter(isArgentinaMatch);

const argentinaGroup = getArgentinaGroup(matches);
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
       <FixtureHero
        argentinaGroup={argentinaGroup}
        featuredDay={featuredDay}
        nextArgentinaMatch={nextArgentinaMatch}
      />

    <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <FixtureArgentina matches={argentinaMatches} />

        <div id="grupos">
          {/* <MundialGroups /> */}
        </div>

        <div id="llaves">
          {/* <MundialBracket /> */}
        </div>

        <MundialTodayMatches />
        <div id="noticias">
          {/* <MundialNews /> */}
        </div>
      </div>
    </main>
  );
}