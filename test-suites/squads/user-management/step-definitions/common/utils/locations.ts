import { locationDialog } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { getRandomElementsWithLength } from '@legacy-step-definitions/utils';
import { locationItemContainer } from '@user-common/cms-selectors/staff';
import {
    childLocationInParentLocation,
    formSelectInputLocation,
    locationItemInTreeLocationsDialog,
} from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import { studentLocationsAlias } from '../alias-keys/student';
import { clickButtonInNotFullScreenDialogByText } from './click-actions';

export async function selectLocations(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    locations?: LocationInfoGRPC[]
) {
    if (!locations || !locations.length) return;

    await openPopupLocation(cms);

    await chooseLocations(cms, locations);

    scenarioContext?.set(studentLocationsAlias, locations);

    await clickButtonInNotFullScreenDialogByText(cms, 'Save');
}

export async function openPopupLocation(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction(
        'School admin clicks location input to open Select Location Popup',
        async function () {
            const locationSelectInputField = page!.locator(formSelectInputLocation);
            await locationSelectInputField!.getByLabel('Location').click();
        }
    );
}

export async function chooseLocations(cms: CMSInterface, locations: LocationInfoGRPC[]) {
    await cms.instruction(
        'School admin choose locations in the dialog is active',
        async function () {
            for (let index = 0; index < locations.length; index++) {
                const location = locations[index];

                const locationItem = await cms.page!.waitForSelector(
                    locationItemInTreeLocationsDialog(location.locationId)
                );

                await locationItem.scrollIntoViewIfNeeded();
                await locationItem.click();
            }
        }
    );
}

export async function chooseRandomUILocations(cms: CMSInterface, amount = 5) {
    const page = cms.page!;
    const locationList = [];
    const locationTree = page.locator(locationDialog);
    await locationTree.waitFor({ state: 'attached' });
    const childLocations = locationTree.locator(childLocationInParentLocation);
    const childLocationCount = await childLocations.count();
    const length = childLocationCount <= amount ? childLocationCount : amount;

    const childLocationElements = await childLocations.elementHandles();
    const randomLocations = getRandomElementsWithLength(childLocationElements, length);
    for (const location of randomLocations) {
        await location.click();
        await location.scrollIntoViewIfNeeded();
        const content = await location.textContent();
        if (content) locationList.push(content);
    }
    return locationList;
}

export async function chooseLocationsByName(cms: CMSInterface, locations: string[]) {
    await cms.instruction(
        'School admin choose locations in the dialog is active',
        async function () {
            for (const location of locations) {
                const locationContainerItem = cms.page!.locator(locationItemContainer);
                const locationItem = locationContainerItem.getByText(location, { exact: true });
                await locationItem.scrollIntoViewIfNeeded();
                await locationItem.click();
            }
        }
    );
}

export async function addMoreRandomUILocations(
    cms: CMSInterface,
    locations: LocationInfoGRPC[],
    amount = 5
) {
    const page = cms.page!;
    const locationList = locations;
    const locationTree = page.locator(locationDialog);
    await locationTree.waitFor({ state: 'attached' });
    const childLocations = locationTree.locator(childLocationInParentLocation);
    const childLocationCount = await childLocations.count();
    const length = childLocationCount <= amount ? childLocationCount : amount;

    const childLocationElements = await childLocations.elementHandles();
    const randomLocations = getRandomElementsWithLength(childLocationElements, length);
    for (const location of randomLocations) {
        const content = await location.textContent();
        const locationId = await location.getAttribute('data-value');
        if (!locations.some((location) => location.name === content)) {
            await location.click();
            await location.scrollIntoViewIfNeeded();
            if (content && locationId) locationList.push({ locationId, name: content });
        }
    }
    return locationList;
}
