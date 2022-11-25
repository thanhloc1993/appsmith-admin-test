import { LearnerInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { ByValueKey } from 'flutter-driver-x';

export type LessonWhiteBoardAnnotationToolType =
    | 'selector'
    | 'laser pointer'
    | 'text'
    | 'pencil'
    | 'rectangle'
    | 'ellipse'
    | 'straight';

export type LessonWhiteBoardAnnotationToolIconType =
    | 'cursor'
    | 'highlight point'
    | 'T'
    | 'pen'
    | 'rectangle'
    | 'circle'
    | 'straight';

export async function learnerSelectsOptionInPollingAnswerBar(
    learner: LearnerInterface,
    option: string
) {
    const driver = learner.flutterDriver!;

    const optionButton = new ByValueKey(
        LearnerKeys.liveLessonPollingLearnerQuizBarOptionTextKey(option, false)
    );

    await driver.tap(optionButton);
}

export async function learnerSelectsAnnotationToolOnLearnerApp(
    learner: LearnerInterface,
    tool: LessonWhiteBoardAnnotationToolType
) {
    const driver = learner.flutterDriver!;

    await learnerOpensListAnnotationToolOnLearnerApp(learner);

    const toolButton = new ByValueKey(getAnnotationToolKey(tool));

    await driver.tap(toolButton, 15000);
}

export async function learnerSeesRespectiveIconInWhiteBoardBarOnLearnerApp(
    learner: LearnerInterface,
    icon: LessonWhiteBoardAnnotationToolIconType
) {
    const driver = learner.flutterDriver!;

    const toolButton = new ByValueKey(getAnnotationToolIconKey(icon));

    await driver.waitFor(toolButton);
}

export async function learnerOpensListAnnotationToolOnLearnerApp(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const tools: LessonWhiteBoardAnnotationToolType[] = [
        'selector',
        'laser pointer',
        'text',
        'pencil',
        'rectangle',
        'ellipse',
        'straight',
    ];
    let found = false;
    for (const tool of tools) {
        if (found) break;
        try {
            const selectedTool = new ByValueKey(`${getAnnotationToolKey(tool)} Represented`);
            await driver.tap(selectedTool);
            found = true;
        } catch (e) {
            // Try another tool
        }
    }

    if (!found) throw 'Can Not Find Annotation Tool In White Board Bar On Learner App';
}

function getAnnotationToolKey(tool: LessonWhiteBoardAnnotationToolType) {
    switch (tool) {
        case 'selector':
            return LearnerKeys.selectorTool;
        case 'laser pointer':
            return LearnerKeys.laserPointerTool;
        case 'text':
            return LearnerKeys.textTool;
        case 'pencil':
            return LearnerKeys.pencilTool;
        case 'rectangle':
            return LearnerKeys.rectangleTool;
        case 'ellipse':
            return LearnerKeys.ellipseTool;
        case 'straight':
            return LearnerKeys.straightTool;
    }
}

function getAnnotationToolIconKey(tool: LessonWhiteBoardAnnotationToolIconType) {
    const iconKeySuffix = ' Icon';
    switch (tool) {
        case 'cursor':
            return LearnerKeys.selectorTool + iconKeySuffix;
        case 'highlight point':
            return LearnerKeys.laserPointerTool + iconKeySuffix;
        case 'T':
            return LearnerKeys.textTool + iconKeySuffix;
        case 'pen':
            return LearnerKeys.pencilTool + iconKeySuffix;
        case 'rectangle':
            return LearnerKeys.rectangleTool + iconKeySuffix;
        case 'circle':
            return LearnerKeys.ellipseTool + iconKeySuffix;
        case 'straight':
            return LearnerKeys.straightTool + iconKeySuffix;
    }
}
