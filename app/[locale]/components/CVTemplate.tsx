import Link from 'next/link';
import type { CVMessages, Locale } from '../i18n';
import {ExportPdfButton} from './ExportPdfButton';

type CVTemplateProps = {
  locale: Locale;
  messages: CVMessages;
  isPrintMode?: boolean;
};

type ExperienceKey = Exclude<keyof CVMessages['Experience'], 'title'>;
type SkillKey = Exclude<keyof CVMessages['Skills'], 'title'>;

const experienceOrder: ExperienceKey[] = ['luphy', 'ksaar', 'engie', 'excilys', 'eifer'];
const skillOrder: SkillKey[] = ['frontend', 'backend', 'ai', 'devops'];

const skillIcons: Record<SkillKey, string> = {
  frontend: 'fas fa-code',
  backend: 'fas fa-server',
  ai: 'fas fa-robot',
  devops: 'fas fa-tools',
};

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
            <ExportPdfButton locale={locale} />
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
        <aside className="bg-[var(--color-bg-dark)] p-4 text-[var(--color-text-light)] print:bg-[var(--color-bg-dark)] print:text-[var(--color-text-light)] sm:p-[30px]">
          <div className="flex flex-col items-center gap-6">
            <img
              src="https://photos-dimitri.s3.fr-par.scw.cloud/photo-profile-luphy.jpg"
              alt="Profile"
              className="mb-5 aspect-square w-full max-w-[180px] rounded-full object-cover shadow-lg"
            />

            <div className="w-full print-avoid-break">
              <h2 className="!mt-0 mb-3 !font-['Bebas_Neue'] text-lg tracking-wider text-[var(--color-highlight)]">
                {messages.Contact.title}
              </h2>
              <p className="mb-1.5 flex items-center gap-2 overflow-wrap-anywhere">
                <i className="fas fa-envelope w-4"></i>
                {messages.Contact.email}
              </p>
              <p className="flex items-center gap-2 overflow-wrap-anywhere">
                <i className="fab fa-linkedin w-4"></i>
                <a
                  href="https://www.linkedin.com/in/dimitri-beubry-99343210b"
                  className="hover:underline"
                >
                  {messages.Contact.linkedin}
                </a>
              </p>
            </div>

            <div className="w-full print-avoid-break">
              <h2 className="!mt-0 mb-3 !font-['Bebas_Neue'] text-lg tracking-wider text-[var(--color-highlight)]">
                {messages.Highlights.title}
              </h2>
              <ul className="!m-0 !pl-4">
                {messages.Highlights.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="w-full print-avoid-break">
              <h2 className="!mt-0 mb-3 !font-['Bebas_Neue'] text-lg tracking-wider text-[var(--color-highlight)]">
                {messages.Skills.title}
              </h2>
              {skillOrder.map((key, sectionIndex) => {
                const section = messages.Skills[key];
                return (
                  <div key={key}>
                    <h3 className={`${sectionIndex === 0 ? 'mt-3' : 'mt-4'} mb-1.5 flex items-center gap-2 font-semibold !text-[var(--color-highlight)]`}>
                      <i className={`${skillIcons[key]} w-4`}></i> {section.title}
                    </h3>
                    <ul className="!m-0 !list-none !p-0">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2">
                          <i className="fas fa-circle w-2 text-[8px]"></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="w-full print-avoid-break">
              <h2 className="!mt-0 mb-3 !font-['Bebas_Neue'] text-lg tracking-wider text-[var(--color-highlight)]">
                {messages.Education.title}
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="flex items-center gap-2 font-bold !text-[var(--color-highlight)]">
                    <i className="fas fa-graduation-cap"></i> {messages.Education.centrale.school}
                  </p>
                  <p className="pl-6 !text-[12px] opacity-90">{messages.Education.centrale.degree}</p>
                  <p className="pl-6 !text-[12px] opacity-90">{messages.Education.centrale.subjects}</p>
                </div>
                <div>
                  <p className="flex items-center gap-2 font-bold !text-[var(--color-highlight)]">
                    <i className="fas fa-university"></i> {messages.Education.thiers.school}
                  </p>
                  <p className="pl-6 !text-[12px] opacity-90">{messages.Education.thiers.degree}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="overflow-wrap-anywhere p-8 max-[600px]:p-4 max-[600px]:pr-3 sm:pr-6">
          <header className="print-avoid-break">
            <h1>{messages.Header.name}</h1>
            <div className="mt-1 text-sm text-[var(--color-text-dark)]">{messages.Header.subtitle}</div>
          </header>

          <section className="print-avoid-break">
            <h2>{messages.About.title}</h2>
            <p>{messages.About.content}</p>
          </section>

          <section>
            <h2>{messages.Experience.title}</h2>
            <div className="flex flex-col gap-5">
              {experienceOrder.map((key) => {
                const experience = messages.Experience[key];
                return (
                  <article key={key} className="experience-block">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <i className="fas fa-briefcase text-[var(--color-text-accent)]"></i>
                      {experience.title}
                    </h3>
                    <p className="mt-0.5 mb-1 italic text-[#575757]">{experience.summary}</p>
                    <ul className="!mt-1 !mb-2 !pl-4">
                      {experience.bullets.map((bullet, index) => (
                        <li key={index}>{bullet}</li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
