import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import {
    checkboxLocationById,
    snackBarError,
} from '@legacy-step-definitions/cms-selectors/architecture';
import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    getCMSInterfaceByRole,
    retrieveLocations,
    retrieveLocationTypes,
} from '@legacy-step-definitions/utils';
import { columnOfFirstStudent, locationColumnOfStudent } from '@user-common/cms-selectors/student';

import { AccountRoles, CMSInterface, IMasterWorld } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import { parseFirstGrantedLocation } from './architecture-utils';

export async function schoolAdminRegisterFirstGrantedLocation(
    masterWorld: IMasterWorld,
    role: AccountRoles
) {
    const cms = getCMSInterfaceByRole(masterWorld, role);
    const scenarioContext = masterWorld.scenario;

    const firstGrantedLocation = await schoolAdminGetFirstGrantedLocation(cms, scenarioContext);

    scenarioContext.set(aliasFirstGrantedLocation, firstGrantedLocation);
}

export async function schoolAdminSeesFirstGrantedLocation(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const page = cms.page!;

    const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

    const selectedLocation = await page.waitForSelector(CMSKeys.selectedLocationSelector);
    const selectedLocationText = await selectedLocation.textContent();

    weExpect(selectedLocationText, `Expect auto select first location correctly`).toEqual(
        firstGrantedLocation?.name
    );
}

export async function schoolAdminGetFirstGrantedLocation(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const locationTypesList = await retrieveLocationTypes(cms);
    const locationsList = await retrieveLocations(cms);

    const firstGrantedLocation = parseFirstGrantedLocation(locationTypesList, locationsList);

    scenarioContext.set(aliasFirstGrantedLocation, firstGrantedLocation);

    return firstGrantedLocation;
}

export async function schoolAdminSeesListStudentMatchLocation(
    cms: CMSInterface,
    expectLocationName: string
) {
    const locationsOfFirstStudent = await getLocationOfFirstStudentOnList(cms);

    return locationsOfFirstStudent.includes(expectLocationName);
}

export async function getLocationOfFirstStudentOnList(cms: CMSInterface) {
    const page = cms.page!;
    let locations = '';
    try {
        locations = (await page.textContent(columnOfFirstStudent(locationColumnOfStudent))) || '';
    } catch (error) {
        throw Error('There is no student match selected locations');
    }

    return locations?.split(', ') || [];
}

export async function assertLocationIsSelected(cms: CMSInterface, expectLocationId: string) {
    const page = cms.page!;

    const checkboxLocation = await page.waitForSelector(checkboxLocationById(expectLocationId));

    weExpect(
        await checkboxLocation.isChecked(),
        `Expect checkbox of first location is checked`
    ).toBeTruthy();
}

export async function deselectLocationById(cms: CMSInterface, locationId: string) {
    const page = cms.page!;

    await assertLocationIsSelected(cms, locationId);

    const checkboxLocation = await page.waitForSelector(checkboxLocationById(locationId));
    await checkboxLocation.uncheck();
}

export async function seeLocationSettingDialog(cms: CMSInterface) {
    await cms.page?.waitForSelector(CMSKeys.dialogWithHeaderFooterWrapper);
}

export async function seeErrorSnackbar(cms: CMSInterface) {
    await cms.page?.waitForSelector(snackBarError);
}
