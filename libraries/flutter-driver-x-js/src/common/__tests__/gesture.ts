import { ByValueKey } from '../find';
import { Tap, Scroll, ScrollIntoView } from '../gesture';

describe('Tap', () => {
    it('Return Json String with command, finderType, keyValueType and keyValueString fields', () => {
        expect(new Tap(new ByValueKey('Test Key'), {}).flat).toEqual({
            command: 'tap',
            finderType: 'ByValueKey',
            keyValueType: 'String',
            keyValueString: 'Test Key',
            timeout: 5000,
        });
    });

    it('Return Json String with command, finderType, keyValueType, keyValueString and timeout fields', () => {
        expect(new Tap(new ByValueKey('Test Key'), { timeout: 123 }).flat).toEqual({
            timeout: 123,
            command: 'tap',
            finderType: 'ByValueKey',
            keyValueType: 'String',
            keyValueString: 'Test Key',
        });
    });
});

describe('Scroll', () => {
    it('Return Json String with command and text fields', () => {
        expect(new Scroll(new ByValueKey('Test Key'), 1, 2, 123, 60, {}).flat).toEqual({
            command: 'scroll',
            dx: 1,
            dy: 2,
            duration: 123000,
            frequency: 60,
            finderType: 'ByValueKey',
            keyValueType: 'String',
            keyValueString: 'Test Key',
            timeout: 5000,
        });
    });

    it('Return Json String with command and text, timeout fields', () => {
        expect(
            new Scroll(new ByValueKey('Test Key'), 1, 2, 123, 60, { timeout: 123 }).flat
        ).toEqual({
            timeout: 123,
            command: 'scroll',
            dx: 1,
            dy: 2,
            duration: 123000,
            frequency: 60,
            finderType: 'ByValueKey',
            keyValueType: 'String',
            keyValueString: 'Test Key',
        });
    });
});

describe('ScrollIntoView', () => {
    it('Return Json String with command, alignment, finderType, keyValueType and keyValueString fields', () => {
        expect(new ScrollIntoView(new ByValueKey('Test Key'), {}).flat).toEqual({
            command: 'scrollIntoView',
            alignment: 0.0,
            finderType: 'ByValueKey',
            keyValueType: 'String',
            keyValueString: 'Test Key',
            timeout: 5000,
        });
    });

    it('Return Json String with command, alignment, finderType, keyValueType, keyValueString and timeout fields', () => {
        expect(
            new ScrollIntoView(new ByValueKey('Test Key'), { alignment: 1.2, timeout: 123 }).flat
        ).toEqual({
            timeout: 123,
            command: 'scrollIntoView',
            alignment: 1.2,
            finderType: 'ByValueKey',
            keyValueType: 'String',
            keyValueString: 'Test Key',
        });
    });
});
