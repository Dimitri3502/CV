import {
  faAddressBook,
  faBrain,
  faBriefcase,
  faBullseye,
  faCalendarDays,
  faCertificate,
  faChartLine,
  faCircle,
  faDatabase,
  faEnvelope,
  faGears,
  faGlobe,
  faGraduationCap,
  faLink,
  faLaptopCode,
  faLocationDot,
  faPeopleGroup,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import {type IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import type {ReactNode} from 'react';
import type {
  CvExpertiseIconKey,
  CvSectionKey,
  CvTemplateZoneKey,
  NormalizedContactItem,
  NormalizedCvDocument,
} from '../cv-types';

type RenderProfileCvSectionArgs = {
  data: NormalizedCvDocument;
  photoUrl?: string;
  sectionKey: CvSectionKey;
  themeColor: string;
  zone: CvTemplateZoneKey;
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

type CardListSectionProps<Item> = SectionHeadingProps & {
  sectionKey: CvSectionKey;
  zone: CvTemplateZoneKey;
  items: readonly Item[];
  intro?: ReactNode;
  renderItem: (item: Item) => ReactNode;
};

const itemCardToneClassNames: Record<NonNullable<ItemCardProps['tone']>, string | null> = {
  default: null,
  strong: 'profile-cv-panel-strong',
  accent: 'profile-cv-panel-accent',
};

const expertiseIcons: IconDefinition[] = [faCircle, faCircle, faCircle, faCircle];
const expertiseIconByKey: Record<CvExpertiseIconKey, IconDefinition> = {
  'chart-line': faChartLine,
  globe: faGlobe,
  'people-group': faPeopleGroup,
  'laptop-code': faLaptopCode,
  brain: faBrain,
  database: faDatabase,
  gears: faGears,
  briefcase: faBriefcase,
  bullseye: faBullseye,
};
const contactIcons: Record<NormalizedContactItem['kind'], IconDefinition> = {
  email: faEnvelope,
  phone: faPhone,
  location: faLocationDot,
  linkedin: faLink,
  calendly: faCalendarDays,
  link: faLink,
};

function assertZone(sectionKey: CvSectionKey, zone: CvTemplateZoneKey, supportedZones: readonly CvTemplateZoneKey[]) {
  if (!supportedZones.includes(zone)) {
    throw new Error(`Section "${sectionKey}" cannot be rendered in zone "${zone}"`);
  }
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
  const cardClasses = ['profile-cv-panel', itemCardToneClassNames[tone], className].filter(Boolean).join(' ');
  return <article className={cardClasses}>{children}</article>;
}

function getMainSectionClassName(zone: CvTemplateZoneKey) {
  return zone === 'firstPage.right' ? 'cv-first-page-section' : undefined;
}

function renderAccentSubtitle(value: ReactNode, color: string) {
  return (
    <p className="profile-cv-entry-subtitle !m-0" style={{color}}>
      {value}
    </p>
  );
}

function resolveExpertiseGroupIcon(group: NonNullable<NormalizedCvDocument['expertise']>['groups'][number], index: number) {
  return (group.icon ? expertiseIconByKey[group.icon] : null) ?? expertiseIcons[index] ?? faCircle;
}

function renderCardListSection<Item>({
  sectionKey,
  zone,
  icon,
  title,
  color,
  items,
  intro,
  renderItem,
}: CardListSectionProps<Item>) {
  return (
    <MainSection key={sectionKey} className={getMainSectionClassName(zone)} icon={icon} title={title} color={color}>
      {intro}
      <div className="profile-cv-card-stack">{items.map(renderItem)}</div>
    </MainSection>
  );
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

function renderPhotoSection({data, photoUrl}: Pick<RenderProfileCvSectionArgs, 'data' | 'photoUrl'>) {
  if (!photoUrl) {
    return null;
  }

  return (
    <div key="photo" className="profile-cv-sidebar-photo flex justify-center">
      <img
        src={photoUrl}
        alt={data.header.name}
        className="aspect-square w-full max-w-[170px] rounded-full object-cover"
      />
    </div>
  );
}

function renderContactSection(data: NormalizedCvDocument) {
  if (!data.contact) {
    return null;
  }

  return (
    <section key="contact" className="w-full">
      <SidebarSectionHeading icon={faAddressBook} title={data.contact.title} />
      <div className="profile-cv-sidebar-list">
        {data.contact.items.map((item, index) => (
          <SidebarValue key={`${item.kind}-${index}`} item={item} />
        ))}
      </div>
    </section>
  );
}

function renderHeaderSection(data: NormalizedCvDocument, themeColor: string) {
  return (
    <header key="header" className="profile-cv-header">
      <h1>{data.header.name}</h1>
      <div className="profile-cv-subtitle">{data.header.subtitle}</div>
      <span className="profile-cv-header-rule" style={{backgroundColor: themeColor}} />
    </header>
  );
}

function renderProfileSection(data: NormalizedCvDocument, themeColor: string, zone: CvTemplateZoneKey) {
  if (!data.profile) {
    return null;
  }

  return (
    <MainSection
      key="profile"
      className={zone === 'firstPage.right' ? 'cv-first-page-section' : undefined}
      title={data.profile.title}
      color={themeColor}
    >
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
    </MainSection>
  );
}

function renderSidebarExpertise(data: NormalizedCvDocument) {
  if (!data.expertise) {
    return null;
  }

  return (
    <section key="expertise" className="w-full">
      <SidebarSectionHeading icon={faBullseye} title={data.expertise.title} />
      <div className="profile-cv-sidebar-groups">
        {data.expertise.groups.map((group, groupIndex) => {
          const iconDefinition = resolveExpertiseGroupIcon(group, groupIndex);

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
    </section>
  );
}

function renderMainExpertise(data: NormalizedCvDocument, themeColor: string, zone: CvTemplateZoneKey) {
  if (!data.expertise) {
    return null;
  }

  return (
    <MainSection
      key="expertise"
      className={zone === 'firstPage.right' ? 'cv-first-page-section' : undefined}
      icon={faBullseye}
      title={data.expertise.title}
      color={themeColor}
    >
      <div className="profile-cv-grid-two">
        {data.expertise.groups.map((group, groupIndex) => (
          <ItemCard key={group.title} tone="strong">
            <h3 className="cv-icon-row profile-cv-entry-title !m-0">
              <span className="cv-icon-cell">
                <span className="cv-icon-box">
                  <AccentIcon icon={resolveExpertiseGroupIcon(group, groupIndex)} color={themeColor} />
                </span>
              </span>
              <span className="cv-icon-label">{group.title}</span>
            </h3>
            <p className="profile-cv-detail !m-0">{group.items.join(' · ')}</p>
          </ItemCard>
        ))}
      </div>
    </MainSection>
  );
}

function renderLanguagesSection(data: NormalizedCvDocument, themeColor: string, zone: CvTemplateZoneKey) {
  if (!data.languages) {
    return null;
  }

  if (zone === 'firstPage.left') {
    return (
      <section key="languages" className="w-full">
        <SidebarSectionHeading icon={faGlobe} title={data.languages.title} />
        <ul className="profile-cv-sidebar-bullets">
          {data.languages.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <MainSection
      key="languages"
      className={zone === 'firstPage.right' ? 'cv-first-page-section' : undefined}
      icon={faGlobe}
      title={data.languages.title}
      color={themeColor}
    >
      <ItemCard tone="strong">
        <ul className="profile-cv-body-list">
          {data.languages.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ItemCard>
    </MainSection>
  );
}

function renderEducationSection(data: NormalizedCvDocument, themeColor: string, zone: CvTemplateZoneKey) {
  if (!data.education) {
    return null;
  }

  return renderCardListSection({
    sectionKey: 'education',
    zone,
    icon: faGraduationCap,
    title: data.education.title,
    color: themeColor,
    items: data.education.items,
    renderItem: (item) => (
      <ItemCard key={`${item.degree}-${item.institution}`} tone="accent">
        <EntryHeader title={item.degree} period={item.period} subtitle={renderAccentSubtitle(item.institution, themeColor)} />
        {item.details?.map((detail) => (
          <p key={detail} className="profile-cv-detail !m-0">
            {detail}
          </p>
        ))}
      </ItemCard>
    ),
  });
}

function renderCertificationsSection(data: NormalizedCvDocument, themeColor: string, zone: CvTemplateZoneKey) {
  if (!data.certifications) {
    return null;
  }

  return renderCardListSection({
    sectionKey: 'certifications',
    zone,
    icon: faCertificate,
    title: data.certifications.title,
    color: themeColor,
    items: data.certifications.items,
    renderItem: (item) => (
      <ItemCard key={item.name} tone="accent">
        <EntryHeader
          title={item.name}
          subtitle={item.issuerLine ? renderAccentSubtitle(item.issuerLine, themeColor) : undefined}
        />
      </ItemCard>
    ),
  });
}

function renderExperienceCard(
  item: NonNullable<NormalizedCvDocument['experience']>['items'][number],
  themeColor: string,
) {
  const organizationLine = `${item.organization}${item.location ? `, ${item.location}` : ''}`;

  return (
    <ItemCard key={`${item.role}-${item.organization}-${item.period ?? ''}`} tone="accent">
      <EntryHeader title={item.role} period={item.period} subtitle={renderAccentSubtitle(organizationLine, themeColor)} />
      {item.summary ? <p className="profile-cv-meta !m-0">{item.summary}</p> : null}
      {item.bullets?.length ? (
        <ul className="profile-cv-body-list">
          {item.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
    </ItemCard>
  );
}

function renderExperienceSection(data: NormalizedCvDocument, themeColor: string, zone: CvTemplateZoneKey) {
  if (!data.experience) {
    return null;
  }

  return renderCardListSection({
    sectionKey: 'experience',
    zone,
    icon: faBriefcase,
    title: data.experience.title,
    color: themeColor,
    items: data.experience.items,
    renderItem: (item) => renderExperienceCard(item, themeColor),
  });
}

function renderPublicationsSection(data: NormalizedCvDocument, themeColor: string, zone: CvTemplateZoneKey) {
  if (!data.publications) {
    return null;
  }

  return renderCardListSection({
    sectionKey: 'publications',
    zone,
    title: data.publications.title,
    color: themeColor,
    intro: data.publications.subtitle ? <p className="profile-cv-kicker !m-0">{data.publications.subtitle}</p> : null,
    items: data.publications.items,
    renderItem: (item) => (
      <ItemCard key={item.text} tone="accent">
        <p className="!m-0">{item.text}</p>
      </ItemCard>
    ),
  });
}

function renderInterventionsSection(data: NormalizedCvDocument, themeColor: string, zone: CvTemplateZoneKey) {
  if (!data.interventions) {
    return null;
  }

  return renderCardListSection({
    sectionKey: 'interventions',
    zone,
    title: data.interventions.title,
    color: themeColor,
    items: data.interventions.items,
    renderItem: (item) => (
      <ItemCard key={`${item.title}-${item.meta ?? ''}`} tone="accent">
        <EntryHeader title={item.title} subtitle={item.meta ? <p className="profile-cv-period-line !m-0">{item.meta}</p> : undefined} />
      </ItemCard>
    ),
  });
}

function renderEngagementsSection(data: NormalizedCvDocument, themeColor: string, zone: CvTemplateZoneKey) {
  if (!data.engagements) {
    return null;
  }

  return renderCardListSection({
    sectionKey: 'engagements',
    zone,
    title: data.engagements.title,
    color: themeColor,
    items: data.engagements.items,
    renderItem: (item) => (
      <ItemCard key={`${item.title}-${item.organization}-${item.period ?? ''}`} tone="accent">
        <EntryHeader title={item.title} period={item.period} subtitle={renderAccentSubtitle(item.organization, themeColor)} />
      </ItemCard>
    ),
  });
}

export function renderProfileCvSection({data, photoUrl, sectionKey, themeColor, zone}: RenderProfileCvSectionArgs) {
  switch (sectionKey) {
    case 'photo':
      assertZone(sectionKey, zone, ['firstPage.left']);
      return renderPhotoSection({data, photoUrl});
    case 'contact':
      assertZone(sectionKey, zone, ['firstPage.left']);
      return renderContactSection(data);
    case 'header':
      assertZone(sectionKey, zone, ['firstPage.right']);
      return renderHeaderSection(data, themeColor);
    case 'profile':
      assertZone(sectionKey, zone, ['firstPage.right', 'otherPages.main']);
      return renderProfileSection(data, themeColor, zone);
    case 'expertise':
      assertZone(sectionKey, zone, ['firstPage.left', 'firstPage.right', 'otherPages.main']);
      return zone === 'firstPage.left' ? renderSidebarExpertise(data) : renderMainExpertise(data, themeColor, zone);
    case 'languages':
      assertZone(sectionKey, zone, ['firstPage.left', 'firstPage.right', 'otherPages.main']);
      return renderLanguagesSection(data, themeColor, zone);
    case 'education':
      assertZone(sectionKey, zone, ['firstPage.right', 'otherPages.main']);
      return renderEducationSection(data, themeColor, zone);
    case 'certifications':
      assertZone(sectionKey, zone, ['firstPage.right', 'otherPages.main']);
      return renderCertificationsSection(data, themeColor, zone);
    case 'experience':
      assertZone(sectionKey, zone, ['firstPage.right', 'otherPages.main']);
      return renderExperienceSection(data, themeColor, zone);
    case 'publications':
      assertZone(sectionKey, zone, ['firstPage.right', 'otherPages.main']);
      return renderPublicationsSection(data, themeColor, zone);
    case 'interventions':
      assertZone(sectionKey, zone, ['firstPage.right', 'otherPages.main']);
      return renderInterventionsSection(data, themeColor, zone);
    case 'engagements':
      assertZone(sectionKey, zone, ['firstPage.right', 'otherPages.main']);
      return renderEngagementsSection(data, themeColor, zone);
  }
}
