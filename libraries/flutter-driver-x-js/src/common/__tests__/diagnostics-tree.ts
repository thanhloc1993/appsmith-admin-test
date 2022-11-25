import { GetDiagnosticsTree, DiagnosticsType } from '../diagnostics-tree/diagnostics-tree';
import { ByValueKey } from '../find';

describe('GetDiagnosticsTree', () => {
    it('Return Json String with command, ByValueKey and DiagnosticsType.widget', () => {
        expect(
            new GetDiagnosticsTree(new ByValueKey('value_key'), DiagnosticsType.widget, {}).flat
        ).toEqual({
            command: 'get_diagnostics_tree',
            diagnosticsType: 'widget',
            finderType: 'ByValueKey',
            includeProperties: false,
            keyValueString: 'value_key',
            keyValueType: 'String',
            subtreeDepth: 0,
            timeout: 5000,
        });
    });

    it('Return Json String with command, ByValueKey and DiagnosticsType.renderObject', () => {
        expect(
            new GetDiagnosticsTree(new ByValueKey('value_key'), DiagnosticsType.renderObject, {})
                .flat
        ).toEqual({
            command: 'get_diagnostics_tree',
            diagnosticsType: 'renderObject',
            finderType: 'ByValueKey',
            includeProperties: false,
            keyValueString: 'value_key',
            keyValueType: 'String',
            subtreeDepth: 0,
            timeout: 5000,
        });
    });

    it('Return Json String with command, ByValueKey and DiagnosticsType.renderObject, subtreeDepth = 100, includeProperties=true, timeout=1000', () => {
        expect(
            new GetDiagnosticsTree(new ByValueKey('value_key'), DiagnosticsType.renderObject, {
                subtreeDepth: 100,
                includeProperties: true,
                timeout: 1000,
            }).flat
        ).toEqual({
            command: 'get_diagnostics_tree',
            diagnosticsType: 'renderObject',
            finderType: 'ByValueKey',
            includeProperties: true,
            keyValueString: 'value_key',
            keyValueType: 'String',
            subtreeDepth: 100,
            timeout: 1000,
        });
    });
});
