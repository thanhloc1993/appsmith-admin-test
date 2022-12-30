import {
    aliasCourseName,
    aliasGrade,
    aliasLessonInfo,
    aliasLocationName,
    aliasStudentName,
    aliasTeacherName,
} from '@legacy-step-definitions/alias-keys/lesson';
import {
    schoolAdminApplyFilterAdvanced,
    schoolAdminOpenFilterAdvanced,
} from '@legacy-step-definitions/cms-common-definitions';
import {
    applyFilterAdvancedButton,
    checkStudent,
    tableDeleteButton,
} from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    lessonSaveOnlyThisLessonRadioButton,
    lessonSaveThisAndFollowingRadioButton,
} from '@legacy-step-definitions/cms-selectors/lesson';
import * as LessonManagementKeys from '@legacy-step-definitions/cms-selectors/lesson-management';
import {
    lessonAutocompleteLowestLevelLocations,
    lessonDetailDuration,
    lessonDetailSavingOption,
    lessonDetailTitle,
    lessonInfoCenter,
} from '@legacy-step-definitions/cms-selectors/lesson-management';
import { goToLessonsList } from '@legacy-step-definitions/lesson-delete-lesson-of-lesson-management-definitions';
import { changeTimePicker } from '@legacy-step-definitions/lesson-management-utils';
import { getUsersFromContextByRegexKeys, pick1stElement } from '@legacy-step-definitions/utils';
import { learnerProfileAlias, teacherProfileAlias } from '@user-common/alias-keys/user';
import { footerDialogConfirmButtonSave } from '@user-common/cms-selectors/students-page';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { CreateLessonRequestData } from '@services/bob-lesson-management/bob-lesson-management-service';

