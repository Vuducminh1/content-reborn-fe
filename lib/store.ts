import { ContentItem, RebornPack, ContentFilterParams, PackStatus, FormatType, ToneType } from "./types";
import { generateMockContents } from "./mockData";
import { generateUUID } from "./utils";

const KEY_CONTENTS = "cr_mvp_contents";
const KEY_PACKS = "cr_mvp_packs";

// Helper to interact with localStorage safely
const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: <T>(key: string, value: T) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const store = {
  seedIfEmpty: () => {
    const contents = storage.get<ContentItem[]>(KEY_CONTENTS);
    if (!contents || contents.length === 0) {
      console.log("Seeding mock content...");
      storage.set(KEY_CONTENTS, generateMockContents(25));
    }
    const packs = storage.get<RebornPack[]>(KEY_PACKS);
    if (!packs) {
      storage.set(KEY_PACKS, []);
    }
  },

  listContents: (params: ContentFilterParams = {}): ContentItem[] => {
    const contents = storage.get<ContentItem[]>(KEY_CONTENTS) || [];
    return contents.filter(item => {
      // Search Text
      if (params.searchText) {
        const lower = params.searchText.toLowerCase();
        if (!item.title.toLowerCase().includes(lower) && !item.excerpt.toLowerCase().includes(lower)) {
          return false;
        }
      }
      // Category
      if (params.category && params.category !== "All" && item.category !== params.category) {
        return false;
      }
      // Score Range
      const min = params.minScore ?? 0;
      const max = params.maxScore ?? 100;
      if (item.resurfaceScore < min || item.resurfaceScore > max) return false;

      // Risk
      if (params.risk && params.risk !== "All") {
        // @ts-ignore - params.risk is string from select, item.risks is typed array
        if (!item.risks.includes(params.risk)) return false;
      }

      return true;
    }).sort((a, b) => b.resurfaceScore - a.resurfaceScore);
  },

  getContent: (id: string): ContentItem | null => {
    const contents = storage.get<ContentItem[]>(KEY_CONTENTS) || [];
    return contents.find(c => c.id === id) || null;
  },

  listPacks: (status?: PackStatus): RebornPack[] => {
    const packs = storage.get<RebornPack[]>(KEY_PACKS) || [];
    let result = packs;
    if (status) {
      result = packs.filter(p => p.status === status);
    }
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  getPack: (id: string): RebornPack | null => {
    const packs = storage.get<RebornPack[]>(KEY_PACKS) || [];
    return packs.find(p => p.id === id) || null;
  },

  createPackFromContent: (contentId: string): RebornPack => {
    const packs = storage.get<RebornPack[]>(KEY_PACKS) || [];
    
    const newPack: RebornPack = {
      id: generateUUID(),
      contentId,
      status: "DRAFT",
      formatType: "SHORT_VIDEO",
      assignee: "Editor",
      controls: { tone: "NEUTRAL", audience: "General readers", cta: "Follow for more" },
      draftText: "",
      versions: [],
      checklist: { factCheck: false, rights: false, sensitive: false, editorFinal: false },
      assets: { urls: [] },
      updatedAt: new Date().toISOString()
    };

    packs.push(newPack);
    storage.set(KEY_PACKS, packs);
    return newPack;
  },

  updatePack: (packId: string, patch: Partial<RebornPack>): RebornPack => {
    const packs = storage.get<RebornPack[]>(KEY_PACKS) || [];
    const idx = packs.findIndex(p => p.id === packId);
    if (idx === -1) throw new Error("Pack not found");

    const updated = { ...packs[idx], ...patch, updatedAt: new Date().toISOString() };
    packs[idx] = updated;
    storage.set(KEY_PACKS, packs);
    return updated;
  },

  setPackStatus: (packId: string, status: PackStatus): RebornPack => {
    return store.updatePack(packId, { status });
  },

  addPackVersion: (packId: string, text: string, note?: string): RebornPack => {
    const packs = storage.get<RebornPack[]>(KEY_PACKS) || [];
    const idx = packs.findIndex(p => p.id === packId);
    if (idx === -1) throw new Error("Pack not found");

    const pack = packs[idx];
    const versionNumber = pack.versions.length + 1;
    const newVersion = {
      id: generateUUID(),
      createdAt: new Date().toISOString(),
      text,
      note: note || `v${versionNumber}`
    };

    const updated = {
      ...pack,
      draftText: text, // Also ensure draft text is synced
      versions: [...pack.versions, newVersion],
      updatedAt: new Date().toISOString()
    };
    packs[idx] = updated;
    storage.set(KEY_PACKS, packs);
    return updated;
  },

  generateDraft: (packId: string, formatType: FormatType, controls: { tone: ToneType; audience: string; cta: string }): RebornPack => {
    const pack = store.getPack(packId);
    const content = store.getContent(pack?.contentId || "");
    if (!pack || !content) throw new Error("Invalid pack or content");

    let generated = "";

    if (formatType === "SHORT_VIDEO") {
      generated = `SHORT VIDEO SCRIPT — ${content.title}
      
(Hook - Tone: ${controls.tone})
Host: "Did you know that ${content.category} is changing forever? Here is why."

(Beat 1)
${content.reasons[0]}
Context: ${content.excerpt.substring(0, 50)}...

(Beat 2)
${content.reasons[1]}

(Beat 3)
${content.reasons[2]}

(CTA)
Target: ${controls.audience}
Action: "${controls.cta}"

Note: Verify facts & rights before publish.`;
    } else {
      generated = `CAROUSEL — 5 SLIDES — ${content.title}

Slide 1 (Hook)
Headline: ${content.title}
Sub: A guide for ${controls.audience}

Slide 2 (Point 1)
${content.reasons[0]}

Slide 3 (Point 2)
${content.reasons[1]}

Slide 4 (Point 3)
${content.reasons[2]}

Slide 5 (CTA)
"${controls.cta}"
Read more at: ${content.url}

Note: Verify facts & rights before publish.`;
    }

    return store.updatePack(packId, {
      formatType,
      controls,
      draftText: generated
    });
  },

  exportPack: (packId: string) => {
    const pack = store.getPack(packId);
    const content = store.getContent(pack?.contentId || "");
    return {
      exportedAt: new Date().toISOString(),
      mvpVersion: "1.0",
      pack,
      content
    };
  }
};
