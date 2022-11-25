import WidgetNodeNoneProperties from '../common/diagnostics-tree/widget-tree';
import { ConverterUtils } from './converter';

export class WidgetTreeUtils {
    static getKeysPrefix(root: WidgetNodeNoneProperties, prefix: string): string[] {
        if (!root || !root.children || !root.children.length) return [];

        const stack = [root];
        const keys: string[] = [];

        while (stack.length) {
            const node = stack.shift();

            if (!node) break;

            const key = ConverterUtils.getKeyFromDescription(node.description);

            if (key != '' && key.startsWith(prefix)) {
                keys.push(key);
            }

            if (!node.children || !node.children.length) continue;

            for (const child of node.children) {
                stack.push(child);
            }
        }

        return keys;
    }
}
