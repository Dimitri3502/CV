export function CVPdfPreviewFrame({src, title}: {src: string; title: string}) {
  return (
    <div className="min-w-0">
      <div className="mx-auto w-[min(var(--a4-width),100%)] max-w-[var(--a4-width)]">
        <iframe
          key={src}
          title={title}
          src={src}
          className="block h-[calc(100vh-2rem)] min-h-[900px] w-full rounded bg-white shadow-xl"
        />
      </div>
    </div>
  );
}
