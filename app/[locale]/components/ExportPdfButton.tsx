'use client';

type ExportPdfButtonProps = {
  locale: 'en' | 'fr';
};

export function ExportPdfButton({locale}: ExportPdfButtonProps) {
  const label = locale === 'fr' ? 'Exporter en PDF' : 'Export PDF';

  function handleClick() {
    const url = `/api/export-pdf?locale=${encodeURIComponent(locale)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded bg-white/10 px-2 py-1 text-xs uppercase hover:bg-white/20"
    >
      {label}
    </button>
  );
}
