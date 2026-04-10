import {Injectable} from '@nestjs/common';
import {DEFAULT_LOCALE, SUPPORTED_LOCALES} from '@cv/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: '@cv/api',
      defaultLocale: DEFAULT_LOCALE,
      supportedLocales: SUPPORTED_LOCALES,
    };
  }
}
