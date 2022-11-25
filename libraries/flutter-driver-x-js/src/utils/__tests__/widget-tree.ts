import { widgetNodeMocked } from '../../../src/__mock__/mock';
import WidgetNodeNoneProperties from '../../common/diagnostics-tree/widget-tree';
import { WidgetTreeUtils } from '../widget-tree';

describe('WidgetTreeUtils', () => {
    it('getKeysPrefix found 4 keys', () => {
        const root: WidgetNodeNoneProperties = widgetNodeMocked;
        const keys = WidgetTreeUtils.getKeysPrefix(root, 'index');
        expect(keys).toEqual(['index 1', 'index 2', 'index 3', 'index 4']);
    });

    it('getKeysPrefix not found any keys', () => {
        const root: WidgetNodeNoneProperties = widgetNodeMocked;
        const keys = WidgetTreeUtils.getKeysPrefix(root, '12345');
        expect(keys).toEqual([]);
    });

    it('getKeysPrefix not match any keys', () => {
        const root: WidgetNodeNoneProperties = {
            description: "ManabieAddNewItemButton-[<'add A New Account Button'>]",
            type: '_ElementDiagnosticableTreeNode',
            style: 'dense',
            hasChildren: true,
            allowWrap: false,
            children: [
                {
                    description: "TextButton-[<'test 1'>]",
                    type: '_ElementDiagnosticableTreeNode',
                    style: 'dense',
                    hasChildren: false,
                    allowWrap: false,
                    children: [],
                    widgetRuntimeType: 'TextButton',
                    stateful: true,
                },
                {
                    description: "TextButton-[<'test 2'>]",
                    type: '_ElementDiagnosticableTreeNode',
                    style: 'dense',
                    hasChildren: false,
                    allowWrap: false,
                    children: [],
                    widgetRuntimeType: 'TextButton',
                    stateful: true,
                },
            ],
            widgetRuntimeType: 'ManabieAddNewItemButton',
            stateful: false,
        } as WidgetNodeNoneProperties;
        const keys = WidgetTreeUtils.getKeysPrefix(root, 'index');
        expect(keys).toEqual([]);
    });

    it('getKeysPrefix found 1 key', () => {
        const root: WidgetNodeNoneProperties = {
            description: "ManabieAddNewItemButton-[<'add A New Account Button'>]",
            type: '_ElementDiagnosticableTreeNode',
            style: 'dense',
            hasChildren: true,
            allowWrap: false,
            children: [
                {
                    description: "TextButton-[<'test 1'>]",
                    type: '_ElementDiagnosticableTreeNode',
                    style: 'dense',
                    hasChildren: true,
                    allowWrap: false,
                    children: [
                        {
                            description: "TextButton-[<'index 1'>]",
                            type: '_ElementDiagnosticableTreeNode',
                            style: 'dense',
                            hasChildren: false,
                            allowWrap: false,
                            children: [],
                            widgetRuntimeType: 'TextButton',
                            stateful: true,
                        },
                    ],
                    widgetRuntimeType: 'TextButton',
                    stateful: true,
                },
                {
                    description: "TextButton-[<'test 2'>]",
                    type: '_ElementDiagnosticableTreeNode',
                    style: 'dense',
                    hasChildren: false,
                    allowWrap: false,
                    children: [],
                    widgetRuntimeType: 'TextButton',
                    stateful: true,
                },
            ],
            widgetRuntimeType: 'ManabieAddNewItemButton',
            stateful: false,
        } as WidgetNodeNoneProperties;
        const keys = WidgetTreeUtils.getKeysPrefix(root, 'index');
        expect(keys).toEqual(['index 1']);
    });
});
