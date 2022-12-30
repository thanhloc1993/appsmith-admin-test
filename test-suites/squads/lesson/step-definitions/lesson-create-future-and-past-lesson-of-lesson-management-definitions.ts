import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';
import {
    brightcoveUploadInput,
    formFilterAdvancedTextFieldSearchInput,
    tableEmptyMessageV2,
} from '@legacy-step-definitions/cms-selectors/cms-keys';
import { uploadMaterialInput } from '@legacy-step-definitions/cms-selectors/lesson';
import { learnerGoToLesson } from '@legacy-step-definitions/lesson-learner-join-lesson-definitions';
import {
    teacherSeesLessonInActiveListOnTeacherApp,
    teacherSeesLessonInCompletedListOnTeacherApp,
} from '@legacy-step-definitions/lesson-live-icon-on-teacher-app-definitions';
import { createSampleStudentWithCourseAndEnrolledStatus } from '@legacy-step-definitions/lesson-management-utils';
import { goToCourseDetailOnTeacherAppByCourseId } from '@legacy-step-definitions/lesson-teacher-verify-lesson-definitions';
import {
    getFileNameByFilePath,
    getMediaIdsAfterSubmitLesson,
    waitBrighcoveResponse,
    waitConvertMediaResponse,
    waitCreateBrightcoveUpload,
    waitFinishBrightcoveUpload,
    waitResumableURLResponse,
    waitUpsertMediaResponse,
} from '@legacy-step-definitions/lesson-utils';
import { arrayHasItem, toArr } from '@legacy-step-definitions/utils';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Response } from 'playwright';

import { CMSInterface, LearnerInterface, TeacherInterface, Tenant } from '@supports/app-types';
import { brightCoveSampleLink } from '@supports/constants';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder/grpc-message-decoder';
import { ScenarioContext } from '@supports/scenario-context';

