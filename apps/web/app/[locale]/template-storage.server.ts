import 'server-only';

import {readFile, rename, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import type {NormalizedCvTemplate} from './cv-types';
import {normalizeTemplate} from './template-utils';
import {getTemplateDefinition} from './template-registry';

const templatesDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'templates');

function resolveTemplateFilePath(templateId: string) {
  const definition = getTemplateDefinition(templateId);

  if (!definition) {
    throw new Error(`Template not available for ${templateId}`);
  }

  return {
    definition,
    filePath: path.join(templatesDirectory, definition.filename),
  };
}

export async function readTemplateById(templateId: string): Promise<NormalizedCvTemplate> {
  const {definition, filePath} = resolveTemplateFilePath(templateId);
  const rawTemplate = await readFile(filePath, 'utf8');
  const parsedTemplate = JSON.parse(rawTemplate) as unknown;
  return normalizeTemplate(parsedTemplate, definition.template);
}

export async function writeTemplateById(
  templateId: string,
  template: NormalizedCvTemplate,
): Promise<NormalizedCvTemplate> {
  const {definition, filePath} = resolveTemplateFilePath(templateId);
  const normalizedTemplate = normalizeTemplate(template, definition.template);

  if (normalizedTemplate.id !== templateId) {
    throw new Error(`Template id mismatch: expected "${templateId}", received "${normalizedTemplate.id}"`);
  }

  const nextFileContents = `${JSON.stringify(normalizedTemplate, null, 2)}\n`;
  const tempFilePath = `${filePath}.tmp`;

  await writeFile(tempFilePath, nextFileContents, 'utf8');
  await rename(tempFilePath, filePath);

  return normalizedTemplate;
}
