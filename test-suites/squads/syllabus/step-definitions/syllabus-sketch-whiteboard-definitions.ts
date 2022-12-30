import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';

import { draw } from './syllabus-utils';
import { ByValueKey, delay } from 'flutter-driver-x';

export const studentSketchesWhiteboardMeaningless = async (learner: LearnerInterface) => {
    const driver = learner.flutterDriver!;
    const size = driver.webDriver!.page.viewportSize()!;
    const height = size.height;
    const width = size.width;

    //Draw X will start from 200 to width -200
    //Draw Y will start from height - 150 to height -450
    const startX1 = width / 2 - 80;
    const startY1 = height - 325;
    const x11 = startX1 + 160;
    const y11 = startY1;

    //steps mean how many event for mouse move will fire for flutter web

    await driver.webDriver!.page.mouse.move(startX1, startY1, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x11, y11, { steps: 40 });
    await driver.webDriver!.page.mouse.up();
};

export const studentSketchesWhiteboardEnglish = async (learner: LearnerInterface) => {
    const driver = learner.flutterDriver!;
    const size = driver.webDriver!.page.viewportSize()!;
    const height = size.height;

    //Draw X will start from 200 to width -200
    //Draw Y will start from height - 150 to height -450
    const startX1 = 200;
    const startY1 = height - 150;
    const x11 = startX1;
    const y11 = startY1 - 200;

    const x21 = x11 + 150;
    const y21 = y11 + 200;

    const x31 = x21;
    const y31 = y21 - 200;

    //steps mean how many event for mouse move will fire for flutter web

    //The first word N
    await driver.webDriver!.page.mouse.move(startX1, startY1, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x11, y11, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x21, y21, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x31, y31, { steps: 40 });
    await driver.webDriver!.page.mouse.up();

    //The second word I
    const startX2 = x31 + 50;
    const startY2 = y31;
    const x12 = startX2;
    const y12 = startY2 + 200;

    await driver.webDriver!.page.mouse.move(startX2, startY2, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x12, y12, { steps: 40 });
    await driver.webDriver!.page.mouse.up();

    //The third word N
    const startX3 = x12 + 50;
    const startY3 = y12;
    const x13 = startX3;
    const y13 = startY3 - 200;

    const x23 = x13 + 150;
    const y23 = y13 + 200;

    const x33 = x23;
    const y33 = y23 - 200;

    await driver.webDriver!.page.mouse.move(startX3, startY3, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x13, y13, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x23, y23, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x33, y33, { steps: 40 });
    await driver.webDriver!.page.mouse.up();

    //The fourth word E
    const startX4 = x33 + 250;
    const startY4 = y33 + 200;
    const x14 = startX4 - 200;
    const y14 = startY4;
    const x24 = x14;
    const y24 = y14 - 100;
    const x34 = x24 + 150;
    const y34 = y24;
    const x44 = x34 - 150;
    const y44 = y34;
    const x54 = x44;
    const y54 = y44 - 100;
    const x64 = x54 + 200;
    const y64 = y54;
    await driver.webDriver!.page.mouse.move(startX4, startY4, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x14, y14, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x24, y24, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x34, y34, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x44, y44, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x54, y54, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x64, y64, { steps: 40 });
    await driver.webDriver!.page.mouse.up();
};

export const studentContinueSketchesWhiteboardEnglish = async (learner: LearnerInterface) => {
    const driver = learner.flutterDriver!;
    const size = driver.webDriver!.page.viewportSize()!;
    const height = size.height;

    //Draw X will start from 200 to width -200
    //Draw Y will start from height - 150 to height -450
    const startX1 = 1000;
    const startY1 = height - 150;
    const x11 = startX1;
    const y11 = startY1 - 200;

    const x21 = x11 - 75;
    const y21 = y11;

    const x31 = x21 + 150;
    const y31 = y21;

    //steps mean how many event for mouse move will fire for flutter web

    //The first word T
    await driver.webDriver!.page.mouse.move(startX1, startY1, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x11, y11, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x21, y21, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x31, y31, { steps: 40 });
    await driver.webDriver!.page.mouse.up();

    //The second word Y
    const startX2 = x31 + 100;
    const startY2 = y31;
    const x12 = startX2 + 50;
    const y12 = startY2 + 100;
    const x22 = x12 + 50;
    const y22 = y12 - 100;
    const x32 = x22 - 50;
    const y32 = y22 + 100;
    const x42 = x32;
    const y42 = y32 + 100;
    await driver.webDriver!.page.mouse.move(startX2, startY2, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x12, y12, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x22, y22, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x32, y32, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x42, y42, { steps: 40 });

    await driver.webDriver!.page.mouse.up();
};

