import type {CVData} from '../cv-data';
import {ProfileCvPrintTemplate} from './ProfileCvPrintTemplate';

type CVPrintDocumentProps = {
  data: CVData;
};

export function CVPrintDocument({data}: CVPrintDocumentProps) {
  return <ProfileCvPrintTemplate data={data} />;
}
