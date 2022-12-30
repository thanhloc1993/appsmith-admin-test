import {
    arrayHasItem,
    getRandomNumber,
    randomString,
    retrieveLocations,
    retrieveAllChildrenLocationsOfParent,
    retrieveLowestLocations,
} from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder';
import { ScenarioContext } from '@supports/scenario-context';
import { timesheetModifierService } from '@supports/services/timesheet-service';
import { usermgmtStaffModifierService } from '@supports/services/usermgmt-staff-service';
import { usermgmtUserModifierService } from '@supports/services/usermgmt-student-service';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import { shuffle } from 'lodash';
import { Country } from 'manabuf/common/v1/enums_pb';
import { CreateTimesheetResponse } from 'manabuf/timesheet/v1/timesheet_pb';
import { DeleteTimesheetResponse } from 'manabuf/timesheet/v1/timesheet_state_machine_pb';
import { Gender, UserGroup } from 'manabuf/usermgmt/v2/enums_pb';
import { timesheetIdsToBeDeletedAlias } from 'test-suites/squads/timesheet/common/alias-keys';
import {
    datePickerWithValue,
    timePickerOKButton,
} from 'test-suites/squads/timesheet/common/cms-selectors/common';
import {
    createTimesheetEndpoint,
    deleteTimesheetEndpoint,
} from 'test-suites/squads/timesheet/common/endpoint';
import { getMonthDiff } from 'test-suites/squads/timesheet/common/utils';
import { getUserGroupsWithTeacherRole } from 'test-suites/squads/user-management/step-definitions/user-query-user-groups-hasura';

export async function selectDateAndMonthInPicker(
    cms: CMSInterface,
    date: Date,
    datePickerSelector: string
) {
    const desiredDate = new Date(date);
    const inputCurrentDate = await cms.page!.inputValue(datePickerSelector);
    const currentDate = inputCurrentDate ? new Date(inputCurrentDate) : new Date();
    let monthDiff = getMonthDiff(desiredDate, currentDate);

    await cms.page?.click(datePickerSelector);

    await cms.instruction(
        `Select date ${desiredDate.toLocaleDateString()}, monthDiff = ${monthDiff}`,
        async function () {
            while (monthDiff) {
                if (monthDiff < 0) {
                    await cms.selectAButtonByAriaLabel('Next month');
                    await cms.page!.waitForTimeout(200);
                    monthDiff++;
                } else {
                    await cms.selectAButtonByAriaLabel('Previous month');
                    await cms.page!.waitForTimeout(200);
                    monthDiff--;
                }
            }

            await cms.page!.click(datePickerWithValue(desiredDate.getDate()));
        }
    );
    await applyTimePicker(cms.page);
}

export async function applyTimePicker(page: CMSInterface['page']) {
    await page!.click(timePickerOKButton);
}

export async function createARandomStaffFromGRPC(
    cms: CMSInterface,
    userGroupIdsList: string[] = []
): Promise<UserProfileEntity> {
    const staff: UserProfileEntity = await createAnUserGRPC(
        cms,
        UserGroup.USER_GROUP_TEACHER,
        userGroupIdsList
    );

    return staff;
}

export async function createAnUserGRPC(
    cms: CMSInterface,
    userGroup: UserGroup,
    userGroupIdsList: string[] = []
): Promise<UserProfileEntity> {
    const token = await cms.getToken();
    const newPassword = '123456789';
    const phoneNumber = getRandomNumber();
    const username = `e2e-${userGroup}.${getRandomNumber()}.${randomString(10)}@manabie.com`;
    const cmsProfile = await cms.getProfile();

    const locations: LocationInfoGRPC[] = [];
    const locationsListFromAPI = await retrieveLowestLocations(cms);

    if (arrayHasItem(locationsListFromAPI)) {
        locations.push(locationsListFromAPI[0]);
    } else {
        throw Error('There are no locations from API');
    }

    const locationsIdList = [locations[0].locationId];

    if (!userGroupIdsList.length) {
        const teacherGroups = await getUserGroupsWithTeacherRole(cms);

        const defaultUserGroupId = teacherGroups[0].user_group_id;
        userGroupIdsList.push(defaultUserGroupId);
    }

    const response = await usermgmtStaffModifierService.createStaff(token, {
        name: username,
        email: username,
        country: Country.COUNTRY_JP,
        phoneNumber: String(phoneNumber),
        avatar: '',
        organizationId: String(cmsProfile.schoolId),
        userGroup,
        userGroupIdsList,
        locationIdsList: locationsIdList,
        gender: Gender.MALE,
        primaryPhoneNumber: '',
        secondaryPhoneNumber: '',
        workingStatus: 0,
        remarks: '',
    });

    const { staffId, name, avatar } = response.response!.staff!;

    await usermgmtUserModifierService.reissuePassword(token, { userId: staffId, newPassword });

    return {
        id: staffId,
        email: username,
        name: name,
        avatar: avatar,
        phoneNumber: String(phoneNumber),
        givenName: '',
        password: newPassword,
        userGroupIdsList,
    };
}

