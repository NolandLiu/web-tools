import type { Lang } from "../types";

export type FeedbackType = "incorrect" | "missing-option" | "experience" | "suggestion";

export type FeedbackContext = {
  toolId: string;
  slug: string;
  lang: Lang;
  canonicalUrl: string;
  type: FeedbackType;
};

export const FEEDBACK_TYPES: FeedbackType[];
export function buildFeedbackMailto(context: FeedbackContext): string;
