import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    getRandomElementsWithLength,
    randomInteger,
    retrieveLocations,
} from '@legacy-step-definitions/utils';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import { CreateStudentResponseEntity } from '@supports/services/usermgmt-student-service/entities/create-student-response';
import { LocationInfoGRPC, StudentDetailTab } from '@supports/types/cms-types';
import { formatDate } from '@supports/utils/time/time';

import {
    changeTimePicker,
    getHourForTimePicker,
    getMeridiemForTimePicker,
} from './entry-exit-utils';
import { StudentEnrollmentStatus } from 'manabuf/usermgmt/v2/enums_pb';
import {
    createARandomStudentGRPC,
    schoolAdminChooseTabInStudentDetail,
} from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';
import { findNewlyCreatedLearnerOnCMSStudentsPage } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';
import { clickOnStudentOnStudentsTab } from 'test-suites/squads/user-management/step-definitions/user-view-student-details-definitions';

export enum StatusTypes {
    ENROLLED = 'Enrolled',
    POTENTIAL = 'Potential',
    LOA = 'LOA',
    WITHDRAWN = 'Withdrawn',
    GRADUATED = 'Graduated',
}

export async function createStudentWithStatus(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    status: StatusTypes,
    studentRole: AccountRoles = 'student'
) {
    const page = cms.page!;
    const studentKey = learnerProfileAliasWithAccountRoleSuffix(studentRole);
    const parentKey = parentProfilesAliasWithAccountRoleSuffix(studentRole);

    const selectedLocation = await page.waitForSelector(CMSKeys.selectedLocationSelector);
    const selectedLocationText = await selectedLocation.textContent();

    const locationsList = await retrieveLocations(cms);
    const cmsSelectedLocation: LocationInfoGRPC[] = locationsList.filter(
        (location) => location.name === selectedLocationText
    );
    const length = randomInteger(1, 15);
    const randomLocations: LocationInfoGRPC[] = getRandomElementsWithLength<LocationInfoGRPC>(
        locationsList,
        length
    ).filter((location) => location.name !== selectedLocationText);
    const locations = [...randomLocations, ...cmsSelectedLocation];
    let enrollmentStatus: keyof typeof StudentEnrollmentStatus =
        'STUDENT_ENROLLMENT_STATUS_ENROLLED';

    switch (status) {
        case StatusTypes.POTENTIAL:
            enrollmentStatus = 'STUDENT_ENROLLMENT_STATUS_POTENTIAL';
            break;
        case StatusTypes.GRADUATED:
            enrollmentStatus = 'STUDENT_ENROLLMENT_STATUS_GRADUATED';
            break;
        case StatusTypes.WITHDRAWN:
            enrollmentStatus = 'STUDENT_ENROLLMENT_STATUS_WITHDRAWN';
            break;
        case StatusTypes.LOA:
            enrollmentStatus = 'STUDENT_ENROLLMENT_STATUS_LOA';
            break;
        default:
            break;
    }

    const { student, parents }: CreateStudentResponseEntity = await createARandomStudentGRPC(cms, {
        parentLength: 1,
        defaultEnrollmentStatus: enrollmentStatus,
        locations,
    });

    scenarioContext.set(studentKey, student);
    scenarioContext.set(parentKey, parents);

    return student;
}

export async function cmsGoToStudentEntryExitTab(
    cms: CMSInterface,
    learnerProfile: UserProfileEntity
) {
    await cms.instruction(`Go to student management page`, async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
    });

    await cms.waitForSkeletonLoading();

    await cms.instruction(`Find student ${learnerProfile.name} on student list`, async function () {
        await findNewlyCreatedLearnerOnCMSStudentsPage(cms, learnerProfile);
    });

    await cms.instruction(
        `Click student ${learnerProfile.name} on student list`,
        async function () {
            await clickOnStudentOnStudentsTab(cms, learnerProfile);
        }
    );

    await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.ENTRY_EXIT);
}

