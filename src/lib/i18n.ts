import { register, init, getLocaleFromNavigator, locale } from 'svelte-i18n';

register('en', () => import('./locales/en'));
register('zh', () => import('./locales/zh'));

const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('locale') : null;
const browserLocale = getLocaleFromNavigator();
const initial = saved || (browserLocale?.startsWith('zh') ? 'zh' : 'en');

init({
	fallbackLocale: 'en',
	initialLocale: initial,
	handleMissingMessage: ({ id }) => id
});

export function setLanguage(lang: string) {
	locale.set(lang);
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('locale', lang);
	}
}
