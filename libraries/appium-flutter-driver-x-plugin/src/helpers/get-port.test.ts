import { getPort } from './get-port';

test('Get port from url', () => {
    expect(getPort('http://127.0.0.1:51195/YaX3i9fMNNc=/')).toBe(51195);
});
