import {
  faAddressBook,
  faBriefcase,
  faBullseye,
  faCalendarDays,
  faCertificate,
  faCircle,
  faEnvelope,
  faGlobe,
  faGraduationCap,
  faLink,
  faLocationDot,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import {type IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {resolveCvTheme} from '@cv/common';
import type {CSSProperties, ReactNode} from 'react';
import type {NormalizedContactItem, NormalizedCvDocument} from '../cv-types';

type ProfileCvPrintTemplateProps = {
  data: NormalizedCvDocument;
};

type SectionHeadingProps = {
  title: string;
  color: string;
  icon?: IconDefinition;
};

type MainSectionProps = SectionHeadingProps & {
  className?: string;
  children: ReactNode;
};

type EntryHeaderProps = {
  title: string;
  subtitle?: ReactNode;
  period?: string;
};

type ItemCardProps = {
  children: ReactNode;
  tone?: 'default' | 'strong' | 'accent';
  className?: string;
};

type RgbColor = {
  r: number;
  g: number;
  b: number;
};

const expertiseIcons: IconDefinition[] = [faCircle, faCircle, faCircle, faCircle];
const contactIcons: Record<NormalizedContactItem['kind'], IconDefinition> = {
  email: faEnvelope,
  phone: faPhone,
  location: faLocationDot,
  linkedin: faLink,
  calendly: faCalendarDays,
  link: faLink,
};

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function parseHexColor(value: string): RgbColor | null {
  const normalizedValue = value.trim().replace(/^#/, '');

  if (/^[0-9a-fA-F]{3}$/.test(normalizedValue)) {
    return {
      r: Number.parseInt(`${normalizedValue[0]}${normalizedValue[0]}`, 16),
      g: Number.parseInt(`${normalizedValue[1]}${normalizedValue[1]}`, 16),
      b: Number.parseInt(`${normalizedValue[2]}${normalizedValue[2]}`, 16),
    };
  }

  if (/^[0-9a-fA-F]{6}$/.test(normalizedValue)) {
    return {
      r: Number.parseInt(normalizedValue.slice(0, 2), 16),
      g: Number.parseInt(normalizedValue.slice(2, 4), 16),
      b: Number.parseInt(normalizedValue.slice(4, 6), 16),
    };
  }

  return null;
}

function parseRgbColor(value: string): (RgbColor & {a: number}) | null {
  const match = value
    .trim()
    .match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);

  if (!match) {
    return null;
  }

  return {
    r: clampChannel(Number.parseFloat(match[1])),
    g: clampChannel(Number.parseFloat(match[2])),
    b: clampChannel(Number.parseFloat(match[3])),
    a: match[4] ? Math.max(0, Math.min(1, Number.parseFloat(match[4]))) : 1,
  };
}

function toOpaqueColor(foreground: string, background: string): string {
  const foregroundHex = parseHexColor(foreground);
  const foregroundRgb = parseRgbColor(foreground);
  const backgroundHex = parseHexColor(background);
  const backgroundRgb = parseRgbColor(background);

  if (foregroundHex && backgroundHex) {
    return `rgb(${foregroundHex.r}, ${foregroundHex.g}, ${foregroundHex.b})`;
  }

  if (foregroundRgb && backgroundHex) {
    const alpha = foregroundRgb.a;
    const r = clampChannel(foregroundRgb.r * alpha + backgroundHex.r * (1 - alpha));
    const g = clampChannel(foregroundRgb.g * alpha + backgroundHex.g * (1 - alpha));
    const b = clampChannel(foregroundRgb.b * alpha + backgroundHex.b * (1 - alpha));
    return `rgb(${r}, ${g}, ${b})`;
  }

  if (foregroundHex && backgroundRgb) {
    return `rgb(${foregroundHex.r}, ${foregroundHex.g}, ${foregroundHex.b})`;
  }

  return foreground;
}

function SidebarIcon({icon}: {icon: IconDefinition}) {
  return <FontAwesomeIcon icon={icon} className="h-[12px] w-[12px]" fixedWidth style={{color: '#FFFFFF'}} />;
}

function AccentIcon({icon, color}: {icon: IconDefinition; color: string}) {
  return <FontAwesomeIcon icon={icon} className="h-[12px] w-[12px]" fixedWidth style={{color}} />;
}

function SidebarSectionHeading({icon, title}: {icon: IconDefinition; title: string}) {
  return (
    <h2 className="cv-icon-row profile-cv-sidebar-title" style={{color: '#FFFFFF'}}>
      <span className="cv-icon-cell">
        <span className="cv-icon-box">
          <SidebarIcon icon={icon} />
        </span>
      </span>
      <span className="cv-icon-label">{title}</span>
    </h2>
  );
}

function SectionHeading({icon, title, color}: SectionHeadingProps) {
  return (
    <div className="profile-cv-section-heading">
      <h2 className="cv-icon-row !m-0" style={{color}}>
        {icon ? (
          <span className="cv-icon-cell">
            <span className="cv-icon-box">
              <AccentIcon icon={icon} color={color} />
            </span>
          </span>
        ) : null}
        <span className="cv-icon-label">{title}</span>
      </h2>
      <span className="profile-cv-section-rule" style={{backgroundColor: color}} />
    </div>
  );
}

function MainSection({icon, title, color, className, children}: MainSectionProps) {
  return (
    <section className={className}>
      <SectionHeading icon={icon} title={title} color={color} />
      <div className="profile-cv-section-body">{children}</div>
    </section>
  );
}

function PeriodBadge({value}: {value?: string}) {
  if (!value) {
    return null;
  }

  return <span className="profile-cv-period">{value}</span>;
}

function EntryHeader({title, subtitle, period}: EntryHeaderProps) {
  return (
    <div className="profile-cv-item-header">
      <div className="profile-cv-item-copy">
        <h3 className="profile-cv-entry-title">{title}</h3>
        {subtitle ? subtitle : null}
      </div>
      <PeriodBadge value={period} />
    </div>
  );
}

function ItemCard({children, tone = 'default', className}: ItemCardProps) {
  const cardClasses = ['profile-cv-panel'];

  if (tone === 'strong') {
    cardClasses.push('profile-cv-panel-strong');
  }

  if (tone === 'accent') {
    cardClasses.push('profile-cv-panel-accent');
  }

  if (className) {
    cardClasses.push(className);
  }

  return <article className={cardClasses.join(' ')}>{children}</article>;
}

function SidebarValue({item}: {item: NormalizedContactItem}) {
  const icon = contactIcons[item.kind];
  const content =
    'url' in item ? (
      <a href={item.url} className="hover:underline">
        {item.value}
      </a>
    ) : (
      item.value
    );

  return (
    <div className="cv-icon-row profile-cv-sidebar-row" style={{color: '#FFFFFF'}}>
      <span className="cv-icon-cell">
        <span className="cv-icon-box">
          <SidebarIcon icon={icon} />
        </span>
      </span>
      <span className="cv-icon-label overflow-wrap-anywhere">{content}</span>
    </div>
  );
}

export function ProfileCvPrintTemplate({data}: ProfileCvPrintTemplateProps) {
  const theme = resolveCvTheme(data.meta.themeColor);
  const themeColor = theme.themeColor;
  const photoUrl = data.contact?.photoUrl?.trim();
  const contactItemCount = data.contact?.items.length ?? 0;
  const expertiseItemCount = data.expertise?.groups.reduce((count, group) => count + group.items.length, 0) ?? 0;
  const expertiseGroupCount = data.expertise?.groups.length ?? 0;
  const languageItemCount = data.languages?.items.length ?? 0;
  const sidebarDensityScore =
    (photoUrl ? 12 : 0) +
    contactItemCount * 2 +
    expertiseItemCount +
    expertiseGroupCount +
    languageItemCount * 2;
  const shouldMoveExpertiseToMain = Boolean(photoUrl) && sidebarDensityScore >= 40;
  const themeStyles = {
    '--color-bg-light': theme.pageBg,
    '--color-bg-dark': theme.sidebarBg,
    '--color-text-light': '#F0F0F0',
    '--color-text-accent': themeColor,
    '--color-highlight': '#FFFFFF',
    '--cv-muted': theme.mutedText,
    '--cv-sidebar-kicker': toOpaqueColor(theme.sidebarKicker, theme.sidebarBg),
    '--cv-sidebar-divider': toOpaqueColor(theme.sidebarDivider, theme.sidebarBg),
    '--cv-tag-bg': toOpaqueColor(theme.tagBg, theme.sidebarBg),
    '--cv-tag-border': toOpaqueColor(theme.tagBorder, theme.sidebarBg),
    '--cv-tag-text': theme.tagText,
    '--cv-card-bg': toOpaqueColor(theme.cardBg, theme.pageBg),
    '--cv-card-bg-strong': toOpaqueColor(theme.cardBgStrong, theme.pageBg),
    '--cv-card-border': toOpaqueColor(theme.cardBorder, theme.pageBg),
    '--cv-accent-soft': toOpaqueColor(theme.cardBgStrong, theme.pageBg),
  } as CSSProperties;

  const sidebarBlocks: ReactNode[] = [];

  if (photoUrl) {
    sidebarBlocks.push(
      <div key="photo" className="profile-cv-sidebar-photo flex justify-center">
        <img
          src={photoUrl}
          alt={data.header.name}
          className="aspect-square w-full max-w-[170px] rounded-full object-cover"
        />
      </div>,
    );
  }

  if (data.contact) {
    sidebarBlocks.push(
      <section key="contact" className="w-full">
        <SidebarSectionHeading icon={faAddressBook} title={data.contact.title} />
        <div className="profile-cv-sidebar-list">
          {data.contact.items.map((item, index) => (
            <SidebarValue key={`${item.kind}-${index}`} item={item} />
          ))}
        </div>
      </section>,
    );
  }

  if (data.expertise && !shouldMoveExpertiseToMain) {
    sidebarBlocks.push(
      <section key="expertise" className="w-full">
        <SidebarSectionHeading icon={faBullseye} title={data.expertise.title} />
        <div className="profile-cv-sidebar-groups">
          {data.expertise.groups.map((group, groupIndex) => {
            const iconDefinition = expertiseIcons[groupIndex] ?? faCircle;

            return (
              <div key={group.title} className="profile-cv-sidebar-group">
                <h3 className="cv-icon-row profile-cv-sidebar-group-title" style={{color: '#FFFFFF'}}>
                  <span className="cv-icon-cell">
                    <span className="cv-icon-box">
                      <SidebarIcon icon={iconDefinition} />
                    </span>
                  </span>
                  <span className="cv-icon-label">{group.title}</span>
                </h3>
                <div className="profile-cv-tag-list">
                  {group.items.map((item) => (
                    <span key={item} className="profile-cv-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>,
    );
  }

  if (data.languages) {
    sidebarBlocks.push(
      <section key="languages" className="w-full">
        <SidebarSectionHeading icon={faGlobe} title={data.languages.title} />
        <ul className="profile-cv-sidebar-bullets">
          {data.languages.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>,
    );
  }

  const firstPageSections: ReactNode[] = [];

  if (data.profile) {
    firstPageSections.push(
      <MainSection key="profile" className="cv-first-page-section" title={data.profile.title} color={themeColor}>
        <ItemCard tone="strong">
          {data.profile.content ? <p className="profile-cv-lead !m-0">{data.profile.content}</p> : null}
          {data.profile.highlights?.length ? (
            <ul className="profile-cv-highlight-list">
              {data.profile.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </ItemCard>
      </MainSection>,
    );
  }

  if (data.education) {
    firstPageSections.push(
      <MainSection
        key="education"
        className="cv-first-page-section"
        icon={faGraduationCap}
        title={data.education.title}
        color={themeColor}
      >
        <div className="profile-cv-card-stack">
          {data.education.items.map((item) => (
            <ItemCard key={`${item.degree}-${item.institution}`} tone="strong">
              <EntryHeader
                title={item.degree}
                period={item.period}
                subtitle={<p className="profile-cv-meta !m-0">{item.institution}</p>}
              />
              {item.details?.map((detail) => (
                <p key={detail} className="profile-cv-detail !m-0">
                  {detail}
                </p>
              ))}
            </ItemCard>
          ))}
        </div>
      </MainSection>,
    );
  }

  const followUpSections: ReactNode[] = [];

  if (data.expertise && shouldMoveExpertiseToMain) {
    followUpSections.push(
      <MainSection key="expertise" icon={faBullseye} title={data.expertise.title} color={themeColor}>
        <div className="profile-cv-grid-two">
          {data.expertise.groups.map((group) => (
            <ItemCard key={group.title} tone="strong">
              <h3 className="profile-cv-entry-title">{group.title}</h3>
              <p className="profile-cv-detail !m-0">{group.items.join(' · ')}</p>
            </ItemCard>
          ))}
        </div>
      </MainSection>,
    );
  }

  if (data.certifications) {
    followUpSections.push(
      <MainSection key="certifications" icon={faCertificate} title={data.certifications.title} color={themeColor}>
        <div className="profile-cv-card-stack">
          {data.certifications.items.map((item) => (
            <ItemCard key={item.name}>
              <EntryHeader
                title={item.name}
                subtitle={item.issuerLine ? <p className="profile-cv-meta !m-0">{item.issuerLine}</p> : undefined}
              />
            </ItemCard>
          ))}
        </div>
      </MainSection>,
    );
  }

  if (data.experience) {
    followUpSections.push(
      <MainSection key="experience" icon={faBriefcase} title={data.experience.title} color={themeColor}>
        <div className="profile-cv-experience-list">
          {data.experience.items.map((item) => (
            <ItemCard key={`${item.role}-${item.organization}-${item.period ?? ''}`} tone="accent">
              <EntryHeader
                title={item.role}
                period={item.period}
                subtitle={
                  <p className="profile-cv-entry-subtitle !m-0" style={{color: themeColor}}>
                    {item.organization}
                    {item.location ? `, ${item.location}` : ''}
                  </p>
                }
              />
              {item.summary ? <p className="profile-cv-meta !m-0">{item.summary}</p> : null}
              {item.bullets?.length ? (
                <ul className="profile-cv-body-list">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </ItemCard>
          ))}
        </div>
      </MainSection>,
    );
  }

  if (data.publications) {
    followUpSections.push(
      <MainSection key="publications" title={data.publications.title} color={themeColor}>
        {data.publications.subtitle ? <p className="profile-cv-kicker !m-0">{data.publications.subtitle}</p> : null}
        <div className="profile-cv-card-stack">
          {data.publications.items.map((item) => (
            <ItemCard key={item.text}>
              <p className="!m-0">{item.text}</p>
            </ItemCard>
          ))}
        </div>
      </MainSection>,
    );
  }

  if (data.interventions) {
    followUpSections.push(
      <MainSection key="interventions" title={data.interventions.title} color={themeColor}>
        <div className="profile-cv-grid-two">
          {data.interventions.items.map((item) => (
            <ItemCard key={`${item.title}-${item.meta ?? ''}`} tone="strong">
              <EntryHeader
                title={item.title}
                subtitle={item.meta ? <p className="profile-cv-period-line !m-0">{item.meta}</p> : undefined}
              />
            </ItemCard>
          ))}
        </div>
      </MainSection>,
    );
  }

  if (data.engagements) {
    followUpSections.push(
      <MainSection key="engagements" title={data.engagements.title} color={themeColor}>
        <div className="profile-cv-grid-two">
          {data.engagements.items.map((item) => (
            <ItemCard key={`${item.title}-${item.organization}-${item.period ?? ''}`}>
              <EntryHeader
                title={item.title}
                period={item.period}
                subtitle={<p className="profile-cv-detail !m-0">{item.organization}</p>}
              />
            </ItemCard>
          ))}
        </div>
      </MainSection>,
    );
  }

  return (
    <div
      style={themeStyles}
      className={`cv-root is-print-mode min-h-screen py-0${shouldMoveExpertiseToMain ? ' profile-cv-dense-sidebar' : ''}`}
    >
      <div className="cv-sheet profile-cv-print-sheet bg-white">
        <aside className="cv-sidebar profile-cv-sidebar bg-[var(--color-bg-dark)]">
          <div className="profile-cv-sidebar-stack">{sidebarBlocks}</div>
        </aside>

        <main className="cv-main profile-cv-main profile-cv-print-flow overflow-wrap-anywhere">
          <header className="profile-cv-header">
            <h1>{data.header.name}</h1>
            <div className="profile-cv-subtitle">{data.header.subtitle}</div>
            <span className="profile-cv-header-rule" style={{backgroundColor: themeColor}} />
          </header>

          {firstPageSections.length ? <div className="profile-cv-main-stack">{firstPageSections}</div> : null}
        </main>
      </div>

      {followUpSections.length ? (
        <section className="profile-cv-print-follow-up overflow-wrap-anywhere">
          <div className="profile-cv-main-stack">{followUpSections}</div>
        </section>
      ) : null}
    </div>
  );
}
