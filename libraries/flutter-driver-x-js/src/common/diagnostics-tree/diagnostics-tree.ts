import { CommandWithTarget, SerializableFinder } from '../find';
import { Result } from '../message';
import WidgetNode from './widget-tree';

export enum DiagnosticsType {
    /// The [DiagnosticsNode] tree formed by [RenderObject]s.
    renderObject = 'renderObject',

    /// The [DiagnosticsNode] tree formed by [Widget]s.
    widget = 'widget',
}

export class GetDiagnosticsTree extends CommandWithTarget {
    /// How many levels of children to include in the JSON result.
    ///
    /// Defaults to zero, which will only return the [DiagnosticsNode] information
    /// of the object identified by [finder].
    subtreeDepth?: number;

    /// Whether the properties of a [DiagnosticsNode] should be included.
    includeProperties?: boolean;

    /// The type of [DiagnosticsNode] tree that is requested.
    diagnosticsType?: DiagnosticsType;

    constructor(
        finder: SerializableFinder,
        diagnosticsType: DiagnosticsType,
        {
            subtreeDepth = 0,
            includeProperties = false,
            timeout = 5000,
        }: { subtreeDepth?: number; includeProperties?: boolean; timeout?: number }
    ) {
        super(finder, { timeout });
        this.diagnosticsType = diagnosticsType;
        this.subtreeDepth = subtreeDepth;
        this.includeProperties = includeProperties;
    }

    command = 'get_diagnostics_tree';
}

export interface GetDiagnosticsWidgetTreeResult extends Result {
    response: WidgetNode;
}