import {
    LessonActionSaveType,
    LessonManagementLessonTime,
    LessonUpsertFields,
    TeachingMedium,
    TeachingMethod,
} from '../types/lesson-management';
import { MaterialFile } from '../types/material';
import { openAddStudentInfoDialog, saveLessonWithStatus } from '../utils/lesson-upsert';
import {
    selectDateAndTimeOfFutureV2,
    selectDateAndTimeOfPastV2,
    selectStudentSubscriptionV2,
} from './lesson-create-an-individual-lesson-definitions';
import { ByValueKey, delay } from 'flutter-driver-x';
import { CreateLessonResponse } from 'manabuf/bob/v1/lessons_pb';
import { ResumableUploadURLResponse } from 'manabuf/bob/v1/uploads_pb';
import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { GetBrightCoveVideoInfoResponse } from 'manabuf/yasuo/v1/brightcove_pb';
import {
    aliasCourseIdByStudent,
    aliasLessonId,
    aliasLessonIdByLessonName,
    aliasLessonName,
    aliasLessonTime,
    aliasLocationId,
    aliasPDFUploadedURL,
    aliasStudentInfoList,
    aliasTeacherName,
} from 'step-definitions/alias-keys/lesson';
import { LessonManagementLessonName } from 'step-definitions/lesson-default-sort-future-lessons-list-definitions';
import { saveLessonInfoByLessonName } from 'step-definitions/lesson-multi-tenant-create-future-and-past-lesson-definitions';
import {
    aliasMaterialId,
    aliasMaterialName,
    aliasStartDate,
} from 'test-suites/squads/lesson/common/alias-keys';
import {
    alertMessageLessonCenterV3,
    alertMessageLessonStudentsV2,
    alertMessageLessonTeachersV3,
    alertMessageOfStartEndTime,
    checkBoxOfTableRowStudentSubscriptionsV2,
    dialogStudentSubscriptions,
    endTimeInputV3,
    lessonDateV3,
    lessonManagementLessonSubmitButton,
    lessonManagementList,
    LessonManagementListTabNames,
    locationsLowestLevelAutocompleteInputV3,
    locationsLowestLevelAutocompleteV3,
    recordStudentSubscriptionTableCheckBox,
    selectedTabOnTabList,
    startTimeInputV3,
    tableAddStudentSubscriptionAddButtonV2,
    tableAddStudentSubscriptionCancelButton,
    tableStudentSubscriptionAddActionV2,
    teachingMethodRadioButton,
    lessonFilterAdvancedSearchInput,
    upsertLessonFormV3,
    assertAlertMessageRequiredField,
    teacherAutocompleteFilterInputV2,
    teacherAutocompleteInputV3,
    locationsAutocompleteClearButton,
    lessonManagementLessonSubmitDraftButton,
    lessonOnListWithDataValueTab,
    uploadMaterialButton,
} from 'test-suites/squads/lesson/common/cms-selectors';
import {
    createLessonLessonMgmt,
    updateLessonLessonMgmt,
} from 'test-suites/squads/lesson/common/endpoints';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { createSampleStudentWithPackage } from 'test-suites/squads/lesson/services/student-service/student-service';
import { selectCenterByName } from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';
import { changeTimeLesson } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-cannot-edit-weekly-recurring-individual-lesson-definitions';
import {
    searchLessonByStudentName as searchLessonByStudentNameUtil,
    waitForTableLessonRenderRows,
} from 'test-suites/squads/lesson/utils/lesson-list';
import {
    changeLessonDateToTomorrow,
    changeLessonDateToYesterday,
} from 'test-suites/squads/lesson/utils/lesson-management';
import { selectTeachingMedium } from 'test-suites/squads/lesson/utils/lesson-upsert';
import { parseCreateLessonResponse } from 'test-suites/squads/timesheet/step-definitions/auto-create-not-created-by-draft-lessons-definition';
import { createARandomStaffFromGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-staff-definitions';
import { retry } from 'ts-retry-promise';

export async function openCreateLessonPage(cms: CMSInterface) {
    await cms.page!.getByRole('button', { name: 'create' }).click();
}

export async function changeLessonTimeToMorning(cms: CMSInterface) {
    const page = cms.page!;

    const currentStartTime = await page.inputValue(startTimeInputV3);
    const currentEndTime = await page.inputValue(endTimeInputV3);
    const atTheMorning = currentStartTime === '07:00' || currentEndTime === '09:00';

    if (!atTheMorning) {
        await cms.instruction('Select time from 07:00 to 09:00', async function () {
            await changeTimeLesson(cms, '07:00', '09:00');
        });
    }
}

export async function changeLessonTimeToEndOfDay(cms: CMSInterface) {
    const page = cms.page!;

    const currentStartTime = await page.inputValue(startTimeInputV3);
    const currentEndTime = await page.inputValue(endTimeInputV3);
    const atTheEndOfDay = currentStartTime === '23:30' || currentEndTime === '23:45';

    if (!atTheEndOfDay) {
        await cms.instruction('Select time from 23:45 to 23:45', async function () {
            await changeTimeLesson(cms, '23:30', '23:45');
        });
    }
}

export async function selectDateAndTimeOfFuture(cms: CMSInterface) {
    await changeLessonDateToTomorrow(cms);
    await changeLessonTimeToMorning(cms);
}

export async function selectDateAndTimeOfPast(cms: CMSInterface) {
    await changeLessonDateToYesterday(cms);
    await changeLessonTimeToEndOfDay(cms);
}

export async function selectTeachingMethod(cms: CMSInterface, teachingMethod?: TeachingMethod) {
    const defaultTeachingMethod: TeachingMethod = 'LESSON_TEACHING_METHOD_INDIVIDUAL';
    const desireTeachingMethod = teachingMethodRadioButton(teachingMethod || defaultTeachingMethod);

    await cms.page!.click(desireTeachingMethod);
}

export async function selectTeacherFormFilter(cms: CMSInterface, teacherName?: string) {
    const page = cms.page!;

    const teacherInput = await page.waitForSelector(teacherAutocompleteFilterInputV2);

    await teacherInput.click();

    if (teacherName) {
        await cms.instruction(`Select teacher ${teacherName}`, async function () {
            await teacherInput.fill(teacherName);
            await cms.waitingAutocompleteLoading();
            await cms.chooseOptionInAutoCompleteBoxByText(teacherName);
        });
    } else {
        const randomOrder = Math.floor(Math.random() * 3 + 1);
        await cms.instruction(
            `Select teacher at position ${randomOrder} on list`,
            async function () {
                await cms.chooseOptionInAutoCompleteBoxByOrder(randomOrder);
            }
        );
    }

    await page.keyboard.press('Escape');
}

export async function selectTeacher(cms: CMSInterface, teacherName?: string) {
    const page = cms.page!;

    const teacherInput = await page.waitForSelector(teacherAutocompleteInputV3);

    await teacherInput.click();

    if (teacherName) {
        await cms.instruction(`Select teacher ${teacherName}`, async function () {
            await teacherInput.fill(teacherName);
            await cms.waitingAutocompleteLoading();
            await cms.chooseOptionInAutoCompleteBoxByText(teacherName);
        });
    } else {
        const randomOrder = Math.floor(Math.random() * 3 + 1);
        await cms.instruction(
            `Select teacher at position ${randomOrder} on list`,
            async function () {
                await cms.chooseOptionInAutoCompleteBoxByOrder(randomOrder);
            }
        );
    }

    await page.keyboard.press('Escape');
}

export async function selectCenterByPosition(cms: CMSInterface, centerPosition = 1) {
    await cms.page!.click(locationsLowestLevelAutocompleteV3);
    await cms.chooseOptionInAutoCompleteBoxByOrder(centerPosition);
}

export async function openDialogAddStudentSubscription(cms: CMSInterface) {
    await cms.instruction('Open dialog student subscriptions', async function () {
        await cms.page!.click(tableStudentSubscriptionAddActionV2);
        await cms.waitForDataTestId(dialogStudentSubscriptions);
        await cms.waitForSkeletonLoading();
    });
}

export async function selectStudentSubscription(params: {
    cms: CMSInterface;
    studentName?: string;
    studentSubscriptionId?: string;
}) {
    const { cms, studentName, studentSubscriptionId } = params;
    const page = cms.page!;

    await openAddStudentInfoDialog({ cms, type: 'STANDARD' });
    if (studentName) {
        await cms.instruction(`Searching student ${studentName}`, async function () {
            await page.fill(formFilterAdvancedTextFieldSearchInput, studentName);
            await Promise.all([
                cms.waitForHasuraResponse('StudentsMany'),
                cms.waitForHasuraResponse('CoursesMany'),
                page.keyboard.press('Enter'),
            ]);
        });
    }

    await cms.instruction('Select student subscription', async function () {
        const targetCheckbox = studentSubscriptionId
            ? recordStudentSubscriptionTableCheckBox(studentSubscriptionId)
            : checkBoxOfTableRowStudentSubscriptionsV2;

        await page.click(targetCheckbox, { timeout: 5000 });
    });

    await cms.instruction('Add student subscription', async function () {
        await page.click(tableAddStudentSubscriptionAddButtonV2);
    });
}

export function areMissingFieldsNotEqualToCertainField(
    missingFields: LessonUpsertFields[],
    checkedString: LessonUpsertFields
): boolean {
    return missingFields.every((field) => field !== checkedString);
}

export async function fillUpsertFormLessonOfLessonManagement(params: {
    cms: CMSInterface;
    teacherName: string;
    studentName: string;
    centerName: string;
    missingFields: LessonUpsertFields[];
}) {
    const { cms, teacherName, studentName, centerName, missingFields } = params;

    if (
        areMissingFieldsNotEqualToCertainField(missingFields, 'start time') &&
        areMissingFieldsNotEqualToCertainField(missingFields, 'end time')
    ) {
        await changeTimeLesson(cms, '00:00', '11:45');
    }

    if (areMissingFieldsNotEqualToCertainField(missingFields, 'teaching medium')) {
        await selectTeachingMedium(cms, 'LESSON_TEACHING_MEDIUM_ONLINE');
    }

    if (areMissingFieldsNotEqualToCertainField(missingFields, 'teaching method')) {
        await selectTeachingMethod(cms, 'LESSON_TEACHING_METHOD_INDIVIDUAL');
    }

    if (areMissingFieldsNotEqualToCertainField(missingFields, 'teacher')) {
        await selectTeacher(cms, teacherName);
    }

    if (areMissingFieldsNotEqualToCertainField(missingFields, 'center')) {
        await selectCenterByName(cms, centerName);
    }

    if (areMissingFieldsNotEqualToCertainField(missingFields, 'student')) {
        await selectStudentSubscription({ cms, studentName });
    }
}

export async function assertAlertMessageLessonStartEndTime(cms: CMSInterface) {
    await delay(1000); // Wait for display alert message
    const alertMessages = await cms.page!.$$(alertMessageOfStartEndTime);
    weExpect(alertMessages).toHaveLength(2);
}

export async function assertAlertMessageLessonEndDate(cms: CMSInterface) {
    await delay(1000);
    await cms.page!.waitForSelector(assertAlertMessageRequiredField);
}

export async function assertAlertMessageLessonCenter(cms: CMSInterface) {
    await delay(1000); // Wait for display alert message
    await cms.page!.waitForSelector(alertMessageLessonCenterV3);
}

export async function assertAlertMessageLessonCenterV3(cms: CMSInterface) {
    await delay(1000); // Wait for display alert message
    await cms.page!.waitForSelector(alertMessageLessonCenterV3);
}

export async function assertAlertMessageLessonTeachers(cms: CMSInterface) {
    await delay(1000); // Wait for display alert message
    await cms.page!.waitForSelector(alertMessageLessonTeachersV3);
}

export async function assertAlertMessageLessonTeachersV3(cms: CMSInterface) {
    await delay(1000); // Wait for display alert message
    await cms.page!.waitForSelector(alertMessageLessonTeachersV3);
}

export async function assertAlertMessageLessonStudents(cms: CMSInterface) {
    await delay(1000); // Wait for display alert message
    await cms.page!.waitForSelector(alertMessageLessonStudentsV2);
}

export async function assertAlertMessageLessonUpsertRequiredField(
    cms: CMSInterface,
    missingField: LessonUpsertFields
) {
    switch (missingField) {
        case 'end date': {
            await assertAlertMessageLessonEndDate(cms);
            break;
        }

        case 'start time': {
            await assertAlertMessageLessonStartEndTime(cms);
            break;
        }

        case 'end time': {
            await assertAlertMessageLessonStartEndTime(cms);
            break;
        }

        case 'center': {
            await assertAlertMessageLessonCenter(cms);
            break;
        }

        case 'teacher': {
            await assertAlertMessageLessonTeachers(cms);
            break;
        }

        case 'student':
        default: {
            await assertAlertMessageLessonStudents(cms);
            break;
        }
    }
}

export async function triggerSubmitLesson(cms: CMSInterface) {
    await cms.page!.click(lessonManagementLessonSubmitButton);
}

export async function saveUpdateLessonOfLessonManagement(cms: CMSInterface) {
    await cms.page!.click(lessonManagementLessonSubmitButton);
}

export async function saveLessonUpsertWithCacheLessonId(
    cms: CMSInterface,
    lessonActionSave: LessonActionSaveType,
    scenarioContext: ScenarioContext
) {
    const lessonId = scenarioContext.get(aliasLessonId);

    await cms.instruction(
        `clicks save with ${lessonActionSave} the lesson page`,
        async function () {
            if (!lessonId) {
                const submitButton =
                    lessonActionSave === 'Draft'
                        ? lessonManagementLessonSubmitDraftButton
                        : lessonManagementLessonSubmitButton;

                const [createLessonResponse] = await Promise.all([
                    waitCreateLesson(cms),
                    cms.page!.click(submitButton),
                ]);

                const lessonIdRes = await parseCreateLessonResponse(createLessonResponse);
                scenarioContext.set(aliasLessonId, lessonIdRes);
            } else {
                await saveLessonWithStatus(cms, lessonActionSave);
            }
        }
    );
}

export async function waitCreateLesson(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(createLessonLessonMgmt, { timeout: 200000 });
}

export async function waitUpdateLesson(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(updateLessonLessonMgmt, { timeout: 120000 });
}

export async function saveCreateLessonResponse(
    scenarioContext: ScenarioContext,
    response: Response,
    lessonName?: LessonManagementLessonName
) {
    const decoder = createGrpcMessageDecoder(CreateLessonResponse);
    const encodedResponseText = await response.text();
    const decodedResponse = decoder.decodeMessage(encodedResponseText);

    const { id: lessonId } = decodedResponse?.toObject() || { id: '' };
    scenarioContext.set(aliasLessonId, lessonId);
    scenarioContext.set(aliasLessonName, '');

    lessonName && scenarioContext.set(aliasLessonIdByLessonName(lessonName), lessonId);
}

export async function isOnLessonUpsertDialog(cms: CMSInterface) {
    await cms.page!.waitForSelector(upsertLessonFormV3);
}

export async function isOnLessonListPage(cms: CMSInterface) {
    await cms.waitForDataTestId(lessonManagementList);
}

export async function assertLessonListByLessonTime(
    cms: CMSInterface,
    lessonTime: LessonManagementLessonTime
) {
    const page = cms.page!;
    await delay(1000); // Wait for change lesson tab list after create lesson

    const selectedTab = await page.textContent(selectedTabOnTabList);

    const desireSelectedLessonList =
        lessonTime === 'future'
            ? LessonManagementListTabNames.FUTURE_LESSONS
            : LessonManagementListTabNames.PAST_LESSONS;

    weExpect(selectedTab).toEqual(desireSelectedLessonList);
}

// TODO: Remove this function from lesson-multi-tenant-submit-and-save-draft-lesson-report-definitions.ts
export async function searchLessonByStudentName(
    cms: CMSInterface,
    studentName: string,
    lessonTime?: LessonTimeValueType
) {
    await cms.instruction(`Searching lesson by student name: ${studentName}`, async function () {
        const page = cms.page!;
        await page.fill(lessonFilterAdvancedSearchInput(lessonTime || 'future'), studentName);
        await page.keyboard.press('Enter');
    });
}

export async function assertSeeLessonOnCMS(params: {
    cms: CMSInterface;
    lessonId: string;
    studentName: string;
    shouldSeeLesson?: boolean;
    lessonTime?: LessonTimeValueType;
}) {
    const { cms, lessonId, studentName, shouldSeeLesson = true, lessonTime = 'future' } = params;
    const page = cms.page!;

    await cms.page!.waitForTimeout(2000);

    await searchLessonByStudentNameUtil({ cms, studentName, lessonTime });

    if (shouldSeeLesson) {
        await waitForTableLessonRenderRows(cms, lessonTime);
        await page.waitForSelector(lessonOnListWithDataValueTab(lessonId, lessonTime));
        return;
    }

    await page.waitForSelector(tableEmptyMessageV2);
}

export async function assertToSeeTheLessonOnTeacherApp(params: {
    teacher: TeacherInterface;
    lessonTime: LessonManagementLessonTime;
    courseId: string;
    lessonId: string;
    lessonName: string;
    lessonItemShouldDisplay?: boolean;
}) {
    const {
        teacher,
        lessonTime,
        courseId,
        lessonId,
        lessonName,
        lessonItemShouldDisplay = true,
    } = params;

    await teacher.instruction('Go to the course of the lesson', async function () {
        await goToCourseDetailOnTeacherAppByCourseId(teacher, courseId);
    });

    switch (lessonTime) {
        case 'future': {
            await teacher.instruction('Assert lesson is visible', async function () {
                await teacherSeesLessonInActiveListOnTeacherApp(
                    teacher,
                    lessonId,
                    lessonName,
                    lessonItemShouldDisplay
                );
            });
            return;
        }

        case 'now': {
            await teacher.instruction('Assert lesson is visible', async function () {
                await teacherSeesLessonInActiveListOnTeacherApp(
                    teacher,
                    lessonId,
                    lessonName,
                    lessonItemShouldDisplay
                );
            });
            return;
        }

        case 'past':
        default: {
            await teacher.instruction('Assert lesson is visible', async function () {
                await teacherSeesLessonInCompletedListOnTeacherApp(
                    teacher,
                    lessonId,
                    lessonName,
                    lessonItemShouldDisplay
                );
            });
            return;
        }
    }
}

export async function assertToSeeNewLessonOnLearnerApp(
    learner: LearnerInterface,
    lessonId: string,
    shouldDisplayLessonItem = true
) {
    const driver = learner.flutterDriver!;

    await learner.instruction('Go to the course of the lesson', async function () {
        await learnerGoToLesson(learner);
    });

    await learner.instruction('Assert lesson is visible', async function () {
        const lesson = new ByValueKey(VirtualClassroomKeys.liveLessonItem(lessonId, ''));

        if (shouldDisplayLessonItem) await driver.waitFor(lesson);
        else await driver.waitForAbsent(lesson);
    });
}

export async function clearLessonField(cms: CMSInterface, lessonField: LessonUpsertFields) {
    const page = cms.page!;

    switch (lessonField) {
        case 'center': {
            const [centerAutocompleteInput, centerAutocompleteClearButton] = [
                locationsLowestLevelAutocompleteInputV3,
                locationsAutocompleteClearButton,
            ];

            await page.hover(centerAutocompleteInput);
            await page.click(centerAutocompleteClearButton);

            const centerValue = await page.inputValue(centerAutocompleteInput);
            weExpect(centerValue).toEqual('');
            return;
        }

        default:
            // Currently only clear center
            return;
    }
}

export type LessonMaterialSingleType = 'pdf' | 'video' | 'brightcove video';
export type LessonMaterialMultipleType = 'pdf 1' | 'pdf 2' | 'video 1' | 'video 2';
export type LessonMaterial = LessonMaterialSingleType | LessonMaterialMultipleType;

export type StudentInfo = {
    studentName: string;
    studentId: string;
    courseId: string;
    locationId: string;
    locationName: string;
};

export function getStudentInfoByUserProfile(
    scenarioContext: ScenarioContext,
    userProfile: UserProfileEntity
): StudentInfo {
    const { id: studentId, name: studentName, locations } = userProfile;

    if (!locations || !arrayHasItem(locations)) {
        throw Error('There is no location of student');
    }

    const courseId = scenarioContext.get(aliasCourseIdByStudent(studentId));

    const { locationId, name: locationName } = locations[0];

    const studentInfo: StudentInfo = {
        courseId,
        studentId,
        studentName,
        locationId,
        locationName,
    };

    return studentInfo;
}

function getLessonMaterialFilePath(type: LessonMaterial) {
    switch (type) {
        case 'pdf':
        case 'pdf 1':
            return './assets/lesson-sample-pdf-1.pdf';

        case 'pdf 2':
            return './assets/lesson-sample-pdf-2.pdf';

        case 'video':
        case 'video 1':
            return './assets/lesson-sample-video-1.mp4';

        case 'video 2':
            return './assets/lesson-sample-video-2.mp4';

        default:
            return '';
    }
}

async function saveLessonMediaIds(
    scenarioContext: ScenarioContext,
    materials: LessonMaterial[],
    mediaIdsResponse: Response
) {
    const materialsUpload = materials.filter((material) => material !== 'brightcove video');
    const mediaIds = await getMediaIdsAfterSubmitLesson(mediaIdsResponse, materialsUpload.length);

    materials.forEach((material, index) => {
        scenarioContext.set(aliasMaterialId[material], mediaIds[index]);
    });
}

async function uploadBrightcoveVideoLessonOfLessonManagement(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    await cms.instruction(
        'Upload bright cove link then save upload information',
        async function () {
            const page = cms.page!;
            await page.fill(brightcoveUploadInput, brightCoveSampleLink);

            const [brightcoveResponse] = await Promise.all([
                waitBrighcoveResponse(cms),
                waitUpsertMediaResponse(cms),
                cms.selectAButtonByAriaLabel('Upload'),
            ]);

            const decoder = createGrpcMessageDecoder(GetBrightCoveVideoInfoResponse);
            const encodedResponseText = await brightcoveResponse.text();
            const decodedResponse = decoder.decodeMessage(encodedResponseText);

            scenarioContext.set(
                aliasMaterialName['brightcove video'],
                decodedResponse?.toObject()?.name
            );
        }
    );
}

export async function addMaterialToLesson(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    type: LessonMaterial;
}) {
    const { cms, scenarioContext, type } = params;
    const page = cms.page!;

    if (type === 'brightcove video') {
        await uploadBrightcoveVideoLessonOfLessonManagement(cms, scenarioContext);
        return;
    }

    await cms.instruction(`User add ${type} material to lesson`, async function () {
        const filePath = getLessonMaterialFilePath(type);
        const fileName = getFileNameByFilePath(filePath);

        scenarioContext.set(aliasMaterialName[type], fileName);
        await page.locator(uploadMaterialButton).scrollIntoViewIfNeeded();
        await page.setInputFiles(uploadMaterialInput, filePath);
    });
}

