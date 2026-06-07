import {NextResponse} from 'next/server';
import {normalizeTemplate} from '../../../[locale]/template-utils';
import {getTemplateDefinition} from '../../../[locale]/template-registry';
import {readTemplateById, writeTemplateById} from '../../../[locale]/template-storage.server';

type RouteContext = {
  params: Promise<{templateId: string}>;
};

export const runtime = 'nodejs';

export async function GET(_request: Request, context: RouteContext) {
  const {templateId} = await context.params;
  const definition = getTemplateDefinition(templateId);

  if (!definition) {
    return NextResponse.json({error: 'Template introuvable'}, {status: 404});
  }

  try {
    const template = await readTemplateById(templateId);
    return NextResponse.json({template});
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Impossible de lire le template';
    return NextResponse.json({error: message}, {status: 500});
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const {templateId} = await context.params;
  const definition = getTemplateDefinition(templateId);

  if (!definition) {
    return NextResponse.json({error: 'Template introuvable'}, {status: 404});
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({error: 'JSON invalide'}, {status: 400});
  }

  const rawTemplate =
    payload && typeof payload === 'object' && 'template' in payload
      ? (payload as {template?: unknown}).template
      : payload;

  let normalizedTemplate;

  try {
    normalizedTemplate = normalizeTemplate(rawTemplate, definition.template);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Template invalide';
    return NextResponse.json({error: message}, {status: 400});
  }

  if (normalizedTemplate.id !== templateId) {
    return NextResponse.json(
      {error: `Template id mismatch: expected "${templateId}", received "${normalizedTemplate.id}"`},
      {status: 400},
    );
  }

  try {
    const savedTemplate = await writeTemplateById(templateId, normalizedTemplate);
    return NextResponse.json({template: savedTemplate});
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Impossible d’écrire le template';
    return NextResponse.json({error: message}, {status: 500});
  }
}
