import {templateZoneKeys} from '../template-utils';
import type {CvTemplateZoneKey, NormalizedCvDocument, NormalizedCvTemplate} from '../cv-types';
import {renderProfileCvSection} from './profile-cv-sections';
import {
  buildProfileCvThemeStyles,
  resolveZoneConfig,
  resolveZoneOverflowClass,
  validateTemplateSections,
} from './profile-cv-theme';

type ProfileCvPrintTemplateProps = {
  data: NormalizedCvDocument;
  template: NormalizedCvTemplate;
};

function renderZoneSections(data: NormalizedCvDocument, template: NormalizedCvTemplate, themeColor: string, zone: CvTemplateZoneKey) {
  const photoUrl = data.contact?.photoUrl?.trim();

  return resolveZoneConfig(template, zone)
    .sections.map((sectionKey) => renderProfileCvSection({data, photoUrl, sectionKey, themeColor, zone}))
    .filter(Boolean);
}

export function ProfileCvPrintTemplate({data, template}: ProfileCvPrintTemplateProps) {
  const {themeColor, themeStyles} = buildProfileCvThemeStyles(template);
  const [leftZoneKey, rightZoneKey, otherZoneKey] = templateZoneKeys;
  const leftZone = resolveZoneConfig(template, leftZoneKey);
  const rightZone = resolveZoneConfig(template, rightZoneKey);
  const otherZone = resolveZoneConfig(template, otherZoneKey);

  validateTemplateSections(template);

  const leftSections = renderZoneSections(data, template, themeColor, leftZoneKey);
  const rightSections = renderZoneSections(data, template, themeColor, rightZoneKey);
  const otherSections = renderZoneSections(data, template, themeColor, otherZoneKey);

  return (
    <div style={themeStyles} className="cv-root is-print-mode min-h-screen py-0">
      <div className="cv-sheet profile-cv-print-sheet bg-white">
        <aside className={`cv-sidebar profile-cv-sidebar bg-[var(--color-bg-dark)] ${resolveZoneOverflowClass(leftZone.overflow)}`}>
          <div className="profile-cv-sidebar-stack">{leftSections}</div>
        </aside>

        <main className={`cv-main profile-cv-main profile-cv-print-flow overflow-wrap-anywhere ${resolveZoneOverflowClass(rightZone.overflow)}`}>
          {rightSections.length ? <div className="profile-cv-main-stack profile-cv-main-stack-no-top">{rightSections}</div> : null}
        </main>
      </div>

      {otherSections.length ? (
        <section className={`profile-cv-print-follow-up overflow-wrap-anywhere ${resolveZoneOverflowClass(otherZone.overflow)}`}>
          <div className="profile-cv-main-stack">{otherSections}</div>
        </section>
      ) : null}
    </div>
  );
}