export async function savePDFResumableUrl(scenario: ScenarioContext, urlResponse: Response) {
    const decoderUrl = createGrpcMessageDecoder(ResumableUploadURLResponse);
    const encodedResponseTextUrl = await urlResponse.text();
    const decodedResponseUrl = decoderUrl.decodeMessage(encodedResponseTextUrl);

    scenario.set(aliasPDFUploadedURL, decodedResponseUrl?.toObject().downloadUrl);
}

export async function submitLessonOfLessonManagement(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonActionSave: LessonActionSaveType,
    lessonName?: LessonManagementLessonName
) {
    const [createLessonResponse] = await Promise.all([
        waitCreateLesson(cms),
        saveLessonWithStatus(cms, lessonActionSave),
    ]);

    await saveCreateLessonResponse(scenarioContext, createLessonResponse, lessonName);
}

export async function submitLessonOfLessonManagementWithMaterials(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    lessonActionSave: LessonActionSaveType;
    lessonName?: LessonManagementLessonName;
    materials: (LessonMaterialSingleType | LessonMaterialMultipleType)[];
    mode: 'CREATE' | 'UPDATE';
}) {
    const { cms, scenarioContext, lessonActionSave, lessonName, materials, mode } = params;
    const materialsUploaded = materials.toString();

    const isUploadPDF = materialsUploaded.includes('pdf');
    const isUploadVideo =
        materialsUploaded.includes('video') && !materialsUploaded.includes('brightcove');

    const isCreateNewLesson = mode === 'CREATE';

    const [mediaIds, resumableURL, , , , , createLessonResponse] = await Promise.all([
        isUploadPDF || isUploadVideo ? waitUpsertMediaResponse(cms) : undefined,

        // For PDF
        isUploadPDF ? waitResumableURLResponse(cms) : undefined,
        isUploadPDF ? waitConvertMediaResponse(cms) : undefined,

        // For video
        isUploadVideo ? waitCreateBrightcoveUpload(cms) : undefined,
        isUploadVideo ? waitFinishBrightcoveUpload(cms) : undefined,

        saveLessonWithStatus(cms, lessonActionSave),
        isCreateNewLesson ? waitCreateLesson(cms) : waitUpdateLesson(cms),
    ]);

    if (mediaIds) await saveLessonMediaIds(scenarioContext, materials, mediaIds);
    if (resumableURL) await savePDFResumableUrl(scenarioContext, resumableURL);
    if (isCreateNewLesson)
        await saveCreateLessonResponse(scenarioContext, createLessonResponse, lessonName);
}

