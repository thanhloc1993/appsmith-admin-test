import { baseDialogRoot } from '@legacy-step-definitions/cms-selectors/common';
import {
    addStudyPlan,
    studentStudyPlanTab,
    studyPlanForm,
    studyPlanName,
    studyPlanUploading,
    tableStudyPlanRowCollapse,
    uploadInput,
} from '@legacy-step-definitions/cms-selectors/course';
import { convertEnumKeys, genId, getRandomElement } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { CMSInterface, LearnerInterface, TeacherInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasStudyPlanCSVUploaded, aliasStudyPlanName } from './alias-keys/syllabus';
import { tableCellHeader } from './cms-selectors/cms-keys';
import { ByValueKey } from 'flutter-driver-x';
import fs from 'fs';
import { StudyPlanTaskStatus } from 'manabuf/eureka/v1/enums_pb';
import { addCoursesForStudent } from 'test-suites/squads/user-management/step-definitions/user-update-student-definitions';

// TODO: Intended we will remove in the future
const keyStudyPlanTaskStatus = convertEnumKeys(StudyPlanTaskStatus);

export const schoolAdminWaitingStudyPlanInsert = async (cms: CMSInterface) => {
    let counter = 0;
    while (counter < 5) {
        const data = await cms.waitForHasuraResponse('AssignStudyPlanTasksMany', {
            // Http polling
            timeout: 25000,
        });

        const status = data.resp.data.assign_study_plan_tasks[0].status;

        if (status === keyStudyPlanTaskStatus.STUDY_PLAN_TASK_STATUS_COMPLETED) {
            break;
        }

        if (status === keyStudyPlanTaskStatus.STUDY_PLAN_TASK_STATUS_ERROR) {
            throw new Error('Import study plan via CSV failed');
        }
        counter++;
    }

    if (counter > 5) throw new Error('Import study plan via CSV failed');

    await cms.instruction('Waiting to study plan CSV insert process is complete', async () => {
        await cms.waitForSkeletonLoading();
        await cms.page?.waitForSelector(studyPlanUploading, { state: 'hidden' });
    });
};

export const createStudyPlan = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    filePath: string
) => {
    const studyPlanName = `Study plan ${genId()}`;
    const fileName = `CSV ${genId()}.csv`;

    scenario.set(aliasStudyPlanName, studyPlanName);
    scenario.set(aliasStudyPlanCSVUploaded, fileName);

    await cms.selectElementByDataTestId(addStudyPlan);

    await cms.page?.waitForSelector(studyPlanForm);

    await cms.page?.fill('#name', studyPlanName);

    const buffer = fs.readFileSync(filePath);

    await cms.page?.setInputFiles(uploadInput, {
        mimeType: '.csv',
        name: fileName,
        buffer,
    });

    await cms.selectAButtonByAriaLabel('Save');

    await cms.page?.waitForSelector(baseDialogRoot, { state: 'hidden' });
};

export async function selectBookInTheCourse(cms: CMSInterface) {
    await cms.waitForSkeletonLoading();
    await cms.page?.click(`${tableCellHeader} input[type='checkbox']`);
}

export const schoolAdminGotoCourseDetail = async (cms: CMSInterface, id: string) => {
    await cms.page?.goto(`/syllabus/courses/${id}/show`);
    await cms.waitingForLoadingIcon();
};

export const schoolAdminAssertStudyPlanOnCMS = async (cms: CMSInterface) => {
    await cms?.page?.waitForSelector(`${studyPlanName}`);
};

export const teacherGenCourseDetailUrl = async (teacher: TeacherInterface, courseId: string) => {
    const origin = await teacher.flutterDriver?.webDriver?.getUrlOrigin();
    return `${origin}courseDetail?course_id=${courseId}`;
};

export const teacherGoToCourseDetail = async (teacher: TeacherInterface, courseId: string) => {
    const url = await teacherGenCourseDetailUrl(teacher, courseId);
    await teacher.flutterDriver?.webDriver?.page.goto(url);
};

export const teacherGoToCourseStudentDetail = async (
    teacher: TeacherInterface,
    courseId: string,
    studentId: string
) => {
    const courseDetailUrl = await teacherGenCourseDetailUrl(teacher, courseId);
    const url = `${courseDetailUrl}/studentStudyPlan?student_id=${studentId}`;

    await teacher.flutterDriver?.webDriver?.page.goto(url);
};

