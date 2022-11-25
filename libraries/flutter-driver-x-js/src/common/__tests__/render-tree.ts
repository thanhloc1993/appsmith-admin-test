import { GetRenderTree } from '../render-tree';

describe('GetRenderTree', () => {
    it('Return Json String with command', () => {
        const data = new GetRenderTree({});

        expect(data.flat).toEqual({ command: 'get_render_tree', timeout: 5000 });
    });
});
