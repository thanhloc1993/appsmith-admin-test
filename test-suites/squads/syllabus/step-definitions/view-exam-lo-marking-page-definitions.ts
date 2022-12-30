import { delay } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasContentBookLOQuestionQuantity } from './alias-keys/syllabus';
import { ByValueKey } from 'flutter-driver-x';

export async function isPresent(teacher: TeacherInterface, valueKey: string) {
    try {
        const widgetFinder = new ByValueKey(valueKey);
        await teacher.flutterDriver!.waitFor(widgetFinder);
        return true;
    } catch (exception) {
        return false;
    }
}

export async function viewMarkingPageAllWidgetsRequiredVisible(
    teacher: TeacherInterface,
    scenario: ScenarioContext
) {
    const examLOName = await isPresent(teacher, SyllabusTeacherKeys.loContentPopupTitle);
    weExpect(examLOName).toEqual(true);

    const attemptHistoryArrowIcon = await isPresent(
        teacher,
        SyllabusTeacherKeys.markingPageAttemptHistoryArrowIcon
    );
    weExpect(attemptHistoryArrowIcon).toEqual(true);

    const twoSideArrowsButtons = await isPresent(
        teacher,
        SyllabusTeacherKeys.markingPageTwoSideArrowsButtons
    );
    weExpect(twoSideArrowsButtons).toEqual(true);

    const twoSideArrowsNextButton = await isPresent(
        teacher,
        SyllabusTeacherKeys.markingPageTwoSideArrowsNextButton
    );
    weExpect(twoSideArrowsNextButton).toEqual(true);

    const twoSideArrowsPreviousButton = await isPresent(
        teacher,
        SyllabusTeacherKeys.markingPageTwoSideArrowsPreviousButton
    );
    weExpect(twoSideArrowsPreviousButton).toEqual(true);

    const questionGradingInfoBox = await isPresent(
        teacher,
        SyllabusTeacherKeys.markingPageQuestionGradingInfoBox
    );
    weExpect(questionGradingInfoBox).toEqual(true);

    const questionGradingInfoBoxPointPerQuestion = await isPresent(
        teacher,
        SyllabusTeacherKeys.markingPageQuestionGradingInfoBoxPointPerQuestion
    );
    weExpect(questionGradingInfoBoxPointPerQuestion).toEqual(true);

    const studentInfoBox = await isPresent(teacher, SyllabusTeacherKeys.markingPageStudentInfoBox);
    weExpect(studentInfoBox).toEqual(true);

    const studentInfoBoxAvatar = await isPresent(
        teacher,
        SyllabusTeacherKeys.markingPageStudentInfoBoxAvatar
    );
    weExpect(studentInfoBoxAvatar).toEqual(true);

    const studentInfoBoxName = await isPresent(
        teacher,
        SyllabusTeacherKeys.markingPageStudentInfoBoxName
    );
    weExpect(studentInfoBoxName).toEqual(true);

    const scoreInfoBox = await isPresent(teacher, SyllabusTeacherKeys.markingPageScoreInfoBox);
    weExpect(scoreInfoBox).toEqual(true);

    const scoreInfoBoxScoreTextKey = await isPresent(
        teacher,
        SyllabusTeacherKeys.markingPageScoreInfoBoxScoreTextKey
    );
    weExpect(scoreInfoBoxScoreTextKey).toEqual(true);

    await verifyQuestionProgressItemVisible(teacher, scenario);
}

