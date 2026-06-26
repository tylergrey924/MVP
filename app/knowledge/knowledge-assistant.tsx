"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BookMarked,
  CheckCircle2,
  FileSearch,
  Lightbulb,
  Search,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  answerKnowledgeQuestion,
  exampleKnowledgeQuestions
} from "@/lib/knowledge-assistant";
import type { DataSource, KnowledgeArticle } from "@/lib/types";

type KnowledgeAssistantProps = {
  articles: KnowledgeArticle[];
  source: DataSource;
};

export function KnowledgeAssistant({ articles, source }: KnowledgeAssistantProps) {
  const [question, setQuestion] = useState(exampleKnowledgeQuestions[0]);
  const [submittedQuestion, setSubmittedQuestion] = useState(exampleKnowledgeQuestions[0]);
  const [isThinking, setIsThinking] = useState(false);
  const answer = useMemo(
    () => answerKnowledgeQuestion(submittedQuestion, articles),
    [submittedQuestion, articles]
  );

  function submitQuestion(nextQuestion = question) {
    setQuestion(nextQuestion);
    setIsThinking(true);
    window.setTimeout(() => {
      setSubmittedQuestion(nextQuestion);
      setIsThinking(false);
    }, 180);
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-md border border-summit-line bg-white p-5 shadow-panel">
          <div className="flex items-center gap-2">
            <Search size={20} className="text-summit-teal" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-summit-ink">Ask company knowledge</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Search synthetic SOPs, policies, and training notes. Retrieval is deterministic and runs without paid AI APIs.
          </p>

          <label className="mt-5 block">
            <span className="text-sm font-medium text-slate-600">Question</span>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={4}
              className="mt-2 w-full resize-none rounded-md border border-summit-line px-3 py-2 text-sm text-summit-ink outline-none transition focus:border-summit-teal focus:ring-2 focus:ring-summit-teal/20"
            />
          </label>

          <button
            type="button"
            onClick={() => submitQuestion()}
            disabled={!question.trim() || isThinking}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-summit-pine px-4 py-2 text-sm font-semibold text-white transition hover:bg-summit-teal disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles size={17} aria-hidden="true" />
            {isThinking ? "Searching SOPs..." : "Generate answer"}
          </button>

          <div className="mt-5">
            <p className="text-sm font-semibold text-summit-ink">Suggested questions</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {exampleKnowledgeQuestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => submitQuestion(item)}
                  className="rounded-md border border-summit-line bg-summit-cloud px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:border-summit-teal hover:text-summit-pine"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-md border border-summit-line bg-white shadow-panel">
          <div className="border-b border-summit-line px-5 py-4">
            <div className="flex items-center gap-2">
              <FileSearch size={20} className="text-summit-teal" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-summit-ink">Assistant answer</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Source: {source}. Indexed articles: {articles.length}.
            </p>
          </div>

          <div className="space-y-4 p-5">
            {articles.length === 0 ? (
              <StateMessage
                icon={AlertTriangle}
                title="No SOPs indexed"
                text="No knowledge articles are available. Seed Supabase or use mock fallback data to demo this assistant."
              />
            ) : answer.matchedArticles.length === 0 ? (
              <StateMessage
                icon={AlertTriangle}
                title="No strong match found"
                text={answer.answer}
              />
            ) : (
              <>
                <div className="rounded-md border border-summit-line bg-summit-cloud p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb size={18} className="text-summit-gold" aria-hidden="true" />
                      <p className="font-semibold text-summit-ink">Mock AI-style answer</p>
                    </div>
                    <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-summit-pine">
                      {answer.confidence}% confidence
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{answer.answer}</p>
                </div>

                <div className="rounded-md border border-summit-line p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-700" aria-hidden="true" />
                    <p className="font-semibold text-summit-ink">Recommended next step</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{answer.recommendedNextStep}</p>
                </div>
              </>
            )}

            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <div className="flex gap-2">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-amber-800" aria-hidden="true" />
                <p className="text-sm leading-6 text-amber-900">
                  Demo disclaimer: this assistant is not certified legal, medical, or safety advice. Final policies should be verified against official Summit Home Services documents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-md border border-summit-line bg-white shadow-panel">
          <div className="border-b border-summit-line px-5 py-4">
            <h2 className="text-lg font-semibold text-summit-ink">Clear source citations</h2>
            <p className="text-sm text-slate-500">Matched SOPs and excerpts used to form the answer</p>
          </div>
          <div className="divide-y divide-summit-line">
            {answer.matchedArticles.length ? (
              answer.matchedArticles.map((article) => (
                <article key={article.id} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <BookMarked size={20} className="mt-1 text-summit-teal" aria-hidden="true" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-summit-ink">{article.title}</h3>
                        <span className="rounded-md bg-summit-cloud px-2 py-1 text-xs font-semibold text-slate-600">
                          {article.category}
                        </span>
                        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                          match {article.score}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{article.excerpt}</p>
                      <p className="mt-2 text-xs font-medium text-slate-500">Updated {article.updatedAt}</p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="p-5">
                <StateMessage
                  icon={AlertTriangle}
                  title="No citations available"
                  text="Try a more specific question, or add a missing SOP to the knowledge base."
                />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-md border border-summit-line bg-white p-5 shadow-panel">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-summit-gold" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-summit-ink">Demo talk track</h2>
          </div>
          <div className="mt-4 space-y-3">
            {[
              "Turns scattered SOPs and shared-drive documents into one searchable employee workflow.",
              "Helps dispatchers answer customers faster without hunting through folders or asking a manager.",
              "Keeps source citations visible so the answer can be checked before action is taken.",
              "Highlights documentation gaps when no strong SOP match exists.",
              "Shows the path toward future RAG and embeddings without needing paid AI in the MVP."
            ].map((item) => (
              <p key={item} className="rounded-md border border-summit-line bg-summit-cloud p-3 text-sm leading-6 text-slate-700">
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StateMessage({
  icon: Icon,
  title,
  text
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-md border border-dashed border-summit-line bg-summit-cloud p-4">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-amber-700" aria-hidden="true" />
        <p className="font-semibold text-summit-ink">{title}</p>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