export async function deleteTimesheetGRPC(cms: CMSInterface, timesheetIds: string[]) {
    const cmsToken = await cms.getToken();
    await cms.attach('Delete Timesheets by GRPC');
    if (!Array.isArray(timesheetIds)) return;
    for (const timesheetId in timesheetIds) {
        try {
            await timesheetModifierService.deleteTimesheet(cmsToken, { timesheetId });
        } catch (e) {
            console.error(e);
        }
    }
}

export async function waitForCreateTimesheetResponse(cms: CMSInterface, scenario: ScenarioContext) {
    const createTimesheetResponse = await cms.waitForGRPCResponse(createTimesheetEndpoint, {
        timeout: 60000,
    });
    const decoder = createGrpcMessageDecoder(CreateTimesheetResponse);
    const encodedResponseText = await createTimesheetResponse?.text();
    const timesheetDecodedResp = decoder.decodeMessage(encodedResponseText);
    const timesheetId = timesheetDecodedResp?.getTimesheetId();
    const timesheetToBeDeleted = scenario.get<string[]>(timesheetIdsToBeDeletedAlias);
    scenario.set(
        timesheetIdsToBeDeletedAlias,
        Array.isArray(timesheetToBeDeleted) ? [...timesheetToBeDeleted, timesheetId] : [timesheetId]
    );
    return timesheetId;
}

export async function waitForDeleteTimesheetResponse(
    cms: CMSInterface,
    scenario: ScenarioContext,
    timesheetId: string
) {
    const deleteTimesheetResponse = await cms.waitForGRPCResponse(deleteTimesheetEndpoint, {
        timeout: 60000,
    });
    const decoder = createGrpcMessageDecoder(DeleteTimesheetResponse);
    const encodedResponseText = await deleteTimesheetResponse?.text();
    const timesheetDecodedResp = decoder.decodeMessage(encodedResponseText);
    const success = timesheetDecodedResp?.getSuccess();
    if (!success) return;
    const timesheetToBeDeleted = scenario.get<string[]>(timesheetIdsToBeDeletedAlias);
    scenario.set(
        timesheetIdsToBeDeletedAlias,
        Array.isArray(timesheetToBeDeleted)
            ? timesheetToBeDeleted.filter((t) => t !== timesheetId) // remove deleted Timesheet from list
            : [timesheetId]
    );
}

export async function getLocationByName(cms: CMSInterface, locationName: string) {
    const locations = await retrieveLocations(cms);
    for (const location of locations) {
        if (locationName === location.name) return location;
    }
    return undefined;
}

export const getFirstRandomLocationFromParent = async (
    cms: CMSInterface,
    parentLocationName: string
) => {
    const parentLocation = await getLocationByName(cms, parentLocationName);

    const allChildrenLocation = await retrieveAllChildrenLocationsOfParent(
        cms,
        parentLocation!.locationId
    );
    const locations = allChildrenLocation.allChildrenLocationsOfParent;

    const firstRandomLocation = shuffle(locations)[0];

    return firstRandomLocation;
};

export const getLocationFromParent = async (
    cms: CMSInterface,
    parentLocationName: string,
    index: number
) => {
    const parentLocation = await getLocationByName(cms, parentLocationName);

    const allChildrenLocation = await retrieveAllChildrenLocationsOfParent(
        cms,
        parentLocation!.locationId
    );
    const locations = allChildrenLocation.allChildrenLocationsOfParent;

    const location = locations[index];

    return location;
};

export async function waitingAutocompleteLoadingWithRetry(
    cms: CMSInterface,
    autocompleteInputSelector: string
) {
    const page = cms.page!;

    const autocompleteLoadingSelector = `[data-testid='AutocompleteLoading__root']`;
    const autocompleteNoOptionsSelector = `[role='presentation'] div:has-text("No options")`;
    const inputText = await page.inputValue(autocompleteInputSelector);
    const desiredOptionSelector = `[role='listbox'] li:has-text("${inputText}")`;

    await cms.instruction('School admin is waiting to load autocomplete', async function () {
        let hasOptions = false;
        while (!hasOptions) {
            await page.waitForSelector(autocompleteLoadingSelector, {
                state: 'hidden',
            });
            await page.waitForSelector(
                `${desiredOptionSelector}, ${autocompleteNoOptionsSelector}`
            );
            hasOptions = await page.isVisible(desiredOptionSelector);
            if (!hasOptions) {
                await page.fill(autocompleteInputSelector, '');
                await page.waitForTimeout(200);
                await page.fill(autocompleteInputSelector, inputText);
                await page.waitForTimeout(200);
            }
        }
    });
}
