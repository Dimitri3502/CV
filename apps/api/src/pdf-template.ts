import {icon, type IconDefinition} from '@fortawesome/fontawesome-svg-core';
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

type JsonRecord = Record<string, unknown>;
const SKILL_SECTION_ICONS: IconDefinition[] = [
  faCode,
  faServer,
  faRobot,
  faScrewdriverWrench,
];

function asRecord(value: unknown): JsonRecord | null {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return value as JsonRecord;
  }
  return null;
}

function asRecordArray(value: unknown): JsonRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => asRecord(item))
    .filter((item): item is JsonRecord => item !== null);
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderList(items: string[], className = ''): string {
  if (!items.length) {
    return '';
  }
  const listClassName = className ? ` class="${className}"` : '';
  return `<ul${listClassName}>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderLink(label: string, href: string): string {
  if (!label || !href) {
    return '';
  }
  return `<p><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></p>`;
}

function renderInlineIcon(iconDefinition: IconDefinition, className = ''): string {
  const classes = ['cv-icon-svg'];
  if (className) {
    classes.push(className);
  }
  return icon(iconDefinition, {classes}).html.join('');
}

function renderH2WithIcon(title: string, iconDefinition: IconDefinition): string {
  return `
    <h2 class="section-title">
      <span class="section-icon">${renderInlineIcon(iconDefinition)}</span>
      <span>${escapeHtml(title)}</span>
    </h2>
  `;
}

function renderH3WithIcon(title: string, iconDefinition: IconDefinition): string {
  return `
    <h3 class="item-title-with-icon">
      <span class="section-icon">${renderInlineIcon(iconDefinition, 'small')}</span>
      <span>${escapeHtml(title)}</span>
    </h3>
  `;
}

function renderSkillGroups(skills: JsonRecord): string {
  const groups = asRecordArray(skills.items)
    .map((group, groupIndex) => {
      const title = asString(group.title);
      const items = asStringArray(group.items);
      if (!title && !items.length) {
        return '';
      }

      const tags = items
        .map((item) => `<span class="tag">${escapeHtml(item)}</span>`)
        .join('');

      return `
        <article class="skill-group">
          ${title ? renderH3WithIcon(title, SKILL_SECTION_ICONS[groupIndex] ?? faCircle) : ''}
          ${tags ? `<div class="tag-row">${tags}</div>` : ''}
        </article>
      `;
    })
    .join('');

  if (!groups) {
    return '';
  }

  const sectionTitle = asString(skills.title) || 'Skills';
  return `
    <section>
      ${renderH2WithIcon(sectionTitle, faScrewdriverWrench)}
      ${groups}
    </section>
  `;
}

function renderExperience(experience: JsonRecord): string {
  const items = asRecordArray(experience.items)
    .map((item) => {
      const title = asString(item.title);
      const summary = asString(item.summary);
      const bullets = asStringArray(item.bullets);

      if (!title && !summary && !bullets.length) {
        return '';
      }

      return `
        <article class="experience-item">
          ${title ? renderH3WithIcon(title, faBriefcase) : ''}
          ${summary ? `<p class="summary">${escapeHtml(summary)}</p>` : ''}
          ${renderList(bullets)}
        </article>
      `;
    })
    .join('');

  if (!items) {
    return '';
  }

  const sectionTitle = asString(experience.title) || 'Experience';
  return `
    <div class="cv-following-pages">
      <section class="experience">
        ${renderH2WithIcon(sectionTitle, faBriefcase)}
        ${items}
      </section>
    </div>
  `;
}

function renderEducation(education: JsonRecord): string {
  const items = asRecordArray(education.items)
    .map((item) => {
      const school = asString(item.school);
      const degree = asString(item.degree);
      const subjects = asString(item.subjects);

      if (!school && !degree && !subjects) {
        return '';
      }

      return `
        <article>
          ${school ? `<p class="title">${escapeHtml(school)}</p>` : ''}
          ${degree ? `<p>${escapeHtml(degree)}</p>` : ''}
          ${subjects ? `<p>${escapeHtml(subjects)}</p>` : ''}
        </article>
      `;
    })
    .join('');

  if (!items) {
    return '';
  }

  const sectionTitle = asString(education.title) || 'Education';
  return `
    <section class="sidebar-section">
      ${renderH2WithIcon(sectionTitle, faGraduationCap)}
      <div class="stack">${items}</div>
    </section>
  `;
}

function renderCertifications(certifications: JsonRecord): string {
  const items = asRecordArray(certifications.items)
    .map((item) => {
      const name = asString(item.name);
      const issued = asString(item.issued);
      const issuer = asString(item.issuer);

      if (!name && !issued && !issuer) {
        return '';
      }

      return `
        <article class="certification-item">
          ${name ? `<p class="title">${escapeHtml(name)}</p>` : ''}
          ${issued || issuer ? `<p>${escapeHtml([issued, issuer].filter(Boolean).join(' - '))}</p>` : ''}
        </article>
      `;
    })
    .join('');

  if (!items) {
    return '';
  }

  const sectionTitle = asString(certifications.title) || 'Certifications';
  return `
    <section>
      ${renderH2WithIcon(sectionTitle, faCertificate)}
      <div class="stack">
        ${items}
      </div>
    </section>
  `;
}

export function buildCvHtml(data: JsonRecord): string {
  const header = asRecord(data.Header) ?? {};
  const contact = asRecord(data.Contact) ?? {};
  const about = asRecord(data.About) ?? {};
  const highlights = asRecord(data.Highlights) ?? {};
  const skills = asRecord(data.Skills) ?? {};
  const experience = asRecord(data.Experience) ?? {};
  const education = asRecord(data.Education) ?? {};
  const certifications = asRecord(data.Certifications) ?? {};

  const name = asString(header.name);
  const subtitle = asString(header.subtitle);
  const aboutTitle = asString(about.title) || 'About';
  const aboutContent = asString(about.content);

  const contactTitle = asString(contact.title) || 'Contact';
  const contactEmail = asString(contact.email);
  const contactLocation = asString(contact.location);
  const linkedinLabel = asString(contact.linkedin);
  const linkedinUrl = asString(contact.linkedinUrl);
  const calendlyLabel = asString(contact.calendly);
  const calendlyUrl = asString(contact.calendlyUrl);
  const profilePhotoUrl = asString(contact.photoUrl) || 'https://photos-dimitri.s3.fr-par.scw.cloud/photo-profile-luphy.jpg';

  const highlightsTitle = asString(highlights.title) || 'Highlights';
  const highlightItems = asStringArray(highlights.items);

  return `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(name || 'CV')}</title>
      <style>
        :root {
          --color-bg-light: #dfe3e8;
          --color-bg-dark: #424f61;
          --color-text-dark: #393939;
          --color-text-light: #f0f0f0;
          --color-text-accent: #424f64;
          --a4-width: 210mm;
          --a4-height: 297mm;
          --sidebar-width: 280px;
          --font-name-size: 40.8px;
          --font-h2-size: 16.8px;
          --font-h3-size: 15.6px;
          --font-body-size: 14.4px;
          --font-subtitle-size: 15.6px;
          --font-tag-size: 13.2px;
        }

        @page {
          size: A4 portrait;
          margin: 12mm 12mm 14mm;
        }

        @page :first {
          margin: 0;
        }

        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          background: #ffffff;
          color: var(--color-text-dark);
          font-family: "Noto Sans", "Segoe UI", Arial, sans-serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .cv-sheet {
          width: var(--a4-width);
          min-height: var(--a4-height);
          margin: 0 auto;
          background: #ffffff;
          display: grid;
          grid-template-columns: var(--sidebar-width) 1fr;
        }

        .cv-following-pages {
          background: #ffffff;
          break-before: page;
        }

        .sidebar {
          background: var(--color-bg-dark);
          color: var(--color-text-light);
          padding: 26px 22px;
          min-height: var(--a4-height);
        }

        .profile {
          display: flex;
          justify-content: center;
          margin-bottom: 18px;
        }

        .profile img {
          width: 150px;
          height: 150px;
          border-radius: 999px;
          object-fit: cover;
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.22);
        }

        .main {
          padding: 30px 30px 18px;
        }

        .experience {
          padding: 0;
        }

        h1 {
          margin: 0;
          font-family: "Bebas Neue", "Arial Narrow", Arial, sans-serif;
          font-size: var(--font-name-size);
          line-height: 1.05;
          letter-spacing: 0.03em;
          color: var(--color-text-accent);
        }

        h2 {
          margin: 6px 0 12px;
          font-size: var(--font-h2-size);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-text-accent);
        }

        .sidebar h2 {
          color: #ffffff;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 9.6px;
        }

        .section-icon {
          display: inline-flex;
          width: 16.8px;
          justify-content: center;
          line-height: 1;
        }

        .cv-icon-svg {
          width: 14.4px;
          height: 14.4px;
          display: block;
        }

        .cv-icon-svg.small {
          width: 13.2px;
          height: 13.2px;
        }

        h3 {
          margin: 0 0 3px;
          font-size: var(--font-h3-size);
          color: var(--color-text-dark);
        }

        .item-title-with-icon {
          display: flex;
          align-items: center;
          gap: 8.4px;
        }

        p, li {
          margin: 0;
          font-size: var(--font-body-size);
          line-height: 1.5;
        }

        ul {
          margin: 6px 0 0;
          padding-left: 16px;
        }

        li {
          margin-bottom: 2px;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .subtitle {
          margin-top: 2px;
          margin-bottom: 16px;
          font-size: var(--font-subtitle-size);
          color: #575757;
        }

        .stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sidebar-section {
          margin-bottom: 20px;
        }

        .sidebar-section .title {
          font-weight: 700;
          color: #ffffff;
        }

        .sidebar p {
          color: rgba(240, 240, 240, 0.96);
        }

        .about {
          margin-bottom: 22px;
        }

        .main section + section {
          margin-top: 22px;
        }

        .about p {
          color: var(--color-text-dark);
        }

        .skill-group {
          margin-bottom: 10px;
        }

        .tag-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 5px;
        }

        .tag {
          display: inline-flex;
          border: 1px solid rgba(66, 79, 100, 0.35);
          border-radius: 999px;
          padding: 2px 8px;
          font-size: var(--font-tag-size);
          line-height: 1.35;
          background: #ffffff;
        }

        .experience-item {
          margin-bottom: 10px;
          break-inside: avoid;
        }

        .summary {
          margin-bottom: 4px;
          color: #575757;
          font-style: italic;
        }

        .certification-item .title {
          font-weight: 700;
        }
      </style>
    </head>
    <body>
      <div class="cv-sheet">
        <aside class="sidebar">
          <div class="profile">
            <img src="${escapeHtml(profilePhotoUrl)}" alt="Profile" />
          </div>

          <section class="sidebar-section">
            ${renderH2WithIcon(contactTitle, faAddressBook)}
            <div class="stack">
              ${contactEmail ? `<p>${escapeHtml(contactEmail)}</p>` : ''}
              ${contactLocation ? `<p>${escapeHtml(contactLocation)}</p>` : ''}
              ${renderLink(linkedinLabel, linkedinUrl)}
              ${renderLink(calendlyLabel, calendlyUrl)}
            </div>
          </section>

          <section class="sidebar-section">
            ${renderH2WithIcon(highlightsTitle, faStar)}
            ${renderList(highlightItems)}
          </section>

          ${renderEducation(education)}
        </aside>

        <main class="main">
          <header>
            ${name ? `<h1>${escapeHtml(name)}</h1>` : ''}
            ${subtitle ? `<p class="subtitle">${escapeHtml(subtitle)}</p>` : ''}
          </header>

          <section class="about">
            <h2>${escapeHtml(aboutTitle)}</h2>
            ${aboutContent ? `<p>${escapeHtml(aboutContent)}</p>` : ''}
          </section>

          ${renderSkillGroups(skills)}
          ${renderCertifications(certifications)}
        </main>

      </div>
      ${renderExperience(experience)}
    </body>
  </html>
  `;
}
