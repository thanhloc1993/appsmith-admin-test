import { AccountRoles, CMSInterface, IMasterWorld } from '@supports/app-types';

import { saveButton } from './cms-selectors/cms-keys';
import { convertOneOfStringTypeToArray, getCMSInterfaceByRole, randomInteger } from './utils';
import { aliasAttendanceStatusBulkAction } from 'step-definitions/alias-keys/lesson';
import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';
import { AttendanceStatus } from 'step-definitions/lesson-management-utils';

export async function openLessonReportBulkActionUpsertDialog(
    masterWorld: IMasterWorld,
    role: AccountRoles
) {
    const cms = getCMSInterfaceByRole(masterWorld, role);
    await cms.instruction(
        `${role} opens bulk action lesson report upsert dialog`,
        async function () {
            await cms.waitingForLoadingIcon();
            await cms.selectElementByDataTestId(LessonManagementKeys.lessonReportBulkAction);
            await cms.waitForDataTestId(LessonManagementKeys.lessonReportBulkActionUpsertDialog);
        }
    );
}

export async function assertValueAttendanceStatusBulkAction(
    cms: CMSInterface,
    option: AttendanceStatus
) {
    const defaultValueAttendanceStatus = await cms.page?.inputValue(
        LessonManagementKeys.lessonReportBulkActionInputAttendanceStatus
    );

    weExpect(defaultValueAttendanceStatus).toEqual(option);
}

export async function saveBulkAction(cms: CMSInterface): Promise<void> {
    await cms.instruction(`Save Bulk Action`, async function () {
        await cms.page!.click(saveButton);
    });
}

export async function fillAttendanceStatusBulkAction(
    cms: CMSInterface,
    attendanceStatus: AttendanceStatus
): Promise<void> {
    await cms.instruction(
        `Select ${attendanceStatus} on Attendance Status autocomplete`,
        async function () {
            await cms.page!.click(LessonManagementKeys.lessonReportBulkActionInputAttendanceStatus);
            await cms.chooseOptionInAutoCompleteBoxByText(attendanceStatus);
        }
    );
}

export function getRandomOptionAttendanceStatus(option: string) {
    const indexRandom = randomInteger(0, 2);
    const attendanceStatus = getOptionAttendanceStatus(option, indexRandom);
    return attendanceStatus;
}

export async function teacherAppliesBulkAction(
    masterWorld: IMasterWorld,
    role: AccountRoles,
    option: string
) {
    const cms = getCMSInterfaceByRole(masterWorld, role);
    const scenario = masterWorld.scenario;
    const attendanceStatus = getRandomOptionAttendanceStatus(option);
    scenario.set(aliasAttendanceStatusBulkAction, attendanceStatus);

    await fillAttendanceStatusBulkAction(cms, attendanceStatus);
    await saveBulkAction(cms);
}

export async function assertValueAttendanceStatus(cms: CMSInterface, option: AttendanceStatus) {
    const valueField = await cms.page?.inputValue(
        LessonManagementKeys.lessonReportInputAttendanceStatus
    );

    weExpect(valueField).toEqual(option);
}

export function getOptionAttendanceStatus(option: string, index: number): AttendanceStatus {
    if (!option.includes('1 of')) return option as AttendanceStatus;

    const optionList = convertOneOfStringTypeToArray(option);
    const randomOption = optionList[index] as AttendanceStatus;
    return randomOption;
}