export async function createSampleTeacherForCreateLesson(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
): Promise<UserProfileEntity> {
    const teacher = await createARandomStaffFromGRPC(cms);

    const teacherProfileAliasKey = staffProfileAliasWithAccountRoleSuffix('teacher');
    scenarioContext.set(teacherProfileAliasKey, teacher);

    return teacher;
}

export async function createSampleStudentForCreateLesson(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    teachingMethod: LessonTeachingMethod,
    tenant?: Tenant
): Promise<StudentInfo> {
    if (teachingMethod === LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP) {
        const { student } = await createSampleStudentWithPackage({
            cms,
            scenarioContext,
            tenant,
            studentRole: 'student',
        });

        return getStudentInfoByUserProfile(scenarioContext, student);
    } else {
        const { student } = await createSampleStudentWithCourseAndEnrolledStatus({
            cms,
            scenarioContext,
            tenant,
            studentRole: 'student',
        });

        return getStudentInfoByUserProfile(scenarioContext, student);
    }
}

export async function createIndividualLesson(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    lessonTime?: LessonManagementLessonTime;
    lessonName?: LessonManagementLessonName;
    teacherNames?: string[];
    studentInfos?: StudentInfo[];
    materials?: MaterialFile[];
    tenant?: Tenant;
    teachingMedium?: TeachingMedium;
}) {
    const {
        cms,
        scenarioContext,
        lessonTime = 'now',
        lessonName,
        teacherNames = [],
        studentInfos = [],
        materials,
        tenant,
        teachingMedium = 'LESSON_TEACHING_MEDIUM_ONLINE',
    } = params;

    scenarioContext.set(aliasLessonTime, 'future');

    await cms.instruction('Open create lesson page on CMS', async function () {
        await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');
        await openCreateLessonPage(cms);
    });

    // Setup of teachers
    await cms.instruction('Setup Teachers', async function () {
        await setupTeacher(cms, scenarioContext, teacherNames);
    });

    // Setup for students
    await cms.instruction('Setup Students', async function () {
        await setupStudent({
            cms,
            scenarioContext,
            tenant,
            studentInfos,
            teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL,
        });
    });

    await cms.instruction(`Select lesson date in ${lessonTime}`, async function () {
        await selectLessonDateWithType(cms, scenarioContext);
    });

    // Select teaching medium
    await cms.instruction(
        `Select option ${teachingMedium} in field Teaching Medium`,
        async function () {
            await selectTeachingMedium(cms, teachingMedium);
        }
    );

    // Select teaching method
    await cms.instruction(
        `Select option individual teaching method in field Teaching Method`,
        async function () {
            await selectTeachingMethod(cms, 'LESSON_TEACHING_METHOD_INDIVIDUAL');
        }
    );

    // Add teachers
    await cms.instruction('Select multi teacher', async function () {
        await selectMultiTeacher(cms, scenarioContext);
    });

    // Add students
    await cms.instruction('Select multi student', async function () {
        await selectMultiStudent(cms, scenarioContext);
    });

    const studentsContext: Array<StudentInfo> = scenarioContext.get(aliasStudentInfoList);

    // Select first center of list
    await cms.instruction('Select location', async function () {
        await selectCenterByName(cms, studentsContext[0].locationName);
    });

    scenarioContext.set(aliasLessonName, ''); // Lesson of lesson management has no name
    scenarioContext.set(aliasLocationId, studentsContext[0].locationId);

    await cms.instruction('Submit lesson', async function () {
        await submitLessonWithMaterial({
            cms,
            scenarioContext,
            lessonActionSave: 'Published',
            materials,
            lessonName,
        });
    });

    await cms.instruction('Save Lesson info by lesson name', async function () {
        await saveLessonByLessonName({
            scenarioContext,
            lessonName,
        });
    });
}