export async function viewMarkingPageAllWidgetsWithExpected(
    teacher: TeacherInterface,
    expected: boolean
) {
    const result = await isPresent(teacher, SyllabusTeacherKeys.markingPageSaveButton);
    weExpect(result).toEqual(expected);

    const teacherCommentBox = await isPresent(
        teacher,
        SyllabusTeacherKeys.markingPageTeacherCommentBox
    );
    weExpect(teacherCommentBox).toEqual(expected);

    const teacherCommentBoxTextFieldKey = await isPresent(
        teacher,
        SyllabusTeacherKeys.markingPageTeacherCommentBoxTextFieldKey
    );
    weExpect(teacherCommentBoxTextFieldKey).toEqual(expected);

    const teacherFeedbackBox = await isPresent(
        teacher,
        SyllabusTeacherKeys.markingPageTeacherFeedbackBox
    );
    weExpect(teacherFeedbackBox).toEqual(expected);

    const teacherFeedbackBoxTextFieldKey = await isPresent(
        teacher,
        SyllabusTeacherKeys.markingPageTeacherFeedbackBoxTextFieldKey
    );
    weExpect(teacherFeedbackBoxTextFieldKey).toEqual(expected);

    const submissionStatusWidget = await isPresent(
        teacher,
        SyllabusTeacherKeys.markingPageSubmissionStatusWidget
    );
    weExpect(submissionStatusWidget).toEqual(expected);

    const questionGradingInfoBoxGradedPoint = await isPresent(
        teacher,
        SyllabusTeacherKeys.markingPageQuestionGradingInfoBoxGradedPoint(expected)
    );
    weExpect(questionGradingInfoBoxGradedPoint).toEqual(true);
}

export async function verifyQuestionProgressItemVisible(
    teacher: TeacherInterface,
    scenario: ScenarioContext
) {
    const driver = teacher.flutterDriver!;

    const questionQuantity = scenario.get<number>(aliasContentBookLOQuestionQuantity);

    let questionIndex = 0;
    for (let i = 0; i < questionQuantity; i++) {
        // Verify question progress item
        await driver.waitFor(
            new ByValueKey(SyllabusLearnerKeys.quizProgressIndex(questionIndex + 1))
        );
        questionIndex++;
    }
}

export async function verifyTwoSideArrowButtons(
    teacher: TeacherInterface,
    scenario: ScenarioContext
) {
    const driver = teacher.flutterDriver!;

    const questionQuantity = scenario.get<number>(aliasContentBookLOQuestionQuantity);

    let questionIndex = 0;
    for (let i = 0; i < questionQuantity; i++) {
        // press Next from first to last question
        await driver.tap(new ByValueKey(SyllabusTeacherKeys.markingPageTwoSideArrowsNextButton));
        questionIndex++;
    }

    for (let i = questionIndex; i > 0; i--) {
        // press Prev from last to first question
        await driver.tap(
            new ByValueKey(SyllabusTeacherKeys.markingPageTwoSideArrowsPreviousButton)
        );
        questionIndex--;
    }
}

export async function viewMarkingPageAsEditMode(
    teacher: TeacherInterface,
    scenario: ScenarioContext
) {
    await viewMarkingPageAllWidgetsRequiredVisible(teacher, scenario);
    await verifyTwoSideArrowButtons(teacher, scenario);
    await viewMarkingPageAllWidgetsWithExpected(teacher, true);
}

export async function viewMarkingPageAsViewMode(
    teacher: TeacherInterface,
    scenario: ScenarioContext
) {
    await viewMarkingPageAllWidgetsRequiredVisible(teacher, scenario);
    await verifyTwoSideArrowButtons(teacher, scenario);
    await viewMarkingPageAllWidgetsWithExpected(teacher, false);
}

export async function teacherSeesAndGoesToMarkingPage(
    teacher: TeacherInterface,
    studyPlanItemName: string
) {
    const driver = teacher.flutterDriver!;

    const studyPlanListKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanScrollView);
    const studyPlanItemKey = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanItemRow(studyPlanItemName)
    );

    try {
        await driver.waitFor(studyPlanListKey);
        await delay(3000);
        await driver.scrollUntilTap(studyPlanListKey, studyPlanItemKey, 0.0, -300, 10000);
    } catch (error) {
        throw Error(`Expect can tap item ${studyPlanItemName}`);
    }
}
