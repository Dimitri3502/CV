import dimitriPrintTemplateJson from './templates/dimitri-print-template.json';
import tatianaPrintTemplateJson from './templates/tatiana-print-template.json';
import type {NormalizedCvTemplate} from './cv-types';

export type TemplateDefinition = {
  id: string;
  filename: string;
  template: NormalizedCvTemplate;
};

export const templateDefinitions: readonly TemplateDefinition[] = [
  {
    id: 'dimitri-print-template',
    filename: 'dimitri-print-template.json',
    template: dimitriPrintTemplateJson as NormalizedCvTemplate,
  },
  {
    id: 'tatiana-print-template',
    filename: 'tatiana-print-template.json',
    template: tatianaPrintTemplateJson as NormalizedCvTemplate,
  },
];

export const templatesById = new Map<string, NormalizedCvTemplate>(
  templateDefinitions.map((definition) => [definition.id, definition.template]),
);

export function getTemplateDefinition(templateId: string) {
  return templateDefinitions.find((definition) => definition.id === templateId) ?? null;
}
