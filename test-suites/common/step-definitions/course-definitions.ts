import { coursesAlias, totalCoursesAlias } from '@user-common/alias-keys/user';

import {
    CMSInterface,
    LearnerInterface,
    ScenarioContextInterface,
    TeacherInterface,
} from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import NsYasuoCourseServiceRequest from '@supports/services/yasuo-course/request-types';

import yasuoCourseService from '@services/yasuo-course';

import { ByValueKey } from 'flutter-driver-x';
import {
    aliasCourseId as aliasCourseIdLesson,
    aliasCourseName as aliasCourseNameLesson,
} from 'step-definitions/alias-keys/lesson';
import { aliasCourseId, aliasCourseName } from 'step-definitions/alias-keys/syllabus';
import {
    courseTab,
    tabInCourseDetail,
    formFilterAdvancedTextFieldSearchInput,
    courseTabletCourseName,
} from 'step-definitions/cms-selectors/cms-keys';
import { LearnerKeys } from 'step-definitions/learner-keys/learner-key';
import { KeyCourseTab } from 'step-definitions/types/common';
import { genId } from 'step-definitions/utils';
import { CourseType } from 'test-suites/squads/architecture/step-definitions/view-course-list-definitions';

export async function createRandomCourses(
    cms: CMSInterface,
    {
        quantity = 1,
        bookIds,
        chapterIds,
    }: {
        quantity: number;
        bookIds?: string[];
        chapterIds?: string[];
    } = { quantity: 1 }
) {
    if (quantity < 1) return { request: [] };

    const token = await cms.getToken();
    const { iconUrl, schoolId } = await cms.getContentBasic();
    const courses: NsYasuoCourseServiceRequest.UpsertCourses[] = [...Array(quantity)].map(() => {
        const id = genId();

        return {
            id,
            name: `Course Name ${id}`,
            displayOrder: 1,
            bookIdsList: bookIds || [],
            chapterIdsList: chapterIds || [],
            icon: iconUrl,
            schoolId,
        };
    });

    return await yasuoCourseService.upsertCourses(token, courses);
}

export const schoolAdminChooseTabInCourseDetail = async (
    cms: CMSInterface,
    tabName: KeyCourseTab
) => {
    const tab = tabInCourseDetail(tabName);

    await cms.selectElementWithinWrapper(courseTab, tab);
    await cms.waitForSkeletonLoading();
};

export async function schoolAdminHasCreatedACourseByGrpc(
    cms: CMSInterface,
    scenario: ScenarioContext
) {
    const { request } = await createRandomCourses(cms, {
        quantity: 1,
    });
    scenario.set(aliasCourseName, request[0].name);
    scenario.set(aliasCourseId, request[0].id);
    // For lesson team
    scenario.set(aliasCourseIdLesson, request[0].id);
    scenario.set(aliasCourseNameLesson, request[0].name);
}

export async function learnerNotSeeNewCourse(leaner: LearnerInterface, courseName: string) {
    try {
        await leaner.flutterDriver!.waitForAbsent(new ByValueKey(LearnerKeys.course(courseName)));
    } catch (e) {
        throw Error(`Course is displayed`);
    }
}

export const teacherGenCourseDetailUrl = async (teacher: TeacherInterface, courseId: string) => {
    const origin = await teacher.flutterDriver?.webDriver?.getUrlOrigin();
    return `${origin}courseDetail?course_id=${courseId}`;
};

export async function schoolAdminGoToCourseDetail(cms: CMSInterface, courseName: string) {
    await cms.instruction(`Search course ${courseName}`, async function (this: CMSInterface) {
        await this.page!.fill(formFilterAdvancedTextFieldSearchInput, courseName);
        await this.page!.keyboard.press('Enter');
        await this.waitForSkeletonLoading();
    });

    await cms.instruction(`Go to course ${courseName} detail`, async function (this: CMSInterface) {
        await this.page!.click(`${courseTabletCourseName}:has-text("${courseName}")`);
        await this.waitingForLoadingIcon();
    });

    await cms.assertThePageTitle(courseName);
}

export async function waitForFetchingCourses(
    cms: CMSInterface,
    context: ScenarioContextInterface['context']
): Promise<{ courses: CourseType[]; totalCourses: number }> {
    const result = await cms.waitForHasuraResponse('Architecture_CoursesList', { timeout: 50000 });

    const courses = result.resp?.data?.courses || [];
    const totalCourses = result.resp?.data?.courses_aggregate?.aggregate?.count || 0;

    context.set(coursesAlias, courses);
    context.set(totalCoursesAlias, totalCourses);

    return { courses, totalCourses };
}
