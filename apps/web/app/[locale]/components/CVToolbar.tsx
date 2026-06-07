'use client';

import Link from 'next/link';
import type {Locale} from '../cv-data';
import type {LocaleLink} from '../cv-types';
import {ExportPdfButton} from './ExportPdfButton';

type CVToolbarProps = {
  locale: Locale;
  languageLinks: LocaleLink[];
  filenameBase: string;
  printPath: string;
};

export function CVToolbar({locale, languageLinks, filenameBase, printPath}: CVToolbarProps) {
  return (
    <div className="no-print fixed right-4 top-4 z-50 rounded-xl bg-[var(--color-bg-dark)]/95 p-2 shadow-lg backdrop-blur-sm">
      <div className="flex flex-wrap gap-2">
        <ExportPdfButton locale={locale} filenameBase={filenameBase} printPath={printPath} />
        {languageLinks.map((link) => {
          const isActive = link.locale === locale;
          return (
            <Link
              key={link.locale}
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              className={`rounded px-2 py-1 text-xs uppercase ${
                isActive ? 'bg-white text-[var(--color-bg-dark)]' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {link.locale.toUpperCase()}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
