import { SetFrameSync } from '../frame-sync';

describe('SetFrameSync', () => {
    it('Return Json String with command and enable = true', () => {
        expect(new SetFrameSync(true, {}).flat).toEqual({
            command: 'set_frame_sync',
            enabled: 'true',
            timeout: 5000,
        });
    });

    it('Return Json String with command and enable = false, timeout fields', () => {
        expect(new SetFrameSync(false, { timeout: 123 }).flat).toEqual({
            timeout: 123,
            command: 'set_frame_sync',
            enabled: 'false',
        });
    });
});
