import { learnerProfileAlias, locationAddMoreAlias } from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import { checkLocationItem, countLocationBySelectedText } from './user-definition-utils';
import { strictEqual } from 'assert';

export enum AmountLocation {
    ONE = 'one',
    MULTIPLE = 'multiple',
}

export async function checkLocationOnDialog(cms: CMSInterface, scenarioContext: ScenarioContext) {
    const student = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
    const { locations = [] } = student;
    const locationAddMore = scenarioContext.get<LocationInfoGRPC[]>(locationAddMoreAlias) || [];

    const newLocations = [...locations, ...locationAddMore];

    const selectedLength = await countLocationBySelectedText(cms);

    strictEqual(
        newLocations.length,
        selectedLength,
        `The location length(${newLocations.length}) should be equal location selected text(${selectedLength})`
    );

    await checkLocationItem(cms, newLocations);

    const newLearnerProfileAlias = { ...student, locations: newLocations };
    scenarioContext.set(learnerProfileAlias, newLearnerProfileAlias);
}

export async function checkSelectedPart(
    cms: CMSInterface,
    locations: LocationInfoGRPC[],
    isIncludes = true
) {
    await cms.instruction(`School admin check selected part in the popup`, async function () {
        const wrapper = await cms.page!.waitForSelector(
            studentPageSelectors.dialogWithHeaderFooterWrapper
        );
        const subNote = await wrapper?.waitForSelector(
            studentPageSelectors.dialogWithHeaderFooterSubNote
        );
        //Selected: Center 1, Center 2, +8
        const subNoteTextContent = await subNote.textContent();
        const subNoteContent = subNoteTextContent?.slice(10, subNoteTextContent.length);
        const _subNoteSplit = subNoteContent?.split(', ');
        const subNoteSplit = _subNoteSplit ? _subNoteSplit : [];
        const lastSubNote = subNoteSplit[subNoteSplit.length - 1];
        const isPlus = lastSubNote.includes('+');
        strictEqual(
            false,
            isPlus,
            `Cannot check the items has inclusive in the location path by name because the location path is collapsed to ${lastSubNote} Ex: ${subNoteTextContent}`
        );

        for (let index = 0; index < locations.length; index++) {
            const locationName = locations[index].name;
            const _isIncludes = subNoteSplit.includes(locationName);

            strictEqual(
                isIncludes,
                _isIncludes,
                `location path ${isIncludes ? 'include' : 'not included'} ${locationName}`
            );
        }
    });
}
