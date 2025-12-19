export type RiskType = "outdated" | "sensitive" | "rights" | "fact_check";
export type FormatType = "SHORT_VIDEO" | "CAROUSEL";
export type PackStatus = "DRAFT" | "IN_REVIEW" | "APPROVED" | "PUBLISHED";
export type ToneType = "NEUTRAL" | "GENZ" | "ANALYTICAL";

export interface ContentItem {
  id: string;
  title: string;
  category: string;
  publishedAt: string; // ISO date
  excerpt: string;
  url: string;
  resurfaceScore: number; // 0..100
  reasons: [string, string, string]; // always 3 items
  risks: RiskType[];
  metrics?: {
    views?: number;
    ctr?: number;
    avgReadTimeSec?: number;
  };
}

export interface PackVersion {
  id: string;
  createdAt: string; // ISO date
  text: string;
  note: string;
}

export interface PackChecklist {
  factCheck: boolean;
  rights: boolean;
  sensitive: boolean;
  editorFinal: boolean;
}

export interface RebornPack {
  id: string;
  contentId: string;
  status: PackStatus;
  formatType: FormatType;
  assignee: string;
  dueDate?: string; // ISO date
  controls: {
    tone: ToneType;
    audience: string;
    cta: string;
  };
  draftText: string;
  versions: PackVersion[];
  checklist: PackChecklist;
  assets: {
    urls: string[];
  };
  updatedAt: string; // ISO date
}

export interface ContentFilterParams {
  searchText?: string;
  category?: string;
  minScore?: number;
  maxScore?: number;
  risk?: RiskType | "All";
}
