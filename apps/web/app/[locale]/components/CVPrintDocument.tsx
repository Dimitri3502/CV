import {isPolicyCvData, type CVData} from '../cv-data';
import {CVPrintTemplate} from './CVPrintTemplate';
import {PolicyCvPrintTemplate} from './PolicyCvPrintTemplate';

type CVPrintDocumentProps = {
  data: CVData;
};

export function CVPrintDocument({data}: CVPrintDocumentProps) {
  if (isPolicyCvData(data)) {
    return <PolicyCvPrintTemplate data={data} />;
  }

  return <CVPrintTemplate messages={data} />;
}