export async function selectLessonDateWithType(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const lessonTime: LessonManagementLessonTime = await scenarioContext.get(aliasLessonTime);

    switch (lessonTime) {
        case 'future':
            await cms.instruction(`Select date of ${lessonTime} in future`, async function () {
                await selectDateAndTimeOfFutureV2(cms);
            });
            break;
        case 'now':
            await cms.instruction('Select time from now to 23:45', async function () {
                await selectDateAndTimeOfFutureV2(cms);
            });
            break;
        case 'past':
            await cms.instruction(`Select date of ${lessonTime} in pass`, async function () {
                await selectDateAndTimeOfPastV2(cms);
            });
            break;
        default:
            break;
    }

    const lessonDateInput = await cms.page!.locator(lessonDateV3).inputValue();
    scenarioContext.set(aliasStartDate, lessonDateInput);
}

export async function setupTeacher(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    teacherNames: Array<string>
) {
    const teacherNamesTmp = [...teacherNames];
    if (!arrayHasItem(teacherNames)) {
        const { name: teacherName } = await createSampleTeacherForCreateLesson(
            cms,
            scenarioContext
        );
        teacherNamesTmp.push(teacherName);
    }
    scenarioContext.set(aliasTeacherName, teacherNamesTmp);
}

export async function setupStudent(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    teachingMethod: LessonTeachingMethod;
    tenant?: Tenant;
    studentInfos: Array<StudentInfo>;
}) {
    const { cms, studentInfos, scenarioContext, tenant, teachingMethod } = params;
    const studentInfosTmp = [...studentInfos];
    if (!arrayHasItem(studentInfos)) {
        const studentInfo = await createSampleStudentForCreateLesson(
            cms,
            scenarioContext,
            teachingMethod,
            tenant
        );

        studentInfosTmp.push(studentInfo);
    }
    scenarioContext.set(aliasStudentInfoList, studentInfosTmp);
}