export async function addEntryExitRecordOnCMS(
    cms: CMSInterface,
    withExit: boolean,
    earlierExitTime: boolean,
    currentDate: Date
) {
    const page = cms.page!;

    const entryDate = new Date(currentDate);
    if (withExit && currentDate.getHours() !== 0) entryDate.setHours(currentDate.getHours() - 1);

    const entryHour = getHourForTimePicker(entryDate.getHours());
    const exitHour = getHourForTimePicker(currentDate.getHours());
    const entryMeridiem = getMeridiemForTimePicker(currentDate.getHours());
    const exitMeridiem = getMeridiemForTimePicker(currentDate.getHours());

    await cms.instruction(`Click Add Record button to open dialog box`, async function () {
        const addEntryExitRecordButton = await page.waitForSelector(
            studentPageSelectors.entryExitAddRecordButton
        );
        await addEntryExitRecordButton.click();
    });

    if (!earlierExitTime) {
        // correct input
        await cms.instruction(
            `Fill out entry date as ${formatDate(
                entryDate,
                'YYYY/MM/DD'
            )}, entry time ${entryHour}:00, and exit time ${exitHour}:00 or ${exitHour}:05, and save the record`,
            async function (this: CMSInterface) {
                await cms.selectDatePickerMonthAndDay({
                    day: currentDate.getDate(),
                    monthDiff: 0,
                    datePickerSelector: studentPageSelectors.entryDatePicker,
                });

                await changeTimePicker({
                    cms,
                    timePickerSelector: studentPageSelectors.entryTimePicker,
                    meridiem: entryMeridiem,
                    hour: entryHour <= 12 ? `${entryHour}` : `${entryHour - 12}`,
                    minute: '00',
                });

                if (withExit && entryHour !== exitHour) {
                    await changeTimePicker({
                        cms,
                        timePickerSelector: studentPageSelectors.exitTimePicker,
                        meridiem: exitMeridiem,
                        hour: exitHour <= 12 ? `${exitHour}` : `${exitHour - 12}`,
                        minute: '00',
                    });
                } else if (withExit && entryHour === exitHour) {
                    await changeTimePicker({
                        cms,
                        timePickerSelector: studentPageSelectors.exitTimePicker,
                        meridiem: exitMeridiem,
                        hour: exitHour <= 12 ? `${exitHour}` : `${exitHour - 12}`,
                        minute: '05',
                    });
                }

                await page?.click(studentPageSelectors.notifyParentsCheckbox);

                await cms.selectAButtonByAriaLabel('Save');
                await cms.waitForSkeletonLoading();
            }
        );
    } else {
        // incorrect input
        await cms.instruction(
            `Fill out entry date as ${formatDate(
                entryDate,
                'YYYY/MM/DD'
            )}, entry time ${entryHour}:05, and exit time ${entryHour}:00, and save the record`,
            async function (this: CMSInterface) {
                await cms.selectDatePickerMonthAndDay({
                    day: currentDate.getDate(),
                    monthDiff: 0,
                    datePickerSelector: studentPageSelectors.entryDatePicker,
                });

                await changeTimePicker({
                    cms,
                    timePickerSelector: studentPageSelectors.entryTimePicker,
                    meridiem: entryMeridiem,
                    hour: entryHour <= 12 ? `${entryHour}` : `${entryHour - 12}`,
                    minute: '05',
                });

                await changeTimePicker({
                    cms,
                    timePickerSelector: studentPageSelectors.exitTimePicker,
                    meridiem: entryMeridiem,
                    hour: entryHour <= 12 ? `${entryHour}` : `${entryHour - 12}`,
                    minute: '00',
                });

                await page?.click(studentPageSelectors.notifyParentsCheckbox);

                await cms.selectAButtonByAriaLabel('Save');
                await cms.waitForSkeletonLoading();
            }
        );
    }
}

export async function viewEntryExitRecordInBackOffice(cms: CMSInterface, entryTime: string) {
    await cms.page!.waitForSelector(
        CMSKeys.tableRowByText(studentPageSelectors.entryExitRecordsTable, entryTime)
    );
}
