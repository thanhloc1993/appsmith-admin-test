export class ManabieAgoraKeys {
    static userRowInJoinedSection = (userId: string): string =>
        `User Row In Joined Section ${userId}`;

    static raiseHandButtonOfStudent = (userId: string, index: number): string =>
        `Raise Hand Button ${userId} ${index}`;

    static multiWhiteboardAnnotationButton = (userId: string, enable: boolean): string =>
        `Multi Whiteboard Annotation Button ${userId} ${enable}`;

    static microKeyButton = (userId: string, hasAudio: boolean): string =>
        `Micro Is ${hasAudio} ${userId}`;

    static cameraKeyButton = (userId: string, hasVideo: boolean): string =>
        `Camera Is ${hasVideo} ${userId}`;
}
