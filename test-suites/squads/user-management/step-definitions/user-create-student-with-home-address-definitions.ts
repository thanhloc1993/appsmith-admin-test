import { buttonByAriaLabel } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { getRandomElement, getRandomNumber, randomInteger } from '@legacy-step-definitions/utils';
import { learnerProfileAlias, studentHomeAddressAlias } from '@user-common/alias-keys/user';
import {
    formInputCity,
    formInputFirstStreet,
    formInputPostalCode,
    formInputPrefectureAutocomplete,
    formInputSecondStreet,
    homeAddressCityValue,
    homeAddressFirstStreetValue,
    homeAddressPostalCodeValue,
    homeAddressPrefectureValue,
    homeAddressSecondStreetValue,
    studentDetailHomeAddress,
    studentFormHomeAddress,
    tableStudentHomeAddressCell,
    tableStudentHomeAddressLoading,
    tableStudentName,
} from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { emptyValue } from '@supports/constants';
import { UserAddress, UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Users_PrefectureListQuery } from '@supports/graphql/bob/bob-types';
import prefectureBobQuery from '@supports/graphql/bob/prefecture.query';
import { ScenarioContext } from '@supports/scenario-context';

import { findNewlyCreatedStudent, searchStudentOnCMS } from './user-definition-utils';
import { strictEqual } from 'assert';
import isEmpty from 'lodash/isEmpty';

export async function createRandomStudentHomeAddressData(cms: CMSInterface): Promise<UserAddress> {
    const prefectureList = await getPrefectureList(cms);
    const postalCode = getRandomNumber().toString().slice(7);
    const prefecture = prefectureList[randomInteger(0, prefectureList.length - 1)];
    const city = getRandomElement(['千葉市中央区', '福井市', '長崎市', '千代田区', '福島市']);
    const firstStreet = getRandomElement(['荒町', '旭町', '赤坂町', '青柳町', '青山']);
    const secondStreet = getRandomElement(['1-1', '3-2', '1-2', '3-3', '2-3']);
    return {
        postalCode,
        prefecture: {
            id: prefecture.prefecture_id,
            name: prefecture.name,
        },
        city,
        firstStreet,
        secondStreet,
    };
}

export async function fillInStudentHomeAddress(cms: CMSInterface, studentHomeAddress: UserAddress) {
    const page = cms.page!;
    const homeAddressForm = page.locator(studentFormHomeAddress);
    const { postalCode, prefecture, city, firstStreet, secondStreet } = studentHomeAddress;

    await homeAddressForm.scrollIntoViewIfNeeded();

    await cms.instruction('school admin fills postal code', async function () {
        const postalCodeInput = homeAddressForm.locator(formInputPostalCode);
        await postalCodeInput.fill(postalCode || '');
    });

    await cms.instruction('school admin fills city', async function () {
        const postalCodeInput = homeAddressForm.locator(formInputCity);
        await postalCodeInput.fill(city || '');
    });
    await cms.instruction('school admin fills first street', async function () {
        const postalCodeInput = homeAddressForm.locator(formInputFirstStreet);
        await postalCodeInput.fill(firstStreet || '');
    });
    await cms.instruction('school admin fills second street', async function () {
        const postalCodeInput = homeAddressForm.locator(formInputSecondStreet);
        await postalCodeInput.fill(secondStreet || '');
    });
    await cms.instruction('school admin fills second street', async function () {
        const postalCodeSelect = homeAddressForm.locator(formInputPrefectureAutocomplete);
        await postalCodeSelect.click();
        if (prefecture) {
            await cms.chooseOptionInAutoCompleteBoxByText(prefecture.name);
        } else {
            const clearIcon = postalCodeSelect.locator(buttonByAriaLabel('Clear'));
            await clearIcon.click();
        }
    });
}

export async function assertStudentHomeAddressOnCMS(cms: CMSInterface, context: ScenarioContext) {
    const studentProfile = context.get<UserProfileEntity>(learnerProfileAlias);
    const studentHomeAddress = context.get<UserAddress>(studentHomeAddressAlias);

    await cms.instruction('school admin searches for new created student', async function () {
        await searchStudentOnCMS(cms, studentProfile.name);
    });

    const student = await findNewlyCreatedStudent(cms, studentProfile);
    const { postalCode, prefecture, city, firstStreet, secondStreet } = studentHomeAddress;

    await cms.instruction(
        'school admin sees home address column on student list table',
        async function () {
            const homeAddressColumn = await student?.waitForSelector(tableStudentHomeAddressCell);
            await homeAddressColumn?.scrollIntoViewIfNeeded();
            await homeAddressColumn?.waitForSelector(tableStudentHomeAddressLoading, {
                state: 'hidden',
            });

            const homeAddressContent = await homeAddressColumn?.textContent();
            const expectedHomeAddress = isEmpty(studentHomeAddress)
                ? emptyValue
                : `${postalCode} ${prefecture?.name} ${city} ${firstStreet} ${secondStreet}`;
            strictEqual(
                homeAddressContent,
                expectedHomeAddress,
                'Student home address should be match on UI'
            );
        }
    );

    await cms.instruction('school admin goes to student detail page', async function () {
        await (await student?.waitForSelector(tableStudentName))?.click();
        await cms.waitingForLoadingIcon();
    });

    await cms.instruction('school admin sees home address on student detail', async function () {
        const homeAddressDetail = cms.page?.locator(studentDetailHomeAddress);
        await homeAddressDetail?.scrollIntoViewIfNeeded();

        const homeAddressData = await Promise.all([
            homeAddressDetail?.locator(homeAddressPostalCodeValue).textContent(),
            homeAddressDetail?.locator(homeAddressPrefectureValue).textContent(),
            homeAddressDetail?.locator(homeAddressCityValue).textContent(),
            homeAddressDetail?.locator(homeAddressFirstStreetValue).textContent(),
            homeAddressDetail?.locator(homeAddressSecondStreetValue).textContent(),
        ]);

        weExpect(homeAddressData).toEqual([
            postalCode || emptyValue,
            prefecture?.name || emptyValue,
            city || emptyValue,
            firstStreet || emptyValue,
            secondStreet || emptyValue,
        ]);
    });
}

export async function getPrefectureList(
    cms: CMSInterface
): Promise<Users_PrefectureListQuery['prefecture']> {
    try {
        const resp = await cms.graphqlClient?.callGqlBob<Users_PrefectureListQuery>({
            body: prefectureBobQuery.getList(),
        });
        return resp?.data?.prefecture || [];
    } catch (error) {
        throw new Error('Auth: Can not retrieve prefecture list');
    }
}
