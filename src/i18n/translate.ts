import { dictionary } from './dictionary';

function getNestedValue(obj: any, path: string): string | undefined {
    return path.split('.').reduce((current, key) => {
        return current?.[key];
    }, obj);
}

export function t(key: string, lang: string = 'ru', params: Record<string, any> = {}): string {
    // Get the translation from dictionary
    let translation = getNestedValue(dictionary, `${lang}.${key}`) as string;

    // If translation not found, fallback to Russian
    if (!translation && lang !== 'ru') {
        translation = getNestedValue(dictionary, `ru.${key}`) as string;
    }

    // If still no translation, return the key
    if (!translation) {
        return key;
    }

    // Replace parameters in translation (replace all matches)
    return Object.entries(params).reduce((text, [param, value]) => {
        const regex = new RegExp(`\\{${param}\\}`, 'g'); // Match all occurrences of {param}
        return text.replace(regex, String(value));
    }, translation);
}