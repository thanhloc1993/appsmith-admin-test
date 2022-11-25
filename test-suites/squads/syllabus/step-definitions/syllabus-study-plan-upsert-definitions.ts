import {
    bookTabRoot,
    getStudyPlanNameSelector,
} from '@legacy-step-definitions/cms-selectors/course';
import { delay } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { CMSInterface, LearnerInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { ActionOptions } from '@supports/types/cms-types';

import { aliasCourseBookDownloadPath } from './alias-keys/syllabus';
import { studentSeeChapter } from './syllabus-content-book-create-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { selectABookInCourse, selectAllBooksInCourse } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import { AssertRandomStudyPlanItemsData } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export async function downloadBookCourse(cms: CMSInterface, context: ScenarioContext) {
    const [download] = await Promise.all([
        cms.page?.waitForEvent('download'), // wait for download to start
        cms.selectActionButton(ActionOptions.DOWNLOAD, {
            target: 'actionPanelTrigger',
            wrapperSelector: bookTabRoot,
        }),
    ]);
    const filePath = await download?.path();

    if (!filePath) throw Error('Cannot download the book CSV');

    context.set(aliasCourseBookDownloadPath, filePath);

    return filePath;
}

export async function studentSeeStudyPlanItem(
    learner: LearnerInterface,
    topicName: string,
    studyPlanItemName: string,
    index?: number
) {
    const studyPlanKey =
        typeof index !== 'undefined'
            ? SyllabusLearnerKeys.study_plan_item_with_position(index, studyPlanItemName)
            : SyllabusLearnerKeys.study_plan_item(studyPlanItemName);

    const studyPlanItemKey = new ByValueKey(studyPlanKey);

    const loListScreenKey = new ByValueKey(SyllabusLearnerKeys.lo_list_screen(topicName));

    await learner.flutterDriver!.waitFor(loListScreenKey);

    await learner.instruction(
        `Display study plan item ${studyPlanItemName} in topic ${topicName}`,
        async function () {
            try {
                await learner.flutterDriver!.scrollUntilVisible(
                    loListScreenKey,
                    studyPlanItemKey,
                    0.0,
                    0.0,
                    -100,
                    20000
                );
            } catch (error) {
                throw Error(
                    `Expect study plan item ${studyPlanItemName} is displayed in topic ${topicName}`
                );
            }
        }
    );
}

export async function studentSeesStudyPlanItemInTodosScreen(
    learner: LearnerInterface,
    topicName: string,
    studyPlanItemName: string
) {
    const studyPlanItemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(studyPlanItemName));
    const listKey = new ByValueKey(SyllabusLearnerKeys.todos_page);

    await learner.flutterDriver!.waitFor(listKey);

    await learner.instruction(
        `Display study plan item ${studyPlanItemName} (of topic ${topicName})`,
        async function () {
            try {
                await learner.flutterDriver!.scrollUntilVisible(
                    listKey,
                    studyPlanItemKey,
                    0.0,
                    0.0,
                    -350,
                    20000
                );
            } catch (error) {
                throw Error(
                    `Expect study plan item ${studyPlanItemName} (of topic ${topicName}) is displayed in Todos screen`
                );
            }
        }
    );
}

export async function studentSeeRandomStudyPlanItems(
    learner: LearnerInterface,
    data: AssertRandomStudyPlanItemsData
) {
    const { chapterList, topicList, learningObjectiveList, assignmentList } = data;
    const backButtonKey = new ByValueKey(SyllabusLearnerKeys.back_button);

    if (!chapterList || !topicList) return;

    for (const chapter of chapterList) {
        await studentSeeChapter(learner, chapter.info!.name);
    }

    for (const topic of topicList) {
        await studentGoToTopicDetail(learner, topic.name);

        for (const lo of learningObjectiveList) {
            if (lo.topicId === topic.id) {
                await studentSeeStudyPlanItem(learner, topic.name, lo.info.name);
            }
        }
        for (const assignment of assignmentList) {
            if (assignment.content?.topicId === topic.id) {
                await studentSeeStudyPlanItem(learner, topic.name, assignment.name);
            }
        }

        await learner.flutterDriver!.tap(backButtonKey);
    }
}

// TODO: @syllabus check total progress in Teacher web
export async function teacherStillSeesTheStudyPlanItems(
    teacher: TeacherInterface,
    studyPlanName: string,
    data: AssertRandomStudyPlanItemsData
) {
    const { learningObjectiveList, assignmentList } = data;
    const studyPlanDropdown = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanDropDown);

    try {
        await teacher.flutterDriver?.tap(studyPlanDropdown);
    } catch (error) {
        await teacher.flutterDriver?.reload();
        await teacher.flutterDriver?.tap(studyPlanDropdown);
    }

    await teacher.flutterDriver?.tap(
        new ByValueKey(SyllabusTeacherKeys.studentStudyPlanName(studyPlanName))
    );

    for (const lo of learningObjectiveList) {
        await teacherSeeStudyPlanItem(teacher, lo.info!.name);
    }

    for (const assignment of assignmentList) {
        await teacherSeeStudyPlanItem(teacher, assignment.name);
    }
}

