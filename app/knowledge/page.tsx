import { PageHeader } from "@/components/page-header";
import { KnowledgeAssistant } from "@/app/knowledge/knowledge-assistant";
import { getKnowledgeData } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const { articles, source } = await getKnowledgeData();

  return (
    <div>
      <PageHeader
        eyebrow="Internal Knowledge Assistant"
        title="Find the right SOP before the customer waits"
        description="Searchable internal knowledge for dispatcher procedures, technician standards, office workflows, and training documentation."
        source={source}
      />

      <KnowledgeAssistant articles={articles} source={source} />
    </div>
  );
}
