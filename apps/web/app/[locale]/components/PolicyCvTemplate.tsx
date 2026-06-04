import {
  faAddressBook,
  faBookOpen,
  faBriefcase,
  faBullseye,
  faCertificate,
  faCircle,
  faGlobe,
  faGraduationCap,
  faScaleBalanced,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import {type IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {resolveCvTheme} from '@cv/common';
import type {CSSProperties} from 'react';
import {buildPrintHref, type Locale} from '../cv-data';
import type {LocaleLink, PolicyCvData} from '../cv-types';
import {CVToolbar} from './CVToolbar';

type PolicyCvTemplateProps = {
  locale: Locale;
  data: PolicyCvData;
  languageLinks: LocaleLink[];
  profileSlug: string;
};

const expertiseIcons: IconDefinition[] = [
  faBullseye,
  faScaleBalanced,
  faUsers,
  faCircle,
];

export function PolicyCvTemplate({
  locale,
  data,
  languageLinks,
  profileSlug,
}: PolicyCvTemplateProps) {
  const theme = resolveCvTheme(data.Meta.themeColor);
  const photoUrl = data.Contact.photoUrl?.trim();
  const printPath = buildPrintHref(locale, profileSlug);
  const policyThemeStyles = {
    '--color-bg-light': theme.pageBg,
    '--color-bg-dark': theme.sidebarBg,
    '--color-text-light': theme.sidebarText,
    '--color-text-accent': theme.accent,
    '--color-highlight': theme.sidebarTitle,
    '--policy-muted': theme.mutedText,
    '--policy-sidebar-text': theme.sidebarText,
    '--policy-sidebar-kicker': theme.sidebarKicker,
    '--policy-sidebar-divider': theme.sidebarDivider,
    '--policy-tag-bg': theme.tagBg,
    '--policy-tag-border': theme.tagBorder,
    '--policy-tag-text': theme.tagText,
    '--policy-card-bg': theme.cardBg,
    '--policy-card-bg-strong': theme.cardBgStrong,
    '--policy-card-border': theme.cardBorder,
  } as CSSProperties;

  function renderSidebarContent() {
    return (
      <div className="flex flex-col gap-6">
        {photoUrl ? (
          <div className="flex justify-center">
            <img
              src={photoUrl}
              alt={data.Header.name}
              className="aspect-square w-full max-w-[170px] rounded-full object-cover shadow-lg"
            />
          </div>
        ) : null}

        <div
          className="border-b pb-4"
          style={{borderColor: 'var(--policy-sidebar-divider)'}}
        >
          <p
            className="!m-0 text-[11px] uppercase tracking-[0.28em]"
            style={{color: 'var(--policy-sidebar-kicker)'}}
          >
            CV
          </p>
        </div>

        <div className="w-full">
          <h2 className="!mt-0 mb-3 flex items-center gap-2 !font-['Bebas_Neue'] text-lg tracking-wider text-[var(--color-highlight)]">
            <span className="inline-flex h-4 w-4 items-center justify-center">
              <FontAwesomeIcon icon={faAddressBook} className="h-[12px] w-[12px]" fixedWidth />
            </span>
            {data.Contact.title}
          </h2>
          <div className="space-y-1.5">
            <p className="overflow-wrap-anywhere">{data.Contact.email}</p>
            <p className="overflow-wrap-anywhere">{data.Contact.phone}</p>
            <p className="overflow-wrap-anywhere">
              <a href={data.Contact.linkedinUrl} className="hover:underline">
                {data.Contact.linkedinLabel}
              </a>
            </p>
          </div>
        </div>

        <div className="w-full">
          <h2 className="!mt-0 mb-3 flex items-center gap-2 !font-['Bebas_Neue'] text-lg tracking-wider text-[var(--color-highlight)]">
            <span className="inline-flex h-4 w-4 items-center justify-center">
              <FontAwesomeIcon icon={faBullseye} className="h-[12px] w-[12px]" fixedWidth />
            </span>
            {data.Expertise.title}
          </h2>
          <div className="flex flex-col gap-4">
            {data.Expertise.groups.map((group, groupIndex) => {
              const iconDefinition = expertiseIcons[groupIndex] ?? faCircle;
              return (
                <div key={group.title}>
                  <h3 className="mb-1.5 flex items-center gap-2 font-semibold text-[var(--color-highlight)]">
                    <span className="inline-flex h-4 w-4 items-center justify-center">
                      <FontAwesomeIcon icon={iconDefinition} className="h-[12px] w-[12px]" fixedWidth />
                    </span>
                    {group.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[12px] leading-5"
                        style={{
                          border: '1px solid var(--policy-tag-border)',
                          backgroundColor: 'var(--policy-tag-bg)',
                          color: 'var(--policy-tag-text)',
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full">
          <h2 className="!mt-0 mb-3 flex items-center gap-2 !font-['Bebas_Neue'] text-lg tracking-wider text-[var(--color-highlight)]">
            <span className="inline-flex h-4 w-4 items-center justify-center">
              <FontAwesomeIcon icon={faGlobe} className="h-[12px] w-[12px]" fixedWidth />
            </span>
            {data.Languages.title}
          </h2>
          <ul className="!m-0 !pl-4">
            {data.Languages.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  function renderMainHeader() {
    return (
      <header
        className="border-b pb-4"
        style={{borderColor: 'var(--policy-card-border)'}}
      >
        <h1>{data.Header.name}</h1>
        <div className="mt-1 max-w-[95%] text-sm text-[var(--color-text-dark)]">{data.Header.subtitle}</div>
      </header>
    );
  }

  function renderFirstPageSections() {
    return (
      <>
        <section className="mt-4 policy-first-page-section">
          <h2>{data.Profile.title}</h2>
          <p>{data.Profile.content}</p>
        </section>

        <section className="mt-5 policy-first-page-section">
          <h2 className="flex items-center gap-2">
            <span className="inline-flex h-4 w-4 items-center justify-center">
              <FontAwesomeIcon icon={faGraduationCap} className="h-[12px] w-[12px] text-[var(--color-text-accent)]" fixedWidth />
            </span>
            {data.Education.title}
          </h2>
          <div className="flex flex-col gap-4">
            {data.Education.items.map((item) => (
              <article key={`${item.degree}-${item.institution}`}>
                <p className="font-semibold">{item.degree}</p>
                <p className="!m-0 text-[12px] text-[var(--policy-muted)]">{item.institution}</p>
                {item.period ? <p className="!m-0 text-[12px] text-[var(--policy-muted)]">{item.period}</p> : null}
                {item.details?.map((detail) => (
                  <p key={detail} className="!mt-1 !mb-0 text-[12px] text-[var(--policy-muted)]">
                    {detail}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 policy-first-page-section">
          <h2 className="flex items-center gap-2">
            <span className="inline-flex h-4 w-4 items-center justify-center">
              <FontAwesomeIcon icon={faCertificate} className="h-[12px] w-[12px] text-[var(--color-text-accent)]" fixedWidth />
            </span>
            {data.Certifications.title}
          </h2>
          <div className="flex flex-col gap-2">
            {data.Certifications.items.map((item) => (
              <article key={item.name} className="text-[12px] leading-snug">
                <p className="!m-0 font-semibold text-[var(--color-text-dark)]">{item.name}</p>
                <p className="!m-0 text-[var(--policy-muted)]">{item.issuerLine}</p>
              </article>
            ))}
          </div>
        </section>
      </>
    );
  }

  function renderFollowUpSections() {
    return (
      <>
        <section>
          <h2 className="flex items-center gap-2">
            <span className="inline-flex h-4 w-4 items-center justify-center">
              <FontAwesomeIcon icon={faBriefcase} className="h-[12px] w-[12px] text-[var(--color-text-accent)]" fixedWidth />
            </span>
            {data.Experience.title}
          </h2>
          <div className="flex flex-col gap-5">
            {data.Experience.items.map((item) => (
              <article key={`${item.role}-${item.organization}`}>
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                  <div>
                    <h3 className="font-semibold">{item.role}</h3>
                    <p className="!m-0 text-[13px] text-[var(--color-text-accent)]">
                      {item.organization}
                      {item.location ? `, ${item.location}` : ''}
                    </p>
                  </div>
                  <p className="!m-0 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--policy-muted)]">
                    {item.period}
                  </p>
                </div>
                <ul className="!mt-1.5 !mb-0 !pl-4">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <h2 className="flex items-center gap-2">
            <span className="inline-flex h-4 w-4 items-center justify-center">
              <FontAwesomeIcon icon={faBookOpen} className="h-[12px] w-[12px] text-[var(--color-text-accent)]" fixedWidth />
            </span>
            {data.Publications.title}
          </h2>
          {data.Publications.subtitle ? (
            <p className="!mt-0 !mb-2 italic text-[var(--policy-muted)]">{data.Publications.subtitle}</p>
          ) : null}
          <div className="flex flex-col gap-2">
            {data.Publications.items.map((item) => (
              <p key={item} className="!m-0">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <h2>{data.Interventions.title}</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {data.Interventions.items.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border p-3"
                style={{
                  borderColor: 'var(--policy-card-border)',
                  backgroundColor: 'var(--policy-card-bg-strong)',
                }}
              >
                <p className="!m-0 font-semibold">{item.title}</p>
                <p className="!mt-1 !mb-0 text-[12px] uppercase tracking-[0.12em] text-[var(--policy-muted)]">{item.meta}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <h2>{data.Engagements.title}</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {data.Engagements.items.map((item) => (
              <article
                key={`${item.title}-${item.organization}`}
                className="rounded-xl border p-3 shadow-sm"
                style={{
                  borderColor: 'var(--policy-card-border)',
                  backgroundColor: 'var(--policy-card-bg)',
                }}
              >
                <p className="!m-0 font-semibold">{item.title}</p>
                <p className="!mt-1 !mb-0">{item.organization}</p>
                <p className="!mt-1 !mb-0 text-[12px] uppercase tracking-[0.12em] text-[var(--policy-muted)]">{item.period}</p>
              </article>
            ))}
          </div>
        </section>
      </>
    );
  }

  function renderScreenLayout() {
    return (
      <div className="cv-sheet policy-cv-sheet mx-auto grid max-w-[900px] grid-flow-dense grid-cols-[280px_1fr] bg-white shadow-xl max-[600px]:grid-cols-[40%_1fr] sm:grid-cols-[280px_1fr]">
        <aside className="cv-sidebar policy-cv-sidebar bg-[var(--color-bg-dark)] p-4 text-[var(--color-text-light)] print:bg-[var(--color-bg-dark)] print:text-[var(--color-text-light)] sm:p-[30px]">
          {renderSidebarContent()}
        </aside>

        <main className="cv-main cv-main-primary policy-cv-main col-start-2 overflow-wrap-anywhere p-8 max-[600px]:p-4 max-[600px]:pr-3 sm:pr-6">
          {renderMainHeader()}
          {renderFirstPageSections()}
        </main>

        <section className="cv-main-secondary policy-cv-main-secondary col-span-2 overflow-wrap-anywhere px-8 pb-8 max-[600px]:px-4 max-[600px]:pr-3 sm:pr-6">
          {renderFollowUpSections()}
        </section>
      </div>
    );
  }

  return (
    <div
      style={policyThemeStyles}
      className="cv-root is-preview-mode min-h-screen py-0 sm:py-8 print:py-0"
    >
      <CVToolbar
        locale={locale}
        languageLinks={languageLinks}
        filenameBase={data.Meta.filenameBase}
        printPath={printPath}
      />
      {renderScreenLayout()}
    </div>
  );
}
