import { ContentItem, RiskType } from "./types";
import { generateUUID } from "./utils";

const CATEGORIES = ["Business", "Technology", "Health", "Lifestyle", "Science", "Culture"];
const RISKS: RiskType[] = ["outdated", "sensitive", "rights", "fact_check"];

const TEMPLATES = [
  { t: "The Future of AI in {CAT}", e: "An in-depth look at how artificial intelligence is reshaping the {CAT} landscape." },
  { t: "10 Mistakes in {CAT} You Should Avoid", e: "We analyze the common pitfalls beginners make when approaching {CAT}." },
  { t: "History of {CAT}: A Retrospective", e: "Looking back at the pivotal moments that defined modern {CAT}." },
  { t: "Why {CAT} Matters More Than Ever", e: "In a changing world, understanding {CAT} is crucial for success." },
  { t: "The Hidden Truth About {CAT}", e: "Investigative report on the under-discussed aspects of {CAT}." }
];

const REASONS_POOL = [
  "High evergreen potential score",
  "Topic is currently trending on search",
  "Strong historical engagement data",
  "Perfect for visual adaptation",
  "Competitor gap identified",
  "Audience retention was high",
  "Seasonal relevance is peaking"
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomRisks(): RiskType[] {
  if (Math.random() > 0.7) return []; // 70% chance no risk
  const count = randomInt(1, 2);
  const shuffled = [...RISKS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomReasons(): [string, string, string] {
  const shuffled = [...REASONS_POOL].sort(() => 0.5 - Math.random());
  return [shuffled[0], shuffled[1], shuffled[2]];
}

export function generateMockContents(count: number = 25): ContentItem[] {
  return Array.from({ length: count }).map((_, i) => {
    const cat = randomItem(CATEGORIES);
    const tmpl = randomItem(TEMPLATES);
    const daysAgo = randomInt(10, 1000);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    return {
      id: generateUUID(),
      title: tmpl.t.replace("{CAT}", cat) + ` #${i + 1}`,
      category: cat,
      publishedAt: date.toISOString(),
      excerpt: tmpl.e.replace("{CAT}", cat),
      url: `https://cms.internal/article/${randomInt(10000, 99999)}`,
      resurfaceScore: randomInt(30, 98),
      reasons: randomReasons(),
      risks: randomRisks(),
      metrics: {
        views: randomInt(1000, 500000),
        avgReadTimeSec: randomInt(45, 600)
      }
    };
  });
}
