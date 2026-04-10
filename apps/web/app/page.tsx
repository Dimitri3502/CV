import {redirect} from 'next/navigation';
import {DEFAULT_LOCALE} from '@cv/common';

export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
