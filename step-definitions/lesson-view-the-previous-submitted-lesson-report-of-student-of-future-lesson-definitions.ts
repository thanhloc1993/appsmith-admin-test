import { teacherProfileAlias } from '@user-common/alias-keys/user';

import { Page } from 'playwright';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import lessonManagementService from '@supports/services/bob-lesson-management';
import { CreateLessonRequestData } from '@supports/services/bob-lesson-management/bob-lesson-management-service';
import MasterReaderService from '@supports/services/bob-master-data-reader/bob-master-data-reader-service';

import { aliasLessonIdForPreviousReport, aliasStudentInfoList } from './alias-keys/lesson';
import { arrayHasItem, getUsersFromContextByRegexKeys, pick1stElement } from './utils';
import { LessonStatus } from 'manabuf/bob/v1/lessons_pb';
import { LessonTeachingMedium, LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';

export async function viewPreviousReport(cms: CMSInterface) {
    await cms.waitForDataTestId('ButtonPreviousReport__button');
    const page = cms.page!;
    await page.waitForSelector(LessonManagementKeys.previousLessonReport);
    await page.click(LessonManagementKeys.previousLessonReport);
}

export async function createLessonForCurrentStudent(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const cmsToken = await cms.getToken();

    // Setup start/end date
    const startDate = new Date();
    const endDate = new Date();

    startDate.setDate(startDate.getDate() - 2);
    endDate.setDate(endDate.getDate() - 2);

    // Setup teacher info
    const teacherIds = getUsersFromContextByRegexKeys(scenarioContext, teacherProfileAlias).map(
        (teacher) => teacher.id
    );

    // Setup center info
    const { response } = await MasterReaderService.retrieveLowestLocations(cmsToken);
    const locationsList = response?.locationsList || [];

    if (!arrayHasItem(locationsList))
        throw Error('Create lesson error: Can not get locations by GRPC');

    const { locationId: centerId } = pick1stElement(locationsList) || { locationId: '' };

    if (!centerId) throw Error('Create lesson error: Invalid center');

    const studentInfoListList =
        scenarioContext.get<CreateLessonRequestData['studentInfoListList']>(aliasStudentInfoList);

    const lessonRequest: CreateLessonRequestData = {
        startTime: startDate,
        endTime: endDate,
        teacherIdsList: teacherIds,
        centerId,
        materialsList: [],
        studentInfoListList,
        teachingMedium: LessonTeachingMedium.LESSON_TEACHING_MEDIUM_ONLINE,
        teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL,
        classId: '',
        courseId: '',
        schedulingStatus: LessonStatus.LESSON_SCHEDULING_STATUS_DRAFT,
        timeZone: 'Asia/Saigon',
    };
    // Call gRPC
    const lesson = await lessonManagementService.createLesson(cmsToken, lessonRequest);

    scenarioContext.set(aliasLessonIdForPreviousReport, lesson.response?.id);
}

export async function goToNewCreatedLesson(cms: CMSInterface, newLessonId: string) {
    await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');
    const newLessonLink = `/lesson/lesson_management/${newLessonId}/show`;
    await cms.page!.goto(newLessonLink);
}

export async function seePreviousReport(cms: CMSInterface) {
    await cms.waitForDataTestId('DialogWithHeaderFooter__dialogTitle');
    await cms.assertTheDialogTitleByDataTestId(
        'DialogWithHeaderFooter__dialogTitle',
        'Previous Report'
    );
}

export async function viewPreviousReportInEditDialog(page: Page) {
    const wrapper = await page.waitForSelector(
        LessonManagementKeys.lessonManagementIndividualReportUpsertDialog
    );
    const previousReportButton = await wrapper.waitForSelector(
        LessonManagementKeys.previousLessonReport
    );
    await previousReportButton.click();
}
