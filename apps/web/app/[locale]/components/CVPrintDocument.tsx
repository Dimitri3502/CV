import type {CVData, CVTemplate} from '../cv-data';
import {ProfileCvPrintTemplate} from './ProfileCvPrintTemplate';

type CVPrintDocumentProps = {
  data: CVData;
  template: CVTemplate;
};

export function CVPrintDocument({data, template}: CVPrintDocumentProps) {
  return <ProfileCvPrintTemplate data={data} template={template} />;
}
