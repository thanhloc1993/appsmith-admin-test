import { monotonicFactory } from 'ulid';

const ulid = monotonicFactory();
export const genId = () => ulid(Date.now());

export function getSearchString(text: string | null | undefined) {
    if (!text) return undefined;
    return `%${text}%`;
}
