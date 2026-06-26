export default function KnowledgeLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-4 w-48 rounded-md bg-slate-200" />
        <div className="mt-3 h-10 w-full max-w-2xl rounded-md bg-slate-200" />
        <div className="mt-3 h-5 w-full max-w-3xl rounded-md bg-slate-200" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="h-96 rounded-md border border-summit-line bg-white shadow-panel" />
        <div className="h-96 rounded-md border border-summit-line bg-white shadow-panel" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="h-80 rounded-md border border-summit-line bg-white shadow-panel" />
        <div className="h-80 rounded-md border border-summit-line bg-white shadow-panel" />
      </div>
    </div>
  );
}
