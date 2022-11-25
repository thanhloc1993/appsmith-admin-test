import { EnterText } from '../text';

describe('EnterText', () => {
    it('Return Json String with command and text fields', () => {
        expect(new EnterText('Hello', {}).flat).toEqual({
            command: 'enter_text',
            text: 'Hello',
            timeout: 5000,
        });
    });

    it('Return Json String with command and text, timeout fields', () => {
        expect(new EnterText('Hello', { timeout: 123 }).flat).toEqual({
            timeout: 123,
            command: 'enter_text',
            text: 'Hello',
        });
    });
});
