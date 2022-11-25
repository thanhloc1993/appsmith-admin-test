export default interface WidgetNodeNoneProperties {
    description: string;
    type: string;
    style: string;
    hasChildren: boolean;
    allowWrap: boolean;
    children: WidgetNodeNoneProperties[];
    widgetRuntimeType: string;
    stateful: boolean;
}