import { CreateLessonSavingMethod } from 'manabuf/bob/v1/lessons_pb';
import { aliasRepeatDuration } from 'test-suites/squads/lesson/common/alias-keys';
import {
    lessonLinkByOrderWithTab,
    lessonTableRowWithTab,
    locationLessListWithNth,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { LessonStatusType, LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { createSampleStudentWithPackage } from 'test-suites/squads/lesson/services/student-service/student-service';
import {
    saveLessonUpsertWithCacheLessonId,
    selectTeacher,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import {
    FilteredFieldTitle,
    selectCenterByName,
    selectCourse,
    selectDayOfTheWeek,
    selectGrade,
    selectStartOrEndDate,
    selectStudent,
} from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';
import { selectLessonFirstLesson } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-can-delete-weekly-recurring-lesson-definitions';
import { LessonActionSaveType } from 'test-suites/squads/lesson/types/lesson-management';
import {
    searchLessonByStudentName,
    waitForTableLessonRenderRows,
} from 'test-suites/squads/lesson/utils/lesson-list';

async function selectApplyButtonV2(cms: CMSInterface) {
    const page = cms.page!;
    await page.keyboard.press('Escape');
    await page.waitForSelector(applyFilterAdvancedButton);
    await schoolAdminApplyFilterAdvanced(cms);
    await page.keyboard.press('Escape');
}

export async function changeCenter(
    cms: CMSInterface,
    scenario: ScenarioContext,
    role: AccountRoles
) {
    const data = await createSampleStudentWithPackage({
        cms,
        scenarioContext: scenario,
        studentRole: 'student S2',
        isAddNewLocation: true,
        indexOfGetLocation: 2,
    });

    const locationName = data.student.locations?.[0].name;

    await cms.instruction(
        `${role} has selected locationName ${locationName} weekly recurring `,
        async function () {
            await cms.waitingAutocompleteLoading();
            await selectCenterByName(cms, locationName || '');
        }
    );
}

export async function selectAndApplyFilterLessonInFilterAdvancedV2(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    option: FilteredFieldTitle
) {
    await schoolAdminOpenFilterAdvanced(cms);

    await cms.instruction(`user selects ${option} location name`, async function () {
        const centerName = scenarioContext.get(aliasLocationName);
        await selectCenterByNameWithNth(cms, centerName);
    });

    await selectApplyButtonV2(cms);
}

export async function selectOptionInLessonFilterAdvancedV2(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    option: FilteredFieldTitle
) {
    const lessonInfo = scenarioContext.get<CreateLessonRequestData>(aliasLessonInfo);
    const learners = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);
    const { startTime, endTime } = lessonInfo;

    switch (option) {
        case 'Lesson Start Date':
            await selectStartOrEndDate(cms, `${startTime?.getDate()}`, 'start');
            break;

        case 'Lesson End Date':
            await selectStartOrEndDate(cms, `${endTime?.getDate()}`, 'end');
            break;

        case 'Teacher Name': {
            const teachers = getUsersFromContextByRegexKeys(scenarioContext, teacherProfileAlias);
            const teacherName = pick1stElement(teachers)?.name;

            if (!teacherName) throw Error('There is no teacher name');

            await selectTeacher(cms, teacherName);
            scenarioContext.set(aliasTeacherName, teacherName);
            break;
        }
        case 'Center': {
            const centerName = scenarioContext.get(aliasLocationName);
            await selectCenterByNameWithNth(cms, centerName);
            break;
        }
        case 'Start Time': {
            await changeTimePicker({
                cms,
                timePickerSelector: LessonManagementKeys.filterAdvancedStartTime,
                hour: Number(startTime?.getHours()),
                minute: Number(startTime?.getMinutes()),
            });
            break;
        }
        case 'End Time': {
            await changeTimePicker({
                cms,
                timePickerSelector: LessonManagementKeys.filterAdvancedEndTime,
                hour: Number(endTime?.getHours()),
                minute: Number(endTime?.getMinutes()),
            });
            break;
        }
        case 'Student Name': {
            const studentName = pick1stElement(learners)?.name;
            if (!studentName) throw Error('There is no name of student');

            await selectStudent(cms, studentName);
            scenarioContext.set(aliasStudentName, studentName);
            break;
        }
        case 'Grade': {
            const grade = pick1stElement(learners)?.gradeValue;
            if (!grade) throw Error('There is no grade of student');

            await selectGrade(cms, grade);
            scenarioContext.set(aliasGrade, grade);
            break;
        }
        case 'Lesson day of the week': {
            if (!startTime) throw Error('There is no lesson start time');
            await selectDayOfTheWeek(cms, scenarioContext, Number(startTime.getDay()) + 1);
            break;
        }

        case 'Course':
        default: {
            const courseName = scenarioContext.get(aliasCourseName);
            await selectCourse(cms, courseName);
            break;
        }
    }
}

export async function selectCenterByNameWithNth(cms: CMSInterface, centerName: string) {
    const page = cms.page!;
    await cms.instruction(`Filter center with ${centerName}`, async function () {
        await page.click(LessonManagementKeys.locationsLowestLevelAutocompleteWithNth(1));
        await page.fill(lessonAutocompleteLowestLevelLocations, centerName);
    });

    await cms.instruction(`Choose student with ${centerName}`, async function () {
        await cms.waitingAutocompleteLoading();
        await cms.chooseOptionInAutoCompleteBoxByOrder(1);
    });
}

export async function removeAllStudent(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction('Select all student', async function () {
        await page.click(LessonManagementKeys.checkboxSelectAll);
    });

    await cms.instruction('Remove all student', async function () {
        await page.click(tableDeleteButton);
    });
}

export async function saveRecurringLessonWithOption({
    cms,
    method,
    lessonActionSave = 'Published',
    scenarioContext,
}: {
    cms: CMSInterface;
    method: CreateLessonSavingMethod;
    lessonActionSave?: LessonActionSaveType;
    scenarioContext: ScenarioContext;
}) {
    await saveLessonUpsertWithCacheLessonId(cms, lessonActionSave, scenarioContext);

    if (method === CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE) {
        await cms.selectElementByDataTestId(lessonSaveThisAndFollowingRadioButton);
    } else {
        await cms.selectElementByDataTestId(lessonSaveOnlyThisLessonRadioButton);
    }

    await cms.confirmDialogAction();
}

export async function updateCenterStudent({
    cms,
    studentName,
}: {
    cms: CMSInterface;
    studentName: string;
}) {
    const page = cms.page!;

    await page.fill(LessonManagementKeys.lessonFormFilterAdvancedTextFieldInput, studentName);

    await page.keyboard.press('Enter');

    const isCheckStudent = await page.locator(checkStudent).isChecked();

    if (!isCheckStudent) {
        await page.click(checkStudent);
    }
    await page.click(footerDialogConfirmButtonSave);
}

export async function goToDetailFirstLesson({
    cms,
    role,
    studentName,
    lessonTime,
}: {
    cms: CMSInterface;
    role: AccountRoles;
    studentName: string;
    lessonTime: LessonTimeValueType;
}) {
    await cms.instruction(`${role} go to lesson list`, async function () {
        await goToLessonsList(cms, lessonTime);
    });
    await cms.instruction('See the new lesson on CMS', async function () {
        await searchLessonByStudentName({ cms, studentName, lessonTime });

        await waitForTableLessonRenderRows(cms, lessonTime);

        await selectLessonFirstLesson(cms, lessonTime);
    });
}

export async function assertBreakRecurringChain({
    cms,
    role,
    studentName,
    lessonTime,
    countBreakChain,
}: {
    cms: CMSInterface;
    role: AccountRoles;
    studentName: string;
    lessonTime: LessonTimeValueType;
    countBreakChain: number;
}) {
    await cms.instruction(`${role} go to lesson list`, async function () {
        await goToLessonsList(cms, lessonTime);
    });
    await cms.instruction('See the new lesson on CMS', async function () {
        await searchLessonByStudentName({ cms, studentName, lessonTime });

        await waitForTableLessonRenderRows(cms, lessonTime);
        const row = await cms.page!.locator(lessonTableRowWithTab(lessonTime)).count();
        weExpect(row, 'Assert list lesson break recurring chain').toEqual(countBreakChain);
    });
}

export async function assertDetailLessonChangeSavingOption({
    cms,
    role,
    studentName,
    lessonTime,
    savingOptionExpect,
}: {
    cms: CMSInterface;
    role: AccountRoles;
    studentName: string;
    lessonTime: LessonTimeValueType;
    savingOptionExpect: 'One Time' | 'Weekly Recurring';
}) {
    await goToDetailFirstLesson({ cms, role, studentName, lessonTime });
    await cms.instruction('Assert lesson type equal to One Time', async function () {
        const savingOption = await cms.page!.textContent(lessonDetailSavingOption);

        weExpect(savingOption, 'Updated saving option').toEqual(savingOptionExpect);
    });
}

export async function assertLocationUpdatedInLessonDetail(
    cms: CMSInterface,
    locationName?: string
) {
    const locationContent = await cms.page!.textContent(lessonInfoCenter);

    await cms.instruction('Assert location updated', async function () {
        weExpect(locationName, `Location has updated is ${locationName}`).toEqual(locationContent);
    });
}
export async function assertLocationUpdatedInLessonList(params: {
    cms: CMSInterface;
    locationName?: string;
    indexNth: number;
    lessonTime: LessonTimeValueType;
}) {
    const { cms, locationName, indexNth, lessonTime } = params;
    const locationContent = await cms.page!.textContent(
        locationLessListWithNth(lessonTime, indexNth)
    );

    await cms.instruction('Assert location updated', async function () {
        weExpect(locationName, `Location has updated is ${locationName}`).toEqual(locationContent);
    });
}

export async function assertLocationName({
    cms,
    locationName,
}: {
    cms: CMSInterface;
    locationName: string;
}) {
    await cms.waitForSelectorHasText(lessonInfoCenter, locationName);
    const locationDetail = await cms.page!.textContent(lessonInfoCenter);
    weExpect(
        locationDetail,
        'Location name in details equal to location updated in the edit page'
    ).toEqual(locationName);
}

export async function assertLessonDateBreakChain({
    cms,
    role,
    studentName,
    lessonTime,
}: {
    cms: CMSInterface;
    role: AccountRoles;
    studentName: string;
    lessonTime: LessonTimeValueType;
}) {
    await goToDetailFirstLesson({ cms, role, studentName, lessonTime });

    await assertDetailLessonChangeSavingOption({
        cms,
        role,
        studentName,
        lessonTime,
        savingOptionExpect: 'Weekly Recurring',
    });

    await assertLessonDate(cms);
}

export async function assertLessonDate(cms: CMSInterface) {
    const duration = await cms.page!.textContent(lessonDetailDuration);

    const content = await cms.page!.textContent(lessonDetailTitle);

    const isEqualDuration = duration?.toString().includes(content!.toString());
    weExpect(isEqualDuration).toEqual(true);
}

export async function goToDetailLessonRecurringChainByIndex(params: {
    cms: CMSInterface;
    role: AccountRoles;
    studentName: string;
    lessonTime: LessonTimeValueType;
    lessonStatus: LessonStatusType;
    indexGoTo: number;
}) {
    const { cms, lessonTime, role, studentName, lessonStatus, indexGoTo } = params;
    await cms.instruction(
        `Go to lesson management and change to tab ${lessonStatus} lessons list`,
        async function () {
            await goToLessonsList(cms, lessonTime);
        }
    );

    await cms.instruction(`${role} go to lesson list`, async function () {
        await goToLessonsList(cms, lessonTime);
    });

    await cms.instruction('See the new lesson on CMS', async function () {
        await searchLessonByStudentName({ cms, studentName, lessonTime });

        await waitForTableLessonRenderRows(cms, lessonTime);
    });

    await cms.instruction(`Go to lesson ${indexGoTo} in recurring chain`, async function () {
        await cms.page!.locator(lessonLinkByOrderWithTab(indexGoTo, lessonTime)).click();
    });

    await cms.waitForSkeletonLoading();
    await cms.waitingForLoadingIcon();
}

export async function assertLocationUpdatedFromEditedLesson(params: {
    cms: CMSInterface;
    startIndex: number;
    endIndex: number;
    role: AccountRoles;
    studentName: string;
    lessonTime: LessonTimeValueType;
    lessonStatus: LessonStatusType;
    locationName?: string;
}) {
    const { cms, endIndex, startIndex, role, lessonTime, studentName, lessonStatus, locationName } =
        params;

    await cms.instruction(
        `Go to lesson management and change to tab ${lessonStatus} lessons list`,
        async function () {
            await goToLessonsList(cms, lessonTime);
        }
    );

    await cms.instruction(`${role} go to lesson list`, async function () {
        await goToLessonsList(cms, lessonTime);
    });

    await cms.instruction('See the new lesson on CMS', async function () {
        await searchLessonByStudentName({ cms, studentName, lessonTime });

        await waitForTableLessonRenderRows(cms, lessonTime);
    });

    for (let i = startIndex; i <= endIndex; i++) {
        await cms.instruction(
            `Assert lesson status with ${lessonStatus} on tab ${lessonTime} of index ${i}`,
            async function () {
                await assertLocationUpdatedInLessonList({
                    cms,
                    locationName,
                    lessonTime,
                    indexNth: i,
                });
            }
        );
    }
}

export async function assertRepeatDuration(cms: CMSInterface, repeatDuration: string) {
    await cms.waitForSkeletonLoading();
    const repeatDurationContent = await cms.page!.locator(lessonDetailDuration).innerText();
    weExpect(repeatDuration, `Repeat Duration is ${repeatDuration}`).toEqual(repeatDurationContent);
}

export async function assertRepeatDurationRecurringChain(params: {
    cms: CMSInterface;
    startIndex: number;
    endIndex: number;
    role: AccountRoles;
    studentName: string;
    lessonTime: LessonTimeValueType;
    lessonStatus: LessonStatusType;
    scenario: ScenarioContext;
}) {
    const { cms, endIndex, startIndex, role, lessonTime, studentName, lessonStatus, scenario } =
        params;

    const repeatDuration = scenario.get(aliasRepeatDuration);

    for (let i = startIndex; i <= endIndex; i++) {
        await cms.instruction(
            `Assert lesson status with ${lessonStatus} on tab ${lessonTime} of index ${i}`,
            async function () {
                await goToDetailLessonRecurringChainByIndex({
                    cms,
                    role,
                    lessonTime,
                    studentName,
                    indexGoTo: i,
                    lessonStatus,
                });

                await assertRepeatDuration(cms, repeatDuration);
            }
        );
    }
}