export const studentSketchesWhiteboardJapanese = async (learner: LearnerInterface) => {
    const driver = learner.flutterDriver!;
    const size = driver.webDriver!.page.viewportSize()!;
    const height = size.height;
    const width = size.width;

    //Draw X will start from 200 to width -200
    //Draw Y will start from height - 150 to height -450
    const startX1 = width / 2 - 80;
    const startY1 = height - 325;
    const x11 = startX1 + 160;
    const y11 = startY1;

    //steps mean how many event for mouse move will fire for flutter web

    //The word 葷

    await driver.webDriver!.page.mouse.move(startX1, startY1, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x11, y11, { steps: 40 });
    await driver.webDriver!.page.mouse.up();

    const startX2 = width / 2 - 70;
    const startY2 = height - 250;
    const x12 = startX2;
    const y12 = startY2 - 50;
    const x22 = x12 + 140;
    const y22 = y12;
    const x32 = x22;
    const y32 = y22 + 50;
    await driver.webDriver!.page.mouse.move(startX2, startY2, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x12, y12, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x22, y22, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x32, y32, { steps: 40 });
    await driver.webDriver!.page.mouse.up();

    const startX3 = width / 2 + 70;
    const startY3 = height - 275;
    const x13 = startX3 - 140;
    const y13 = startY3;
    await driver.webDriver!.page.mouse.move(startX3, startY3, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x13, y13, { steps: 40 });
    await driver.webDriver!.page.mouse.up();

    //Fourth stroke
    const startX4 = width / 2 + 70;
    const startY4 = height - 250;
    const x14 = startX4 - 140;
    const y14 = startY4;
    await driver.webDriver!.page.mouse.move(startX4, startY4, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x14, y14, { steps: 40 });
    await driver.webDriver!.page.mouse.up();

    const startX5 = width / 2 + 100;
    const startY5 = height - 225;
    const x15 = startX5 - 200;
    const y15 = startY5;
    await driver.webDriver!.page.mouse.move(startX5, startY5, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x15, y15, { steps: 40 });
    await driver.webDriver!.page.mouse.up();

    const startX6 = width / 2;
    const startY6 = height - 350;
    const x16 = startX6;
    const y16 = startY6 + 150;
    await driver.webDriver!.page.mouse.move(startX6, startY6, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x16, y16, { steps: 40 });
    await driver.webDriver!.page.mouse.up();

    const startX7 = width / 2 - 100;
    const startY7 = height - 375;
    const x17 = startX7 + 200;
    const y17 = startY7;
    await driver.webDriver!.page.mouse.move(startX7, startY7, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x17, y17, { steps: 40 });
    await driver.webDriver!.page.mouse.up();

    const startX8 = width / 2 - 25;
    const startY8 = height - 387.5;
    const x18 = startX8;
    const y18 = startY8 + 24;
    await driver.webDriver!.page.mouse.move(startX8, startY8, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x18, y18, { steps: 40 });
    await driver.webDriver!.page.mouse.up();

    const startX9 = width / 2 + 25;
    const startY9 = height - 387.5;
    const x19 = startX9;
    const y19 = startY9 + 24;
    await driver.webDriver!.page.mouse.move(startX9, startY9, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x19, y19, { steps: 40 });
    await driver.webDriver!.page.mouse.up();

    const startX10 = width / 2 - 100;
    const startY10 = height - 325;
    const x110 = startX10 + 15;
    const y110 = startY10 - 25;
    const x210 = x110 + 185;
    const y210 = y110;
    const x310 = x210 - 15;
    const y310 = y210 + 25;
    await driver.webDriver!.page.mouse.move(startX10, startY10, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(x110, y110, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x210, y210, { steps: 40 });
    await driver.webDriver!.page.mouse.move(x310, y310, { steps: 40 });

    await driver.webDriver!.page.mouse.up();
};

export const studentSketchesWhiteboardMath = async (learner: LearnerInterface) => {
    const driver = learner.flutterDriver!;
    const size = driver.webDriver!.page.viewportSize()!;
    const height = size.height;

    const dy = 100;
    const dx = 60;
    const spaceX = 30;
    const spaceY = 20;

    //Draw X will start from 200 to width -200
    //Draw Y will start from height - 150 to height -450
    let x = 200;
    let y = height - 325;

    //steps mean how many event for mouse move will fire for flutter web

    // X
    await draw(driver, x, y, x + dx, y + dy);
    await draw(driver, x + dx, y, x, y + dy);

    x += dx + spaceX;

    // =
    await draw(driver, x, y + dy / 2 - spaceY, x + dy, y + dy / 2 - spaceY);
    await draw(driver, x, y + dy / 2 + spaceY, x + dy, y + dy / 2 + spaceY);

    x += dy + 2 * spaceX;

    // -
    await draw(driver, x - dx / 2, y + dy / 2, x + (3 * dx) / 2, y + dy / 2);

    y -= 0.5 * dy + spaceY;

    // 1
    await draw(driver, x + dx / 2, y, x + dx / 2, y + dy);

    y += dy + 2 * spaceY;

    // 7
    await draw(driver, x, y, x + dx, y);
    await draw(driver, x + dx, y, x, y + dy);
    await draw(driver, x + spaceX / 2, y + dy / 2, x + (3 * spaceX) / 2, y + dy / 2);
};

export const studentScanWhiteboard = async (learner: LearnerInterface) => {
    await learner.flutterDriver!.tap(new ByValueKey(SyllabusLearnerKeys.scanWhiteboardButton));
    await delay(1000);
    await learner.flutterDriver!.waitForAbsent(new ByValueKey(SyllabusLearnerKeys.loading_dialog));
};

export const studentSeeWhiteboardSketched = async (learner: LearnerInterface) => {
    await learner.flutterDriver!.waitFor(new ByValueKey(SyllabusLearnerKeys.whiteboardNotEmpty));
};

export const studentSeeWhiteboardEmpty = async (learner: LearnerInterface) => {
    await learner.flutterDriver!.waitFor(new ByValueKey(SyllabusLearnerKeys.whiteboardEmpty));
};

export const studentTapTheAnswerAtIndex = async (
    learner: LearnerInterface,
    answerIndex: number
) => {
    const driver = learner.flutterDriver!;

    const fibAnswerInputKey = new ByValueKey(
        SyllabusLearnerKeys.answerFillTheBlankWithOriginalIndex(answerIndex + 1)
    );
    await driver.scrollIntoView(fibAnswerInputKey, 0);

    await driver.tap(fibAnswerInputKey);
};

export const studentSeeTheAnswerFilled = async (learner: LearnerInterface, answerIndex: number) => {
    const answerField = new ByValueKey(
        SyllabusLearnerKeys.answerFillTheBlankWithOriginalIndex(answerIndex + 1)
    );
    const driver = learner.flutterDriver!;
    await driver.scrollIntoView(answerField, 0, 1000);
    const answerFieldText = await driver.getText(answerField);
    weExpect(answerFieldText.trim().length).toBeGreaterThan(0);
    return answerFieldText;
};

export const studentSeeTheAnswerNotFilled = async (
    learner: LearnerInterface,
    answerIndex: number
) => {
    const answerField = new ByValueKey(
        SyllabusLearnerKeys.answerFillTheBlankWithOriginalIndex(answerIndex + 1)
    );
    const driver = learner.flutterDriver!;
    await driver.scrollIntoView(answerField, 0, 1000);
    const answerFieldText = await driver.getText(answerField);

    weExpect(answerFieldText.trim().length).toEqual(0);
    return answerFieldText;
};

export const studentSeeTheAnswerUpdated = async (
    learner: LearnerInterface,
    lastAnswerFilledText: string,
    answerIndex: number
) => {
    const answerField = new ByValueKey(
        SyllabusLearnerKeys.answerFillTheBlankWithOriginalIndex(answerIndex + 1)
    );
    const driver = learner.flutterDriver!;
    await driver.scrollIntoView(answerField, 0, 1000);
    const answerFieldText = await driver.getText(answerField);
    weExpect(answerFieldText.trim().length).toBeGreaterThan(1);
    weExpect(answerFieldText).not.toEqual(lastAnswerFilledText);
    return answerFieldText;
};

export const studentSeeTheAnswerNotUpdated = async (
    learner: LearnerInterface,
    lastAnswerFilledText: string,
    answerIndex: number
) => {
    const answerField = new ByValueKey(
        SyllabusLearnerKeys.answerFillTheBlankWithOriginalIndex(answerIndex + 1)
    );
    const driver = learner.flutterDriver!;
    await driver.scrollIntoView(answerField, 0, 1000);
    const answerFieldText = await driver.getText(answerField);
    weExpect(answerFieldText).toEqual(lastAnswerFilledText);
    return answerFieldText;
};

export const studentSeeTheErrorMessage = async (learner: LearnerInterface) => {
    await learner.flutterDriver!.waitFor(new ByValueKey(SyllabusLearnerKeys.errorDialog));
};

export const studentCloseTheErrorMessage = async (learner: LearnerInterface) => {
    await learner.flutterDriver!.tap(new ByValueKey(SyllabusLearnerKeys.errorDialogCloseButton));
};

export const studentSeeWhiteboardNotChange = async (
    learner: LearnerInterface,
    isSketchWhiteboard: boolean
) => {
    await learner.flutterDriver!.waitFor(
        new ByValueKey(
            isSketchWhiteboard
                ? SyllabusLearnerKeys.whiteboardNotEmpty
                : SyllabusLearnerKeys.whiteboardEmpty
        )
    );
};

export const studentEraseWhiteboard = async (learner: LearnerInterface) => {
    await learner.flutterDriver!.tap(new ByValueKey(SyllabusLearnerKeys.eraseWhiteboardButton));
};
