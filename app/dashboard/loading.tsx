export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-4 w-40 rounded-md bg-slate-200" />
        <div className="mt-3 h-10 w-full max-w-xl rounded-md bg-slate-200" />
        <div className="mt-3 h-5 w-full max-w-2xl rounded-md bg-slate-200" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-40 rounded-md border border-summit-line bg-white shadow-panel" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="h-96 rounded-md border border-summit-line bg-white shadow-panel" />
        <div className="h-96 rounded-md border border-summit-line bg-white shadow-panel" />
      </div>
    </div>
  );
}
