import { getTestId } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { retrieveLowestLocations } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';
import { DateCommon } from '@supports/utils/time/constants/types';
import { formatDate } from '@supports/utils/time/time';

import { random, times } from 'lodash';
import {
    staffProfileAlias,
    locationNameAlias,
    timesheetDateAlias,
    otherWorkingHoursAlias,
    transportationExpensesAlias,
    remarksAlias,
} from 'test-suites/squads/timesheet/common/alias-keys';
import { editTimesheetEndpoint } from 'test-suites/squads/timesheet/common/endpoint';
import {
    OtherWorkingHoursDataTable,
    MenuLabel,
    TransportationExpensesDataTable,
} from 'test-suites/squads/timesheet/common/types';

export const getOtherWorkingHoursFromContext = (
    scenarioContext: ScenarioContext,
    alias: string
) => {
    return scenarioContext.get<OtherWorkingHoursDataTable[]>(alias);
};

export const getTransportationExpensesFromContext = (
    scenarioContext: ScenarioContext,
    alias: string
) => {
    return scenarioContext.get<TransportationExpensesDataTable[]>(alias);
};

export const getTimesheetInfoFromContext = (scenarioContext: ScenarioContext) => {
    const staffProfile = scenarioContext.get<UserProfileEntity>(staffProfileAlias);
    const staffName = staffProfile?.name || '';
    const staffEmail = staffProfile?.email || '';
    const locationName = scenarioContext.get(locationNameAlias);
    const date = scenarioContext.get(timesheetDateAlias);
    const otherWorkingHours = getOtherWorkingHoursFromContext(
        scenarioContext,
        otherWorkingHoursAlias
    );
    const transportationExpenses = getTransportationExpensesFromContext(
        scenarioContext,
        transportationExpensesAlias
    );

    const remarks = scenarioContext.get(remarksAlias);

    const timesheetInfo = {
        staffName,
        staffEmail,
        locationName,
        date,
        otherWorkingHours,
        transportationExpenses,
        remarks,
    };

    return timesheetInfo;
};

export const formatLongDate = (date: DateCommon['date']) => {
    return formatDate(date, 'YYYY/MM/DD');
};

export const getRandomString = (length: number) => {
    return times(length, () => random(35).toString(36)).join('');
};

export const getUserInfoAliasByUserGroup = (userGroup: string) => `${userGroup}InfoAlias`;

export const getNavigationMenuSelector = (menu: MenuLabel) =>
    `a${getTestId('MenuItemLink__root')}[aria-label="${menu}"]`;

export const getCountInStatusTab = (source: string) => {
    const match = source.match(/\(([^)]+)\)/);
    return match ? match[1] : '0';
};

export function getMonthDiff(d1: Date, d2: Date) {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months;
}

export async function waitForEditTimesheetResponse(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(editTimesheetEndpoint, {
        timeout: 120000,
    });
}

export async function getFirstGrantedLocation(cms: CMSInterface) {
    const locations = await retrieveLowestLocations(cms);
    const locationsList = locations.slice(0, 5);
    const firstGrantedLocation = locationsList[locationsList.length - 1];

    return firstGrantedLocation;
}
