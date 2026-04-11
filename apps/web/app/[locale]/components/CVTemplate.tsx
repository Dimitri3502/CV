import Link from 'next/link';
import {
  faAddressBook,
  faBriefcase,
  faCertificate,
  faCircle,
  faCode,
  faGraduationCap,
  faRobot,
  faScrewdriverWrench,
  faServer,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import {type IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import type { CVMessages, Locale } from '../i18n';
import {ExportPdfButton} from './ExportPdfButton';

type CVTemplateProps = {
  locale: Locale;
  messages: CVMessages;
  isPrintMode?: boolean;
};

const skillIcons: IconDefinition[] = [faCode, faServer, faRobot, faScrewdriverWrench];

export function CVTemplate({
  locale,
  messages,
  isPrintMode = false,
}: CVTemplateProps) {
  return (
    <div
      className={`cv-root min-h-screen py-0 sm:py-8 print:py-0 ${isPrintMode ? 'is-print-mode' : 'is-preview-mode'}`}
    >
      {!isPrintMode && (
        <div className="no-print fixed right-4 top-4 z-50 rounded-xl bg-[var(--color-bg-dark)]/95 p-2 shadow-lg backdrop-blur-sm">
          <div className="flex flex-wrap gap-2">
            <ExportPdfButton locale={locale} data={messages} />
            <Link
              href="/en"
              className="rounded bg-white/10 px-2 py-1 text-xs uppercase hover:bg-white/20"
            >
              EN
            </Link>
            <Link
              href="/fr"
              className="rounded bg-white/10 px-2 py-1 text-xs uppercase hover:bg-white/20"
            >
              FR
            </Link>
          </div>
        </div>
      )}

      <div className="cv-sheet mx-auto grid max-w-[900px] grid-flow-dense grid-cols-[280px_1fr] bg-white shadow-xl max-[600px]:grid-cols-[40%_1fr] sm:grid-cols-[280px_1fr]">
        <aside className="cv-sidebar bg-[var(--color-bg-dark)] p-4 text-[var(--color-text-light)] print:bg-[var(--color-bg-dark)] print:text-[var(--color-text-light)] sm:p-[30px]">
          <div className="flex flex-col items-center gap-6">
            <img
              src="https://photos-dimitri.s3.fr-par.scw.cloud/photo-profile-luphy.jpg"
              alt="Profile"
              className="mb-5 aspect-square w-full max-w-[180px] rounded-full object-cover shadow-lg"
            />

            <div className="w-full">
              <h2 className="!mt-0 mb-3 flex items-center gap-2 !font-['Bebas_Neue'] text-lg tracking-wider text-[var(--color-highlight)]">
                <span className="inline-flex h-4 w-4 items-center justify-center">
                  <FontAwesomeIcon icon={faAddressBook} className="h-[12px] w-[12px]" fixedWidth />
                </span>
                {messages.Contact.title}
              </h2>
              <p className="mb-1.5 overflow-wrap-anywhere">{messages.Contact.email}</p>
              <p className="mb-1.5 overflow-wrap-anywhere">{messages.Contact.location}</p>
              <p className="mb-1.5 overflow-wrap-anywhere">
                <a
                  href={messages.Contact.linkedinUrl}
                  className="hover:underline"
                >
                  {messages.Contact.linkedin}
                </a>
              </p>
              <p className="overflow-wrap-anywhere">
                <a
                  href={messages.Contact.calendlyUrl}
                  className="hover:underline"
                >
                  {messages.Contact.calendly}
                </a>
              </p>
            </div>

            <div className="w-full">
              <h2 className="!mt-0 mb-3 flex items-center gap-2 !font-['Bebas_Neue'] text-lg tracking-wider text-[var(--color-highlight)]">
                <span className="inline-flex h-4 w-4 items-center justify-center">
                  <FontAwesomeIcon icon={faStar} className="h-[12px] w-[12px]" fixedWidth />
                </span>
                {messages.Highlights.title}
              </h2>
              <ul className="!m-0 !pl-4">
                {messages.Highlights.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <h2 className="!mt-0 mb-3 flex items-center gap-2 !font-['Bebas_Neue'] text-lg tracking-wider text-[var(--color-highlight)]">
                <span className="inline-flex h-4 w-4 items-center justify-center">
                  <FontAwesomeIcon icon={faGraduationCap} className="h-[12px] w-[12px]" fixedWidth />
                </span>
              {messages.Education.title}
              </h2>
              <div className="flex flex-col gap-4">
                {messages.Education.items.map((education, index) => (
                  <div key={index}>
                    <p className="font-bold !text-[var(--color-highlight)]">{education.school}</p>
                    <p className="pl-6 !text-[12px] opacity-90">{education.degree}</p>
                    {'subjects' in education && education.subjects ? (
                      <p className="pl-6 !text-[12px] opacity-90">{education.subjects}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="cv-main cv-main-primary col-start-2 overflow-wrap-anywhere p-8 max-[600px]:p-4 max-[600px]:pr-3 sm:pr-6">
          <header>
            <h1>{messages.Header.name}</h1>
            <div className="mt-1 text-sm text-[var(--color-text-dark)]">{messages.Header.subtitle}</div>
          </header>

          <section>
            <h2>{messages.About.title}</h2>
            <p>{messages.About.content}</p>
          </section>

          <section>
            <h2 className="flex items-center gap-2">
              <span className="inline-flex h-4 w-4 items-center justify-center">
                <FontAwesomeIcon icon={faScrewdriverWrench} className="h-[12px] w-[12px]" fixedWidth />
              </span>
              {messages.Skills.title}
            </h2>
            <div className="mt-1 flex flex-col gap-4">
              {messages.Skills.items.map((section, sectionIndex) => {
                const iconDefinition = skillIcons[sectionIndex] ?? faCircle;
                return (
                  <div key={sectionIndex}>
                    <h3 className="mb-1.5 flex items-center gap-2 font-semibold">
                      <span className="inline-flex h-4 w-4 items-center justify-center">
                        <FontAwesomeIcon
                          icon={iconDefinition}
                          className="h-[12px] w-[12px] text-[var(--color-text-accent)]"
                          fixedWidth
                        />
                      </span>
                      {section.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {section.items.map((item, itemIndex) => (
                        <span
                          key={itemIndex}
                          className="inline-flex items-center rounded-full border border-[var(--color-text-accent)]/35 bg-white px-2 py-0.5 text-[12px] leading-5 text-[var(--color-text-dark)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-4 break-inside-avoid">
            <h2 className="!mb-1 flex items-center gap-2">
              <span className="inline-flex h-4 w-4 items-center justify-center">
                <FontAwesomeIcon
                  icon={faCertificate}
                  className="h-[11px] w-[11px] text-[var(--color-text-accent)]"
                  fixedWidth
                />
              </span>
              {messages.Certifications.title}
            </h2>
            <div className="flex flex-col gap-1.5">
              {messages.Certifications.items.map((certification, index) => (
                <article key={index} className="text-[12px] leading-snug">
                  <p className="!m-0 font-semibold text-[var(--color-text-dark)]">{certification.name}</p>
                  <p className="!m-0 text-[#575757]">
                    {certification.issued} · {certification.issuer}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </main>

        <section className="cv-main-secondary col-span-2 overflow-wrap-anywhere px-8 pb-8 max-[600px]:px-4 max-[600px]:pr-3 sm:pr-6">
          <section>
            <h2>{messages.Experience.title}</h2>
            <div className="flex flex-col gap-5">
              {messages.Experience.items.map((experience, index) => (
                <article key={index}>
                  <h3 className="flex items-center gap-2 font-semibold">
                    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
                      <FontAwesomeIcon
                        icon={faBriefcase}
                        className="h-[12px] w-[12px] text-[var(--color-text-accent)]"
                        fixedWidth
                      />
                    </span>
                    {experience.title}
                  </h3>
                  <p className="mt-0.5 mb-1 italic text-[#575757]">{experience.summary}</p>
                  <ul className="!mt-1 !mb-2 !pl-4">
                    {experience.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