export const teacherSeeStudyPlan = async (teacher: TeacherInterface, studyPlanName: string) => {
    const studyPlanDropdown = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanDropDown);

    await teacher.flutterDriver?.tap(studyPlanDropdown);
    await teacher.flutterDriver?.tap(
        new ByValueKey(SyllabusTeacherKeys.studentStudyPlanName(studyPlanName))
    );
};

export const teacherDoesNotSeeStudyPlan = async (
    teacher: TeacherInterface,
    studyPlanName: string
) => {
    await teacher.flutterDriver?.waitForAbsent(
        new ByValueKey(SyllabusTeacherKeys.studentStudyPlanName(studyPlanName))
    );
};

export const studentBackNavigate = async (learner: LearnerInterface) => {
    const backFinder = new ByValueKey(SyllabusLearnerKeys.back_button);

    await learner.flutterDriver?.tap(backFinder);
};

export const studentCheckTopicIsPresent = async (learner: LearnerInterface, topicName: string) => {
    const topicNameFinder = new ByValueKey(SyllabusLearnerKeys.topic(topicName));

    try {
        await learner.flutterDriver?.waitFor(topicNameFinder);
        return true;
    } catch (e) {
        return false;
    }
};

export const teacherSeesStudentHaveEmptyStudyPlanItems = async (teacher: TeacherInterface) => {
    try {
        await teacher.flutterDriver?.waitForAbsent(
            new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemList)
        );
    } catch (e) {
        throw Error("Teacher shouldn't see any study plan item");
    }
};

export const teacherWaitingForStudyPlanListVisible = async (teacher: TeacherInterface) => {
    const finder = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemList);

    await teacher.flutterDriver?.waitFor(finder);
};

export const schoolAdminAddMultipleStudentToCourse = async (
    cms: CMSInterface,
    learners: UserProfileEntity[],
    courseId: string
): Promise<void> => {
    const addMultiStudentIntoCoursePromise = learners.map(async (studentProfile) => {
        const randomLocation = getRandomElement(studentProfile.locations || []);

        return addCoursesForStudent(cms, {
            courseIds: [courseId],
            studentId: studentProfile.id,
            locationId: randomLocation.locationId,
        });
    });

    await Promise.all([addMultiStudentIntoCoursePromise]);
};

/**
 * A definition to add a course to a student
 */
export const schoolAdminAddCourseForStudent = async (
    cms: CMSInterface,
    student: UserProfileEntity,
    courseId: string
): Promise<void> => {
    const randomLocation = getRandomElement(student.locations || []);

    await addCoursesForStudent(cms, {
        courseIds: [courseId],
        studentId: student.id,
        locationId: randomLocation.locationId,
    });

    // A delay for ignore study plan v1 https://manabie.atlassian.net/browse/LT-10559
    // FIXME: Not sure we need this anymore, temporary commented. If it's stable then we can remove this
    // await delay(2500);
    await cms.waitForSkeletonLoading();
};

export const schoolAdminExpandStudyPlan = async (cms: CMSInterface, studentName: string) => {
    // TODO: CMS add later
    const expandedSelector = 'button.MuiButton-contained';
    const expandSelector = 'button.MuiButton-text';

    const studentRow = await cms.page?.waitForSelector(
        `${tableStudyPlanRowCollapse}:has-text("${studentName}")`
    );

    const expanded = await studentRow?.$(expandedSelector);

    if (!expanded) {
        const expand = await studentRow?.waitForSelector(expandSelector);
        await expand?.click();
    }
};

const getStudyPlanTableForStudent = async (cms: CMSInterface, studentName: string) => {
    const element = await cms.page?.waitForSelector(`tr:below(tr:has-text("${studentName}"))`);
    return element;
};

export const schoolAdminSeeStudyPlanInStudent = async (
    cms: CMSInterface,
    studentName: string,
    studyPlanName: string
) => {
    const element = await getStudyPlanTableForStudent(cms, studentName);
    const html = await element?.innerHTML();

    weExpect(
        html,
        `Study plan ${studyPlanName} is not existed in the student ${studentName}`
    ).toContain(studyPlanName);
};

export const schoolAdminNotSeeStudyPlanInStudent = async (
    cms: CMSInterface,
    studentName: string,
    studyPlanName: string
) => {
    const element = await getStudyPlanTableForStudent(cms, studentName);

    const html = await element?.innerHTML();

    weExpect(
        html,
        `Study plan ${studyPlanName} should hidden but it is existed in the student ${studentName}`
    ).not.toContain(studyPlanName);
};

export const schoolAdminChooseStudentStudyPlanTab = async (cms: CMSInterface) => {
    await cms.page?.click(studentStudyPlanTab);
};
