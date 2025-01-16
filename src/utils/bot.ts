/**
 * Checks if the given text is a bot command (starts with '/')
 * @param text The message text to check
 * @returns boolean indicating if the text is a bot command
 */
export function isBotCommand(text: string | undefined): boolean {
    return Boolean(text && text.startsWith('/'));
}