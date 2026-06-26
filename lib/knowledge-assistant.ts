import type { KnowledgeAnswer, KnowledgeArticle } from "@/lib/types";

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "before",
  "do",
  "for",
  "how",
  "i",
  "is",
  "of",
  "on",
  "should",
  "the",
  "to",
  "we",
  "what",
  "when"
]);

const synonymMap: Record<string, string[]> = {
  "after-hours": ["after", "hours", "emergency", "dispatch", "priority"],
  afterhours: ["after", "hours", "emergency", "dispatch", "priority"],
  "no-cool": ["no", "cooling", "hvac", "emergency", "triage"],
  nocool: ["cooling", "hvac", "emergency", "triage"],
  refund: ["invoice", "follow-up", "office", "customer"],
  notes: ["summary", "photos", "technician", "workflow"],
  parts: ["parts", "inventory", "stock", "replacement"],
  safety: ["safety", "electrical", "breaker", "panel"],
  water: ["water", "heater", "leak", "plumbing"]
};

export const exampleKnowledgeQuestions = [
  "What should I do for an emergency no-cool call?",
  "When do we offer a refund?",
  "What notes should technicians include after a job?",
  "How do we handle after-hours calls?",
  "What safety steps are required before electrical work?",
  "How do we request parts from inventory?"
];

export function answerKnowledgeQuestion(question: string, articles: KnowledgeArticle[]): KnowledgeAnswer {
  const query = question.trim();
  const tokens = tokenize(query);

  if (!query || articles.length === 0) {
    return {
      question: query,
      answer: articles.length
        ? "Ask a question or choose an example to search the indexed Summit Home Services SOPs."
        : "No knowledge articles are indexed yet. Seed Supabase or rely on mock fallback data to demo this assistant.",
      confidence: 0,
      recommendedNextStep: articles.length
        ? "Choose an example question to begin."
        : "Add SOP articles to the knowledge_articles table, then refresh this page.",
      matchedArticles: []
    };
  }

  const ranked = articles
    .map((article) => ({ article, score: scoreArticle(article, tokens) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (ranked.length === 0) {
    return {
      question: query,
      answer:
        "I could not find a strong match in the indexed Summit Home Services SOPs. This is a good signal that the company should add or update a policy document for this workflow.",
      confidence: 18,
      recommendedNextStep:
        "Escalate to the office manager and verify the answer against the official company document before advising a customer or technician.",
      matchedArticles: []
    };
  }

  const top = ranked[0];
  const confidence = Math.min(96, Math.max(35, 42 + top.score * 9 + ranked.length * 4));
  const sources = ranked.map((item) => item.article.title).join("; ");
  const answer =
    `Based on ${sources}, the recommended approach is: ${composeAnswer(query, ranked.map((item) => item.article))}`;

  return {
    question: query,
    answer,
    confidence,
    recommendedNextStep: recommendNextStep(query, top.article),
    matchedArticles: ranked.map(({ article, score }) => ({
      id: article.id,
      title: article.title,
      category: article.category,
      excerpt: getExcerpt(article, tokens),
      score,
      updatedAt: article.updatedAt
    }))
  };
}

function tokenize(input: string) {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !stopWords.has(token));

  const expanded = new Set(base);
  for (const token of base) {
    for (const synonym of synonymMap[token] ?? []) {
      if (!stopWords.has(synonym)) expanded.add(synonym);
    }
  }
  return Array.from(expanded);
}

function articleText(article: KnowledgeArticle) {
  return `${article.title} ${article.category} ${article.summary} ${article.content ?? ""}`.toLowerCase();
}

function scoreArticle(article: KnowledgeArticle, tokens: string[]) {
  const text = articleText(article);
  return tokens.reduce((score, token) => {
    if (article.title.toLowerCase().includes(token)) return score + 4;
    if (article.category.toLowerCase().includes(token)) return score + 3;
    if (text.includes(token)) return score + 1;
    return score;
  }, 0);
}

function composeAnswer(question: string, articles: KnowledgeArticle[]) {
  const snippets = articles.map((article) => article.content || article.summary);
  const lower = question.toLowerCase();

  if (lower.includes("refund")) {
    return "the indexed material does not contain a dedicated refund policy. Use the invoice follow-up SOP as context, then escalate refund decisions to the office manager before promising anything to the customer.";
  }
  if (lower.includes("technician") || lower.includes("notes")) {
    return "capture the customer issue, diagnosis, work performed, parts used, photos when relevant, safety concerns, and any follow-up required. If the indexed SOP is incomplete, treat this as a documentation gap.";
  }
  if (lower.includes("parts") || lower.includes("inventory")) {
    return "identify the likely part, check current stock or reorder risk, and document the request so dispatch can avoid scheduling a job that is blocked by missing inventory.";
  }

  return snippets.join(" ");
}

function getExcerpt(article: KnowledgeArticle, tokens: string[]) {
  const text = article.content || article.summary;
  const sentences = text.split(/(?<=[.!?])\s+/);
  const match = sentences.find((sentence) =>
    tokens.some((token) => sentence.toLowerCase().includes(token))
  );
  return match ?? article.summary;
}

function recommendNextStep(question: string, article: KnowledgeArticle) {
  const lower = question.toLowerCase();
  if (lower.includes("electrical") || article.category === "Electrical") {
    return "Verify the official electrical safety SOP, document hazards, and escalate any burning smell, panel heat, or exposed conductor before dispatch.";
  }
  if (lower.includes("refund")) {
    return "Route the request to the office manager and confirm the official refund policy before responding.";
  }
  if (lower.includes("parts")) {
    return "Check inventory availability and attach the part request to the work order before confirming the appointment window.";
  }
  return "Confirm the source SOP, document the decision in the work order, and escalate exceptions to the office manager.";
}