export async function selectMultiTeacher(cms: CMSInterface, scenarioContext: ScenarioContext) {
    const teachers = scenarioContext.get(aliasTeacherName);
    for (const teacherName of teachers) await selectTeacher(cms, teacherName);
}

export async function selectMultiStudent(cms: CMSInterface, scenarioContext: ScenarioContext) {
    const students: Array<StudentInfo> = scenarioContext.get(aliasStudentInfoList);
    for (const student of students) {
        const { studentName, studentId, courseId } = student;

        let addedStudent = false;

        await retry(
            async function () {
                try {
                    await selectStudentSubscriptionV2({
                        cms,
                        studentName,
                        studentSubscriptionId: `${studentId}_${courseId}`,
                    });

                    addedStudent = true;
                } catch {
                    await cms.page!.click(tableAddStudentSubscriptionCancelButton);
                }
            },
            {
                retries: 2,
                delay: 2000,
                until: () => addedStudent,
            }
        ).catch(function (reason) {
            throw new Error(
                `Add student ${JSON.stringify(student.studentName)} into lesson error: ${reason}`
            );
        });
    }
}

export async function submitLessonWithMaterial(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    lessonActionSave: LessonActionSaveType;
    lessonName?: LessonManagementLessonName;
    materials?: MaterialFile[];
}) {
    const { materials, lessonActionSave, lessonName, cms, scenarioContext } = params;
    // Submit lesson without materials
    if (!materials)
        return await submitLessonOfLessonManagement(
            cms,
            scenarioContext,
            lessonActionSave,
            lessonName
        );

    // Add materials & submit lesson
    const cloneMaterials = toArr(materials);

    if (arrayHasItem(cloneMaterials)) {
        for (const material of cloneMaterials) {
            await addMaterialToLesson({ cms, scenarioContext, type: material });
        }
    }

    // Submit lesson with materials
    return await submitLessonOfLessonManagementWithMaterials({
        cms,
        scenarioContext,
        lessonActionSave,
        lessonName,
        materials: cloneMaterials,
        mode: 'CREATE',
    });
}

export async function saveLessonByLessonName(params: {
    lessonName?: LessonManagementLessonName;
    scenarioContext: ScenarioContext;
}) {
    const { lessonName, scenarioContext } = params;

    const lessonTime: LessonManagementLessonTime = scenarioContext.get(aliasLessonTime);
    const teacherNames: Array<string> = scenarioContext.get(aliasTeacherName);
    const studentInfos: Array<StudentInfo> = scenarioContext.get(aliasStudentInfoList);

    if (lessonName)
        return saveLessonInfoByLessonName({
            scenarioContext,
            lessonName,
            lessonTime,
            teacherNames,
            studentInfos,
        });
}
