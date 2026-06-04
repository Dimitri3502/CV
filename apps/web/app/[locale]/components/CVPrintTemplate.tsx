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
import type {ClassicCvData} from '../cv-data';

type CVPrintTemplateProps = {
  messages: ClassicCvData;
};

const skillIcons: IconDefinition[] = [faCode, faServer, faRobot, faScrewdriverWrench];
const urlExtractPattern = /(https?:\/\/[^\s]+)/g;
const urlValidatePattern = /^https?:\/\/[^\s]+$/;
const fallbackPhotoUrl = 'https://photos-dimitri.s3.fr-par.scw.cloud/photo-profile-luphy.jpg';

function linkifyText(text: string) {
  return text.split(urlExtractPattern).map((part, index) => {
    if (urlValidatePattern.test(part)) {
      return (
        <a
          key={`url-${index}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-[var(--color-text-accent)]/60 underline-offset-2 hover:decoration-[var(--color-text-accent)]"
        >
          {part}
        </a>
      );
    }
    return <span key={`txt-${index}`}>{part}</span>;
  });
}

export function CVPrintTemplate({messages}: CVPrintTemplateProps) {
  const photoUrl = messages.Contact.photoUrl || fallbackPhotoUrl;

  return (
    <div className="cv-root is-print-mode min-h-screen py-0">
      <div className="cv-sheet grid grid-flow-dense grid-cols-[280px_1fr] bg-white">
        <aside className="cv-sidebar bg-[var(--color-bg-dark)] p-4 text-[var(--color-text-light)] print:bg-[var(--color-bg-dark)] print:text-[var(--color-text-light)] sm:p-[30px]">
          <div className="flex flex-col items-center gap-6">
            <img
              src={photoUrl}
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
              {messages.Contact.location ? (
                <p className="mb-1.5 overflow-wrap-anywhere">{messages.Contact.location}</p>
              ) : null}
              {messages.Contact.linkedin && messages.Contact.linkedinUrl ? (
                <p className="mb-1.5 overflow-wrap-anywhere">
                  <a
                    href={messages.Contact.linkedinUrl}
                    className="hover:underline"
                  >
                    {messages.Contact.linkedin}
                  </a>
                </p>
              ) : null}
              {messages.Contact.calendly && messages.Contact.calendlyUrl ? (
                <p className="overflow-wrap-anywhere">
                  <a
                    href={messages.Contact.calendlyUrl}
                    className="hover:underline"
                  >
                    {messages.Contact.calendly}
                  </a>
                </p>
              ) : null}
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
                      <li key={bulletIndex}>{linkifyText(bullet)}</li>
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
