import Link from 'next/link';
import { use } from 'react';

export default function CVPage(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params);
  const locale = params.locale;

  // Directly import messages to avoid dynamic usage of getTranslations during static export
  const messages = require(`../../messages/${locale}.json`);
  
  const headerT = (key: string) => messages.Header[key];
  const aboutT = (key: string) => messages.About[key];
  const expT = (key: string) => messages.Experience[key];
  const eduT = (key: string) => {
    const keys = key.split('.');
    let result: any = messages.Education;
    for (const k of keys) result = result[k];
    return result;
  };
  const skillsT = (key: string) => messages.Skills[key];
  const contactT = (key: string) => messages.Contact[key];
  const assetsT = (key: string) => {
    const keys = key.split('.');
    let result: any = messages.Atouts;
    for (const k of keys) result = result[k];
    return result;
  };

  const experiences = ['luphy', 'ksaar', 'engie', 'excilys', 'eifer'];

  return (
    <div className="min-h-screen py-0 sm:py-8 print:py-0">
      <div className="max-w-[900px] mx-auto bg-white shadow-xl grid grid-cols-[280px_1fr] sm:grid-cols-[280px_1fr] grid-flow-dense max-[600px]:grid-cols-[40%_1fr]">

        {/* Sidebar */}
        <aside className="bg-[var(--color-bg-dark)] text-[var(--color-text-light)] p-4 sm:p-[30px] flex flex-col gap-6 items-center print:bg-[var(--color-bg-dark)] print:text-[var(--color-text-light)]">
          <img
            src="https://photos-dimitri.s3.fr-par.scw.cloud/photo-profile-luphy.jpg"
            alt="Profile"
            className="w-full max-w-[180px] aspect-square rounded-full object-cover shadow-lg mb-5"
          />

          <div className="w-full">
            <h2 className="!font-['Bebas_Neue'] text-lg !mt-0 mb-3 text-[var(--color-highlight)] tracking-wider">{contactT('title')}</h2>
            <p className="flex items-center gap-2 mb-1.5 overflow-wrap-anywhere">
              <i className="fas fa-envelope w-4"></i>
              {contactT('email')}
            </p>
            <p className="flex items-center gap-2 overflow-wrap-anywhere">
              <i className="fab fa-linkedin w-4"></i>
              <a href="https://www.linkedin.com/in/dimitri-beubry-99343210b" className="hover:underline">{contactT('linkedin')}</a>
            </p>
          </div>

          <div className="w-full no-print flex gap-2">
            <Link href="/en" className="px-2 py-1 bg-white/10 rounded hover:bg-white/20 text-xs uppercase">EN</Link>
            <Link href="/fr" className="px-2 py-1 bg-white/10 rounded hover:bg-white/20 text-xs uppercase">FR</Link>
          </div>

          <div className="w-full">
            <h2 className="!font-['Bebas_Neue'] text-lg !mt-0 mb-3 text-[var(--color-highlight)] tracking-wider">{assetsT('title')}</h2>
            <ul className="!list-none !m-0 !p-0 flex flex-col gap-4">
              <li className="!mb-0">
                <div className="flex items-start gap-2">
                  <i className="fas fa-star mt-1 text-[var(--color-highlight)]"></i>
                  <div>
                    <strong className="block text-[var(--color-highlight)]">{assetsT('excellence.title')}</strong>
                    <span className="block text-xs opacity-90 leading-tight mt-0.5">{assetsT('excellence.desc')}</span>
                  </div>
                </div>
              </li>
              <li className="!mb-0">
                <div className="flex items-start gap-2">
                  <i className="fas fa-check mt-1 text-[var(--color-highlight)]"></i>
                  <div>
                    <strong className="block text-[var(--color-highlight)]">{assetsT('rigor.title')}</strong>
                    <span className="block text-xs opacity-90 leading-tight mt-0.5">{assetsT('rigor.desc')}</span>
                  </div>
                </div>
              </li>
              <li className="!mb-0">
                <div className="flex items-start gap-2">
                  <i className="fas fa-lightbulb mt-1 text-[var(--color-highlight)]"></i>
                  <div>
                    <strong className="block text-[var(--color-highlight)]">{assetsT('autonomy.title')}</strong>
                    <span className="block text-xs opacity-90 leading-tight mt-0.5">{assetsT('autonomy.desc')}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="w-full">
            <h2 className="!font-['Bebas_Neue'] text-lg !mt-0 mb-3 text-[var(--color-highlight)] tracking-wider">{skillsT('title')}</h2>

            <h3 className="!text-[var(--color-highlight)] font-semibold mt-3 mb-1.5 flex items-center gap-2">
              <i className="fas fa-code w-4"></i> {skillsT('frontend')}
            </h3>
            <ul className="!list-none !m-0 !p-0 flex flex-col gap-1.5 pl-0">
              <li className="flex items-center">
                <svg className="icon-ts" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
                  <rect width="256" height="256" rx="40" fill="transparent"/>
                  <path d="M53 108.5v-22h78v22h-27.5V203h-23V108.5H53zm149.4 94.8c-11.8 0-21.8-2.7-30-8.2-6.1-4.1-11.7-10.3-16.8-18.6l25.3-14.5c3.9 6.2 7.5 10.6 10.9 13.3 4.9 3.9 10.6 5.9 17.2 5.9 5.5 0 9.9-1.2 13.1-3.7 3.2-2.5 4.8-5.8 4.8-9.9 0-3.8-1.6-7-4.7-9.6-3.1-2.7-9.8-6.1-20.1-10.4-13.7-5.7-23.3-11.8-28.7-18.2-5.5-6.4-8.2-14.4-8.2-24 0-12 4.4-21.7 13.1-29.2 8.7-7.5 20.3-11.2 34.6-11.2 10.1 0 18.8 1.5 26 4.6 7.2 3.1 13.7 8.2 19.5 15.3 3.1 3.8 5.7 7.6 7.8 11.4l-24.3 16.1c-4.5-6.7-8.6-11.1-12.3-13.3-3.7-2.2-8.4-3.3-14.1-3.3-5 0-9 1.2-12.1 3.5-3.1 2.3-4.6 5.4-4.6 9.1 0 3.6 1.5 6.6 4.4 9.1 2.9 2.5 9.8 6.1 20.7 10.7 13.7 5.6 23.2 11.6 28.5 17.8 5.3 6.3 8 14.2 8 23.9 0 12.7-4.6 22.8-13.8 30.2-9.2 7.4-21.4 11.1-36.6 11.1z" fill="#fff"/>
                </svg>
                TypeScript
              </li>
              <li className="flex items-center gap-2"><i className="fab fa-node-js w-4"></i> Node.js, NestJS</li>
              <li className="flex items-center gap-2"><i className="fab fa-react w-4"></i> React, Vue.js</li>
              <li className="flex items-center gap-2"><i className="fas fa-database w-4"></i> Sequelize, PostgreSQL, Redis</li>
              <li className="flex items-center gap-2"><i className="fas fa-stream w-4"></i> Kafka, BullMQ</li>
              <li className="flex items-center gap-2"><i className="fas fa-terminal w-4"></i> Shell Unix</li>
              <li className="flex items-center gap-2"><i className="fas fa-shield-alt w-4"></i> {locale === 'fr' ? 'Sécurité' : 'Security'}</li>
            </ul>

            <h3 className="!text-[var(--color-highlight)] font-semibold mt-4 mb-1.5 flex items-center gap-2">
              <i className="fas fa-server w-4"></i> {skillsT('devops')}
            </h3>
            <ul className="!list-none !m-0 !p-0 flex flex-col gap-1.5 pl-0">
              <li className="flex items-center gap-2"><i className="fab fa-gitlab w-4"></i> Gitlab‑CI</li>
              <li className="flex items-center gap-2"><i className="fas fa-cogs w-4"></i> Ansible, Pulumi</li>
              <li className="flex items-center gap-2"><i className="fas fa-chart-line w-4"></i> Grafana</li>
              <li className="flex items-center gap-2"><i className="fas fa-cloud w-4"></i> Scaleway</li>
              <li className="flex items-center gap-2"><i className="fab fa-docker w-4"></i> Docker</li>
              <li className="flex items-center gap-2"><i className="fas fa-project-diagram w-4"></i> Kubernetes</li>
            </ul>
          </div>

          <div className="w-full">
            <h2 className="!font-['Bebas_Neue'] text-lg !mt-0 mb-3 text-[var(--color-highlight)] tracking-wider">{eduT('title')}</h2>
            <div className="flex flex-col gap-4">
              <div>
                <p className="flex items-center gap-2 font-bold !text-[var(--color-highlight)]">
                  <i className="fas fa-graduation-cap"></i> {eduT('centrale.school')}
                </p>
                <p className="pl-6 !text-[12px] opacity-90">{eduT('centrale.degree')}</p>
                <p className="pl-6 !text-[12px] opacity-90">{eduT('centrale.subjects')}</p>
              </div>
              <div>
                <p className="flex items-center gap-2 font-bold !text-[var(--color-highlight)]">
                  <i className="fas fa-university"></i> {eduT('thiers.school')}
                </p>
                <p className="pl-6 !text-[12px] opacity-90">{eduT('thiers.degree')}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="p-8 sm:pr-6 max-[600px]:p-4 max-[600px]:pr-3 overflow-wrap-anywhere">
          <header>
            <h1>{headerT('name')}</h1>
            <div className="text-sm mt-1 text-[var(--color-text-dark)]">{headerT('subtitle')}</div>
          </header>

          <section>
            <h2>{aboutT('title')}</h2>
            <p>{aboutT('content')}</p>
          </section>

          <section>
            <h2>{expT('title')}</h2>
            <div className="flex flex-col gap-5">
              {experiences.map((key) => (
                <div key={key}>
                  <h3 className="flex items-center gap-2 font-semibold">
                    <i className="fas fa-briefcase text-[var(--color-text-accent)]"></i>
                    {messages.Experience[key].title}
                  </h3>
                  <p className="mt-0.5 mb-1 text-[#575757] italic">
                    {messages.Experience[key].summary}
                  </p>
                  <ul className="!mt-1 !mb-2 !pl-4">
                    {messages.Experience[key].bullets.map((bullet: string, i: number) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
