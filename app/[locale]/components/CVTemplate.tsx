import Link from 'next/link';
import type { CVMessages, Locale } from '../i18n';
import {ExportPdfButton} from './ExportPdfButton';

type CVTemplateProps = {
  locale: Locale;
  messages: CVMessages;
  isPrintMode?: boolean;
};

const experienceOrder = ['luphy', 'ksaar', 'engie', 'excilys', 'eifer'] as const;

export function CVTemplate({
  locale,
  messages,
  isPrintMode = false,
}: CVTemplateProps) {
  const headerT = (key: keyof CVMessages['Header']) => messages.Header[key];
  const aboutT = (key: keyof CVMessages['About']) => messages.About[key];
  const educationTitle = messages.Education.title;
  const skillsT = (key: keyof CVMessages['Skills']) => messages.Skills[key];
  const contactT = (key: keyof CVMessages['Contact']) => messages.Contact[key];
  const assetsTitle = messages.Atouts.title;

  return (
    <div className={`cv-root min-h-screen py-0 sm:py-8 print:py-0 ${isPrintMode ? 'is-print-mode' : ''}`}>
      <div className="cv-sheet mx-auto grid max-w-[900px] grid-flow-dense grid-cols-[280px_1fr] bg-white shadow-xl max-[600px]:grid-cols-[40%_1fr] sm:grid-cols-[280px_1fr]">
        <aside className="bg-[var(--color-bg-dark)] p-4 text-[var(--color-text-light)] print:bg-[var(--color-bg-dark)] print:text-[var(--color-text-light)] sm:p-[30px]">
          <div className="flex flex-col items-center gap-6">
            <img
              src="https://photos-dimitri.s3.fr-par.scw.cloud/photo-profile-luphy.jpg"
              alt="Profile"
              className="mb-5 aspect-square w-full max-w-[180px] rounded-full object-cover shadow-lg"
            />

            <div className="w-full">
              <h2 className="!mt-0 mb-3 !font-['Bebas_Neue'] text-lg tracking-wider text-[var(--color-highlight)]">
                {contactT('title')}
              </h2>
              <p className="mb-1.5 flex items-center gap-2 overflow-wrap-anywhere">
                <i className="fas fa-envelope w-4"></i>
                {contactT('email')}
              </p>
              <p className="flex items-center gap-2 overflow-wrap-anywhere">
                <i className="fab fa-linkedin w-4"></i>
                <a
                  href="https://www.linkedin.com/in/dimitri-beubry-99343210b"
                  className="hover:underline"
                >
                  {contactT('linkedin')}
                </a>
              </p>
            </div>

            {!isPrintMode && (
              <div className="no-print flex w-full flex-wrap gap-2">
                <ExportPdfButton locale={locale} />
                <Link href="/en" className="rounded bg-white/10 px-2 py-1 text-xs uppercase hover:bg-white/20">
                  EN
                </Link>
                <Link href="/fr" className="rounded bg-white/10 px-2 py-1 text-xs uppercase hover:bg-white/20">
                  FR
                </Link>
              </div>
            )}

            <div className="w-full">
              <h2 className="!mt-0 mb-3 !font-['Bebas_Neue'] text-lg tracking-wider text-[var(--color-highlight)]">
                {assetsTitle}
              </h2>
              <ul className="!m-0 !list-none !p-0">
                <li className="!mb-0">
                  <div className="flex items-start gap-2">
                    <i className="fas fa-star mt-1 text-[var(--color-highlight)]"></i>
                    <div>
                      <strong className="block text-[var(--color-highlight)]">
                        {messages.Atouts.excellence.title}
                      </strong>
                      <span className="mt-0.5 block text-xs leading-tight opacity-90">
                        {messages.Atouts.excellence.desc}
                      </span>
                    </div>
                  </div>
                </li>
                <li className="!mb-0">
                  <div className="flex items-start gap-2">
                    <i className="fas fa-check mt-1 text-[var(--color-highlight)]"></i>
                    <div>
                      <strong className="block text-[var(--color-highlight)]">
                        {messages.Atouts.rigor.title}
                      </strong>
                      <span className="mt-0.5 block text-xs leading-tight opacity-90">
                        {messages.Atouts.rigor.desc}
                      </span>
                    </div>
                  </div>
                </li>
                <li className="!mb-0">
                  <div className="flex items-start gap-2">
                    <i className="fas fa-lightbulb mt-1 text-[var(--color-highlight)]"></i>
                    <div>
                      <strong className="block text-[var(--color-highlight)]">
                        {messages.Atouts.autonomy.title}
                      </strong>
                      <span className="mt-0.5 block text-xs leading-tight opacity-90">
                        {messages.Atouts.autonomy.desc}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="w-full">
              <h2 className="!mt-0 mb-3 !font-['Bebas_Neue'] text-lg tracking-wider text-[var(--color-highlight)]">
                {skillsT('title')}
              </h2>

              <h3 className="mt-3 mb-1.5 flex items-center gap-2 font-semibold !text-[var(--color-highlight)]">
                <i className="fas fa-code w-4"></i> {skillsT('frontend')}
              </h3>
              <ul className="!m-0 !list-none !p-0">
                <li className="flex items-center">
                  <svg
                    className="icon-ts"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 256 256"
                  >
                    <rect width="256" height="256" rx="40" fill="transparent" />
                    <path
                      d="M53 108.5v-22h78v22h-27.5V203h-23V108.5H53zm149.4 94.8c-11.8 0-21.8-2.7-30-8.2-6.1-4.1-11.7-10.3-16.8-18.6l25.3-14.5c3.9 6.2 7.5 10.6 10.9 13.3 4.9 3.9 10.6 5.9 17.2 5.9 5.5 0 9.9-1.2 13.1-3.7 3.2-2.5 4.8-5.8 4.8-9.9 0-3.8-1.6-7-4.7-9.6-3.1-2.7-9.8-6.1-20.1-10.4-13.7-5.7-23.3-11.8-28.7-18.2-5.5-6.4-8.2-14.4-8.2-24 0-12 4.4-21.7 13.1-29.2 8.7-7.5 20.3-11.2 34.6-11.2 10.1 0 18.8 1.5 26 4.6 7.2 3.1 13.7 8.2 19.5 15.3 3.1 3.8 5.7 7.6 7.8 11.4l-24.3 16.1c-4.5-6.7-8.6-11.1-12.3-13.3-3.7-2.2-8.4-3.3-14.1-3.3-5 0-9 1.2-12.1 3.5-3.1 2.3-4.6 5.4-4.6 9.1 0 3.6 1.5 6.6 4.4 9.1 2.9 2.5 9.8 6.1 20.7 10.7 13.7 5.6 23.2 11.6 28.5 17.8 5.3 6.3 8 14.2 8 23.9 0 12.7-4.6 22.8-13.8 30.2-9.2 7.4-21.4 11.1-36.6 11.1z"
                      fill="#fff"
                    />
                  </svg>
                  TypeScript
                </li>
                <li className="flex items-center gap-2"><i className="fab fa-node-js w-4"></i> Node.js, NestJS</li>
                <li className="flex items-center gap-2"><i className="fab fa-react w-4"></i> React, Vue.js</li>
                <li className="flex items-center gap-2"><i className="fas fa-database w-4"></i> Sequelize, PostgreSQL, Redis</li>
                <li className="flex items-center gap-2"><i className="fas fa-stream w-4"></i> Kafka, BullMQ</li>
                <li className="flex items-center gap-2"><i className="fas fa-terminal w-4"></i> Shell Unix</li>
                <li className="flex items-center gap-2">
                  <i className="fas fa-shield-alt w-4"></i> {locale === 'fr' ? 'Sécurité' : 'Security'}
                </li>
              </ul>

              <h3 className="mt-4 mb-1.5 flex items-center gap-2 font-semibold !text-[var(--color-highlight)]">
                <i className="fas fa-server w-4"></i> {skillsT('devops')}
              </h3>
              <ul className="!m-0 !list-none !p-0">
                <li className="flex items-center gap-2"><i className="fab fa-gitlab w-4"></i> Gitlab-CI</li>
                <li className="flex items-center gap-2"><i className="fas fa-cogs w-4"></i> Ansible, Pulumi</li>
                <li className="flex items-center gap-2"><i className="fas fa-chart-line w-4"></i> Grafana</li>
                <li className="flex items-center gap-2"><i className="fas fa-cloud w-4"></i> Scaleway <span role="img" aria-label="France">🇫🇷</span></li>
                <li className="flex items-center gap-2"><i className="fab fa-docker w-4"></i> Docker</li>
                <li className="flex items-center gap-2"><i className="fas fa-project-diagram w-4"></i> Kubernetes</li>
              </ul>
            </div>

            <div className="w-full">
              <h2 className="!mt-0 mb-3 !font-['Bebas_Neue'] text-lg tracking-wider text-[var(--color-highlight)]">
                {educationTitle}
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
          <header>
            <h1>{headerT('name')}</h1>
            <div className="mt-1 text-sm text-[var(--color-text-dark)]">{headerT('subtitle')}</div>
          </header>

          <section>
            <h2>{aboutT('title')}</h2>
            <p>{aboutT('content')}</p>
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
