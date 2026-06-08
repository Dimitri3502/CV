import {
  faAddressBook,
  faBrain,
  faBriefcase,
  faBullseye,
  faCalendarDays,
  faCertificate,
  faChartLine,
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
  CvIconKey,
  CvSectionKey,
  CvSectionRenderVariant,
  CvTemplateZoneKey,
  NormalizedContactItem,
  NormalizedCvDocument,
  NormalizedCvSimpleEntrySection,
} from '../cv-types';

type RenderProfileCvSectionArgs = {
  data: NormalizedCvDocument;
  photoUrl?: string;
  sectionKey: CvSectionKey;
  themeColor: string;
  variant?: CvSectionRenderVariant;
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

type CompactEntryProps = {
  title: string;
  subtitle?: ReactNode;
  period?: string;
};

type CardListSectionProps<Item> = SectionHeadingProps & {
  sectionKey: CvSectionKey;
  zone: CvTemplateZoneKey;
  items: readonly Item[];
  intro?: ReactNode;
  renderItem: (item: Item) => ReactNode;
};

type CompactListSectionProps<Item> = SectionHeadingProps & {
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

const cvIconByKey: Record<CvIconKey, IconDefinition> = {
  'address-book': faAddressBook,
  'chart-line': faChartLine,
  'calendar-days': faCalendarDays,
  certificate: faCertificate,
  envelope: faEnvelope,
  globe: faGlobe,
  'graduation-cap': faGraduationCap,
  link: faLink,
  'people-group': faPeopleGroup,
  'laptop-code': faLaptopCode,
  'location-dot': faLocationDot,
  phone: faPhone,
  brain: faBrain,
  database: faDatabase,
  gears: faGears,
  briefcase: faBriefcase,
  bullseye: faBullseye,
};

function assertZone(sectionKey: CvSectionKey, zone: CvTemplateZoneKey, supportedZones: readonly CvTemplateZoneKey[]) {
  if (!supportedZones.includes(zone)) {
    throw new Error(`Section "${sectionKey}" cannot be rendered in zone "${zone}"`);
  }
}

function resolveIcon(iconKey?: CvIconKey) {
  return iconKey ? cvIconByKey[iconKey] : undefined;
}

function SidebarIcon({icon}: {icon: IconDefinition}) {
  return <FontAwesomeIcon icon={icon} className="h-[12px] w-[12px]" fixedWidth style={{color: '#FFFFFF'}} />;
}

function AccentIcon({icon, color}: {icon: IconDefinition; color: string}) {
  return <FontAwesomeIcon icon={icon} className="h-[12px] w-[12px]" fixedWidth style={{color}} />;
}

function SidebarSectionHeading({icon, title}: {icon?: IconDefinition; title: string}) {
  return (
    <h2 className="cv-icon-row profile-cv-sidebar-title" style={{color: '#FFFFFF'}}>
      {icon ? (
        <span className="cv-icon-cell">
          <span className="cv-icon-box">
            <SidebarIcon icon={icon} />
          </span>
        </span>
      ) : null}
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

function CompactEntry({title, subtitle, period}: CompactEntryProps) {
  return (
    <article className="profile-cv-compact-item">
      <EntryHeader title={title} subtitle={subtitle} period={period} />
    </article>
  );
}

function getMainSectionClassName(zone: CvTemplateZoneKey) {
  return zone === 'firstPage.right' ? 'cv-first-page-section' : undefined;
}

function isCompactVariant(variant?: CvSectionRenderVariant) {
  return variant === 'compact';
}

function renderAccentSubtitle(value: ReactNode, color: string) {
  return (
    <p className="profile-cv-entry-subtitle !m-0" style={{color}}>
      {value}
    </p>
  );
}

function resolveExpertiseGroupIcon(group: NonNullable<NormalizedCvDocument['expertise']>['groups'][number]) {
  return resolveIcon(group.icon);
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

function renderCompactListSection<Item>({
  sectionKey,
  zone,
  icon,
  title,
  color,
  items,
  intro,
  renderItem,
}: CompactListSectionProps<Item>) {
  return (
    <MainSection key={sectionKey} className={getMainSectionClassName(zone)} icon={icon} title={title} color={color}>
      {intro}
      <div className="profile-cv-compact-list">{items.map(renderItem)}</div>
    </MainSection>
  );
}

function renderSimpleEntrySection(
  sectionKey: 'certifications' | 'publications' | 'interventions' | 'engagements',
  section: NormalizedCvSimpleEntrySection | undefined,
  themeColor: string,
  zone: CvTemplateZoneKey,
  variant?: CvSectionRenderVariant,
) {
  if (!section) {
    return null;
  }

  const intro = section.subtitle ? <p className="profile-cv-kicker !m-0">{section.subtitle}</p> : null;
  const renderItem = (item: NormalizedCvSimpleEntrySection['items'][number]) => {
    const subtitle = item.subtitle ? renderAccentSubtitle(item.subtitle, themeColor) : undefined;
    return isCompactVariant(variant) ? (
      <CompactEntry key={`${item.title}-${item.subtitle ?? ''}-${item.period ?? ''}`} title={item.title} subtitle={subtitle} period={item.period} />
    ) : (
      <ItemCard key={`${item.title}-${item.subtitle ?? ''}-${item.period ?? ''}`} tone="accent">
        <EntryHeader title={item.title} subtitle={subtitle} period={item.period} />
      </ItemCard>
    );
  };

  if (isCompactVariant(variant)) {
    return renderCompactListSection({
      sectionKey,
      zone,
      icon: resolveIcon(section.icon),
      title: section.title,
      color: themeColor,
      intro,
      items: section.items,
      renderItem,
    });
  }

  return renderCardListSection({
    sectionKey,
    zone,
    icon: resolveIcon(section.icon),
    title: section.title,
    color: themeColor,
    intro,
    items: section.items,
    renderItem,
  });
}

function SidebarValue({item}: {item: NormalizedContactItem}) {
  const icon = resolveIcon(item.icon);
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
      {icon ? (
        <span className="cv-icon-cell">
          <span className="cv-icon-box">
            <SidebarIcon icon={icon} />
          </span>
        </span>
      ) : null}
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
      <SidebarSectionHeading icon={resolveIcon(data.contact.icon)} title={data.contact.title} />
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
      <SidebarSectionHeading icon={resolveIcon(data.expertise.icon)} title={data.expertise.title} />
      <div className="profile-cv-sidebar-groups">
        {data.expertise.groups.map((group) => {
          const iconDefinition = resolveExpertiseGroupIcon(group);

          return (
            <div key={group.title} className="profile-cv-sidebar-group">
              <h3 className="cv-icon-row profile-cv-sidebar-group-title" style={{color: '#FFFFFF'}}>
                {iconDefinition ? (
                  <span className="cv-icon-cell">
                    <span className="cv-icon-box">
                      <SidebarIcon icon={iconDefinition} />
                    </span>
                  </span>
                ) : null}
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
      icon={resolveIcon(data.expertise.icon)}
      title={data.expertise.title}
      color={themeColor}
    >
      <div className="profile-cv-grid-two">
        {data.expertise.groups.map((group) => (
          <ItemCard key={group.title} tone="strong">
            <h3 className="cv-icon-row profile-cv-entry-title !m-0">
              {resolveExpertiseGroupIcon(group) ? (
                <span className="cv-icon-cell">
                  <span className="cv-icon-box">
                    <AccentIcon icon={resolveExpertiseGroupIcon(group)!} color={themeColor} />
                  </span>
                </span>
              ) : null}
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
        <SidebarSectionHeading icon={resolveIcon(data.languages.icon)} title={data.languages.title} />
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
      icon={resolveIcon(data.languages.icon)}
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
    icon: resolveIcon(data.education.icon),
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
    icon: resolveIcon(data.experience.icon),
    title: data.experience.title,
    color: themeColor,
    items: data.experience.items,
    renderItem: (item) => renderExperienceCard(item, themeColor),
  });
}

export function renderProfileCvSection({data, photoUrl, sectionKey, themeColor, variant, zone}: RenderProfileCvSectionArgs) {
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
      return renderSimpleEntrySection(sectionKey, data.certifications, themeColor, zone, variant);
    case 'experience':
      assertZone(sectionKey, zone, ['firstPage.right', 'otherPages.main']);
      return renderExperienceSection(data, themeColor, zone);
    case 'publications':
      assertZone(sectionKey, zone, ['firstPage.right', 'otherPages.main']);
      return renderSimpleEntrySection(sectionKey, data.publications, themeColor, zone, variant);
    case 'interventions':
      assertZone(sectionKey, zone, ['firstPage.right', 'otherPages.main']);
      return renderSimpleEntrySection(sectionKey, data.interventions, themeColor, zone, variant);
    case 'engagements':
      assertZone(sectionKey, zone, ['firstPage.right', 'otherPages.main']);
      return renderSimpleEntrySection(sectionKey, data.engagements, themeColor, zone, variant);
  }
}
