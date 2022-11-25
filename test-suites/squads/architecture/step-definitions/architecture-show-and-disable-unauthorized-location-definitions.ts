import { CMSInterface } from '@supports/app-types';

export async function teacherSeeNumberUnAuthorizedLocation(
    cms: CMSInterface,
    expectNumber: number
) {
    const page = cms.page!;

    await page.waitForSelector('label:has-text("Unauthorized location")');
    const unauthorizedLocations = await page.$$('label:has-text("Unauthorized location")');
    weExpect(unauthorizedLocations.length, `Expect number unauthorized location`).toEqual(
        expectNumber
    );

    for (const location of unauthorizedLocations) {
        const checkboxLocation = await location.waitForSelector('input');
        const isDisabledLocation = await checkboxLocation.isDisabled();

        weExpect(isDisabledLocation).toBeTruthy();
    }
}
