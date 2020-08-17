import i18n from 'i18next';
import {en} from '@dstackai/dstack-react/dist/locales';
import {initReactI18next} from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        resources: {en: {translation: en}},
        lng: 'en',
        fallbackLng: 'en',

        interpolation: {escapeValue: false},
    });

export default i18n;