export async function teacherDoesNotSeesDeletedTopics(
    teacher: TeacherInterface,
    studyPlanName: string,
    deletedTopicNames: string[]
) {
    const studyPlanDropdown = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanDropDown);

    await teacher.flutterDriver?.tap(studyPlanDropdown);
    await teacher.flutterDriver?.tap(
        new ByValueKey(SyllabusTeacherKeys.studentStudyPlanName(studyPlanName))
    );

    for (const topic of deletedTopicNames ?? []) {
        await teacherDoesNotSeeTopic(teacher, topic);
    }
}

export async function teacherDoesNotSeeTopic(teacher: TeacherInterface, topicName: string) {
    const topicKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanTopicRow(topicName));

    await teacher.flutterDriver?.waitForAbsent(topicKey);
}

export async function teacherSeeStudyPlanItem(
    teacher: TeacherInterface,
    studyPlanItemName: string,
    index?: number
) {
    const studyPlanKey =
        typeof index !== 'undefined'
            ? SyllabusTeacherKeys.studentStudyPlanItemRowVsPosition(index, studyPlanItemName)
            : SyllabusTeacherKeys.studentStudyPlanItemRow(studyPlanItemName);

    const studyPlanItemKey = new ByValueKey(studyPlanKey);
    const studyPlanTabKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanTab);
    const studyPlanTableKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemList);
    const studyPlanListKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanScrollView);

    const driver = teacher.flutterDriver!;

    try {
        await driver.waitFor(studyPlanTabKey, 10000);
        await driver.waitFor(studyPlanTableKey, 10000);
        await driver.waitFor(studyPlanListKey, 10000);
    } catch (error) {
        await driver.reload();
        await driver.waitFor(studyPlanTabKey, 10000);
        await driver.waitFor(studyPlanTableKey, 10000);
        await driver.waitFor(studyPlanListKey, 10000);
    }
    //Waiting for studyplan item on list
    await delay(3000);

    await teacher.instruction(`Display study plan item ${studyPlanItemName}`, async function () {
        try {
            await driver.waitFor(studyPlanItemKey, 20000);
        } catch (error) {
            throw Error(`Expect study plan item ${studyPlanItemName} is displayed`);
        }
    });
}

// TODO: Duplicate function (teacherGoToCourseStudentDetail)
export const teacherGoesToStudyPlanDetails = async (
    teacher: TeacherInterface,
    courseId: string,
    studentId: string
) => {
    const websiteDomain = teacher.flutterDriver!.webDriver?.page.url().split('#')[0];
    const url = `${websiteDomain}#/courseDetail?course_id=${courseId}/studentStudyPlan?student_id=${studentId}`;
    await teacher.flutterDriver?.webDriver?.page.goto(url);
};

export async function teacherNotSeeStudyPlanItem(
    teacher: TeacherInterface,
    courseName: string,
    loName: string
) {
    const loListScreenKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanScrollView);

    await teacher.flutterDriver!.waitFor(loListScreenKey);

    const itemKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemRow(loName));

    try {
        await teacher.flutterDriver!.waitForAbsent(itemKey);
        console.log(`Not found ${loName}`);
    } catch (error) {
        throw Error(`${loName} appears in ${courseName}`);
    }
}

export async function studentNotSeeStudyPlanItem(
    learner: LearnerInterface,
    topicName: string,
    loName: string
) {
    const loListScreenKey = new ByValueKey(SyllabusLearnerKeys.lo_list_screen(topicName));

    await learner.flutterDriver!.waitFor(loListScreenKey);

    const itemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(loName));

    try {
        await learner.flutterDriver!.waitForAbsent(itemKey);
        console.log(`Not found ${loName}`);
    } catch (error) {
        throw Error(`${loName} appears in ${topicName}`);
    }
}

export async function schoolAdminSelectBookToDownload(
    cms: CMSInterface,
    context: ScenarioContext,
    bookNameChoice?: string
): Promise<string> {
    if (bookNameChoice) {
        await selectABookInCourse(cms, bookNameChoice);
    } else {
        await selectAllBooksInCourse(cms);
    }

    return await downloadBookCourse(cms, context);
}

export async function schoolAdminDownloadSelectStudyplanName(
    cms: CMSInterface,
    context: ScenarioContext,
    studyPlanName: string
): Promise<string> {
    const [download] = await Promise.all([
        cms.page?.waitForEvent('download'), // wait for download to start
        await cms.selectActionButton(ActionOptions.DOWNLOAD_CSV, {
            target: 'actionPanelTrigger',
            suffix: `:right-of(${getStudyPlanNameSelector(studyPlanName)})`,
        }),
    ]);
    const filePath = await download?.path();

    if (!filePath) throw Error('Cannot download the book CSV');

    context.set(aliasCourseBookDownloadPath, filePath);

    return filePath;
}
