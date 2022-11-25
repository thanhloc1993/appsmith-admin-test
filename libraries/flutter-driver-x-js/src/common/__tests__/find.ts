import { WaitFor, WaitForAbsent, ByValueKey, ByText, ByTooltipMessage } from '../find';

describe('WaitFor', () => {
    it('Return Json String with command, finderType, keyValueType, keyValueString fields', () => {
        expect(new WaitFor(new ByValueKey('Test Key'), {}).flat).toEqual({
            command: 'waitFor',
            finderType: 'ByValueKey',
            keyValueType: 'String',
            keyValueString: 'Test Key',
            timeout: 5000,
        });
    });

    it('Return Json String with command, finderType, keyValueType, keyValueString, timeout fields', () => {
        expect(new WaitFor(new ByValueKey('Test Key'), { timeout: 123 }).flat).toEqual({
            timeout: 123,
            command: 'waitFor',
            finderType: 'ByValueKey',
            keyValueType: 'String',
            keyValueString: 'Test Key',
        });
    });

    it('Return Json String with command, finderType, text', () => {
        expect(new WaitFor(new ByText('Test Text'), {}).flat).toEqual({
            command: 'waitFor',
            finderType: 'ByText',
            text: 'Test Text',
            timeout: 5000,
        });
    });

    it('Return Json String with command, finderType, tooltip message', () => {
        expect(new WaitFor(new ByTooltipMessage('Test Tooltip Message'), {}).flat).toEqual({
            command: 'waitFor',
            finderType: 'ByTooltipMessage',
            text: 'Test Tooltip Message',
            timeout: 5000,
        });
    });
});

describe('WaitForAbsent', () => {
    it('Return Json String with command, finderType, keyValueType, keyValueString fields', () => {
        expect(new WaitForAbsent(new ByValueKey('Test Key'), {}).flat).toEqual({
            command: 'waitForAbsent',
            finderType: 'ByValueKey',
            keyValueType: 'String',
            keyValueString: 'Test Key',
            timeout: 5000,
        });
    });

    it('Return Json String with command, finderType, keyValueType, keyValueString, timeout fields', () => {
        expect(new WaitForAbsent(new ByValueKey('Test Key'), { timeout: 123 }).flat).toEqual({
            timeout: 123,
            command: 'waitForAbsent',
            finderType: 'ByValueKey',
            keyValueType: 'String',
            keyValueString: 'Test Key',
        });
    });

    it('Return Json String with command, finderType, text', () => {
        expect(new WaitForAbsent(new ByText('Test Text'), {}).flat).toEqual({
            command: 'waitForAbsent',
            finderType: 'ByText',
            text: 'Test Text',
            timeout: 5000,
        });
    });

    it('Return Json String with command, finderType, tooltip message', () => {
        expect(new WaitForAbsent(new ByTooltipMessage('Test Tooltip Message'), {}).flat).toEqual({
            command: 'waitForAbsent',
            finderType: 'ByTooltipMessage',
            text: 'Test Tooltip Message',
            timeout: 5000,
        });
    });
});
