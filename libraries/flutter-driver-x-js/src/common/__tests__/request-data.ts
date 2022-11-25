import { RequestData } from '../request-data';

describe('Request Data', () => {
    it('Return Json String with command', () => {
        const data = new RequestData('get token', {});

        expect(data.flat).toEqual({ command: 'request_data', message: 'get token', timeout: 5000 });
    });
});
