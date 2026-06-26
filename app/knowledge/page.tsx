import { BookMarked, Search, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getKnowledgeData } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const { articles, source } = await getKnowledgeData();

  return (
    <div>
      <PageHeader
        eyebrow="Internal Knowledge Assistant"
        title="Find the right SOP before the customer waits"
        description="A RAG-ready interface concept for dispatcher procedures, technician standards, and office workflows."
        source={source}
      />

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-md border border-summit-line bg-white p-5 shadow-panel">
          <div className="flex items-center gap-2">
            <Search size={20} className="text-summit-teal" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-summit-ink">Ask company knowledge</h2>
          </div>
          <div className="mt-4 rounded-md border border-summit-line bg-summit-cloud p-4 text-slate-700">
            What should dispatch ask before booking an emergency water heater leak?
          </div>
          <div className="mt-4 rounded-md border border-summit-line p-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-summit-gold" aria-hidden="true" />
              <p className="font-semibold text-summit-ink">Assistant answer</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Confirm active leaking, shutoff status, unit type, install location, photos, and
              whether the customer has hot water. If water is spreading, prioritize same-day service
              and prepare replacement options.
            </p>
          </div>
        </div>

        <div className="rounded-md border border-summit-line bg-white shadow-panel">
          <div className="border-b border-summit-line px-5 py-4">
            <h2 className="text-lg font-semibold text-summit-ink">Indexed SOPs</h2>
            <p className="text-sm text-slate-500">Synthetic knowledge base for the portfolio demo</p>
          </div>
          <div className="divide-y divide-summit-line">
            {articles.map((article) => (
              <article key={article.id} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <BookMarked size={20} className="mt-1 text-summit-teal" aria-hidden="true" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-summit-ink">{article.title}</h3>
                      <span className="rounded-full bg-summit-cloud px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {article.category}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{article.summary}</p>
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      Updated {article.updatedAt}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
