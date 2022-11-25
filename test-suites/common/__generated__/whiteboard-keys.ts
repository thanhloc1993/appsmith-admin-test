export class WhiteboardKeys {
    static whiteBoardViewKey = `Live Lesson White Board View`;

    static annotationButtonKey = `Live Lesson Annotation Button`;

    static annotationBarKey = `Live Lesson Annotation Bar`;

    static toolPickerKey = `Live Lesson White Board Tool Picker`;

    static selectorToolKey = `Live Lesson White Board Selector Tool`;

    static laserPointerToolKey = `Live Lesson White Board Laser Pointer Tool`;

    static textToolKey = `Live Lesson White Board Text Tool`;

    static pencilToolKey = `Live Lesson White Board Pencil Tool`;

    static rectangleToolKey = `Live Lesson White Board Rectangle Tool`;

    static ellipseToolKey = `Live Lesson White Board Ellipse Tool`;

    static straightToolKey = `Live Lesson White Board Straight Tool`;

    static handToolKey = `Live Lesson White Board Hand Tool`;

    static eraserToolKey = `Live Lesson White Board Eraser Tool`;

    static closeAnnotationKey = `Live Lesson White Board Close Annotation Button`;

    static annotationBarStrokePathKey = (size: number, selected: boolean): string =>
        `Live Lesson Annotation Bar Stroke Path size ${size} selected ${selected}`;

    static annotationBarColorPickerColorIndexKey = (
        colorIndex: number,
        selected: boolean
    ): string =>
        `Live Lesson Annotation Bar Color Picker Color Index ${colorIndex} selected ${selected}`;

    static pencilSelection = `Pencil Selection`;

    static shapeSelection = `Shape Selection`;

    static textSelection = `Text Selection`;

    static shapeTool = (tool: string, active: boolean): string => `Shape Tool ${tool} - ${active}`;

    static toolItem = (tool: string, active: boolean): string => `Tool Item ${tool} - ${active}`;

    static annotationOutside = `Annotation Outside`;

    static undo = `Undo`;

    static redo = `redo`;

    static eraserSelection = `Eraser Selection`;

    static clearAllTool = `Clear All Tool`;

    static zoomInAndOutPdfController = `Virtual Classroom Zoom In And Out Pdf Controller`;

    static movePdfController = `Virtual Classroom Move Pdf Controller`;

    static zoomInButton = `Virtual Classroom Zoom In Pdf Button`;

    static zoomOutButton = `Virtual Classroom Zoom Out Pdf Button`;

    static resetZoomButton = `Virtual Classroom Reset Zoom Button`;

    static currentZoomPercentage = `Virtual Classroom Current Zoom Percentage`;

    static moveBackButton = `Virtual Classroom Zoom Move Back Button`;

    static moveUpwardButton = `Virtual Classroom Zoom Move Upward Button`;

    static moveForwardButton = `Virtual Classroom Zoom Move Forward Button`;

    static moveDownwardButton = `Virtual Classroom Zoom Move Downward Button`;

    static whiteboardToolRepresentedSuffix = ` Represented`;

    static whiteboardToolIconSuffix = ` Icon`;
}
