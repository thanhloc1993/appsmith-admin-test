import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { DataTable } from '@cucumber/cucumber';

import { ElementHandle, Locator } from 'playwright';
import { Page } from 'playwright';

import {
    AccountRoles,
    BrightcoveVideoInfo,
    CMSInterface,
    IMasterWorld,
    LearnerInterface,
    LearnerRolesWithTenant,
    SchoolAdminRolesWithTenant,
    TeacherRolesWithTenant,
    MultiTenantAccountType,
    TeacherInterface,
    Tenant,
    ParentRolesWithTenant,
    LearnerInterfaceWithTenant,
} from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { MasterCategory } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import MasterReaderService from '@supports/services/bob-master-data-reader/bob-master-data-reader-service';
import MastermgmtImportService from '@supports/services/mastermgmt-import-service';
import {
    LocationObjectGRPC,
    LocationTypeGRPC,
    MoveDirection,
    TreeLocationProps,
} from '@supports/types/cms-types';
import { PagePosition } from '@supports/types/cms-types';

import * as CMSKeys from '../step-definitions/cms-selectors/cms-keys';
import {
    buttonNextPageTable,
    buttonPreviousPageTable,
    tableBaseFooterSelect,
    tableRowItem,
    tableFooterCaption,
} from '../step-definitions/cms-selectors/cms-keys';
import { LocationInfoGRPC } from './../supports/types/cms-types';
import {
    datePickerNextMonthButton,
    datePickerPreviousMonthButton,
    okButtonInDatePicker,
    tableBaseFooter,
} from './cms-selectors/cms-keys';
import { getDateSelectorOfDatePickerCalendar } from './cms-selectors/common';
import fs from 'fs';
import googleLibphonenumber from 'google-libphonenumber';
import { Timestamp } from 'manabuf/google/protobuf/timestamp_pb';
import moment from 'moment/moment';
import path from 'path';
import { getGradeList } from 'test-suites/squads/user-management/step-definitions/master-management/user-import-master-data-utils';
import { $enum } from 'ts-enum-util';
import { StringKeyOf } from 'ts-enum-util/src/types';
import { retry } from 'ts-retry-promise';

export { genId } from '@supports/utils/ulid';
export const downloadPath = path.join(__dirname, `../downloads/`);

export function randomString(length: number) {
    let result = '';
    for (let i = 0; i < length; i++) {
        let rand = Math.floor(Math.random() * 62);
        const charCode = (rand += rand > 9 ? (rand < 36 ? 55 : 61) : 48);
        result += String.fromCharCode(charCode);
    }
    return result;
}

export function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function makeRandomTextMessage() {
    const messageText = randomString(randomInteger(10, 100));
    return messageText;
}

export const getRandomNumber = () => {
    return new Date().getTime();
};

export const getRandomPhoneNumber = () => {
    const listFirstNUmber = [1, 2, 3, 5, 6, 7, 8, 9];
    const firstNUmber = listFirstNUmber[randomInteger(0, 7)];

    if (firstNUmber === 2) {
        return `${firstNUmber}${getRandomNumber().toString().slice(4)}`;
    }

    return `${firstNUmber}${getRandomNumber().toString().slice(5)}`;
};

export const getRandomUserPhoneNumber = (comparePhoneNumber?: string): string => {
    const phoneNumber: string = getRandomNumber().toString();

    if (phoneNumber === comparePhoneNumber) {
        return getRandomUserPhoneNumber(comparePhoneNumber);
    }

    return phoneNumber;
};

export const getRandomDate = () => {
    const curYear = new Date().getFullYear();
    const year = randomInteger(1950, curYear);
    const month = randomInteger(1, 12);
    const date = randomInteger(1, 28);
    return new Date(year, month - 1, date);
};

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function toShortenStr(str: string | undefined, max = 30) {
    if (!str || str.length <= max) return str || '';

    return str.substr(0, max) + '...';
}

export const readDownloadFileSync = (fileName: string) => {
    return fs.readFileSync(path.join(downloadPath, fileName));
};

export const writeDownloadFileSync = (
    fileName: string,
    content: string | NodeJS.ArrayBufferView
) => {
    return fs.writeFileSync(path.join(downloadPath, fileName), content);
};

export const convertToCSVString = (objectList: any[]) => {
    const objectListWithHeader = [Object.keys(objectList[0])].concat(objectList);

    return objectListWithHeader
        .map((row) => {
            return Object.values(row).toString();
        })
        .join('\n');
};

export const convertCSVStringToBase64 = (csvTemplate: string) => {
    const buffer = Buffer.from(csvTemplate);

    return buffer.toString('base64');
};

export function getTeacherInterfaceFromRole(
    master: IMasterWorld,
    role: AccountRoles
): TeacherInterface {
    return role !== 'teacher T2' ? master.teacher : master.teacher2;
}

export function getLearnerInterfaceFromRole(
    master: IMasterWorld,
    role: AccountRoles
): LearnerInterface {
    switch (role) {
        case 'parent P1': {
            return master.parent;
        }
        case 'parent P2': {
            return master.parent2;
        }
        case 'student S2': {
            return master.learner2;
        }
        case 'student S3': {
            return master.learner3;
        }
        default: {
            return master.learner;
        }
    }
}

export function getLearnerInterfaceFromRoleWithTenant(
    master: IMasterWorld,
    role: LearnerInterfaceWithTenant
): LearnerInterface {
    switch (role) {
        case 'parent Tenant S1': {
            return master.parent;
        }
        case 'parent Tenant S2': {
            return master.parent2;
        }
        case 'student Tenant S2': {
            return master.learner2;
        }
        default: {
            return master.learner;
        }
    }
}

export function getSchoolAdminTenantInterfaceFromRole(
    master: IMasterWorld,
    role: SchoolAdminRolesWithTenant
): CMSInterface {
    return role === 'school admin Tenant S1' ? master.cms : master.cms2;
}

export function getTeacherTenantInterfaceFromRole(
    master: IMasterWorld,
    role: TeacherRolesWithTenant
): TeacherInterface {
    return role === 'teacher Tenant S1' ? master.teacher : master.teacher2;
}

export function getLearnerTenantInterfaceFromRole(
    master: IMasterWorld,
    role: LearnerRolesWithTenant
): LearnerInterface {
    return role === 'student Tenant S1' ? master.learner : master.learner2;
}

export function getParentTenantInterfaceFromRole(
    master: IMasterWorld,
    role: ParentRolesWithTenant
): LearnerInterface {
    return role === 'parent Tenant S1' ? master.parent : master.parent2;
}

export function getUserProfileFromContext(scenarioContext: ScenarioContext, alias: string) {
    return scenarioContext.get<UserProfileEntity>(alias);
}

export function getUserProfilesFromContext(scenarioContext: ScenarioContext, alias: string) {
    return scenarioContext.get<Array<UserProfileEntity>>(alias);
}

export function getUserIdFromContextWithAccountRole(
    scenarioContext: ScenarioContext,
    role: AccountRoles
): string {
    const userProfile = getUserProfileFromContext(
        scenarioContext,
        learnerProfileAliasWithAccountRoleSuffix(role)
    );

    return userProfile?.id || '';
}

export function getStudentIdFromContextWithAccountRole(
    scenario: ScenarioContext,
    role: AccountRoles
) {
    let studentRole: AccountRoles = role;
    switch (role) {
        case 'parent P2':
            studentRole = 'student S2';
            break;
        case 'parent P1':
            studentRole = 'student S1';
            break;
    }
    const userId = getUserIdFromContextWithAccountRole(scenario, studentRole);
    return userId !== '' ? userId : getUserIdFromContextWithAccountRole(scenario, 'student');
}

export function getUserNameFromContextWithAccountRole(
    scenarioContext: ScenarioContext,
    role: AccountRoles
) {
    return getUserProfileFromContext(
        scenarioContext,
        learnerProfileAliasWithAccountRoleSuffix(role)
    ).name;
}

export const isParentRole = (role: AccountRoles): boolean => {
    const parentRoles: AccountRoles[] = ['parent P1', 'parent P2', 'parent P3'];

    return parentRoles.includes(role);
};

export const isTeacherRole = (role: AccountRoles): boolean => {
    const teacherRoles: AccountRoles[] = ['teacher', 'teacher T1', 'teacher T2'];
    return teacherRoles.includes(role);
};

export function toArr<T = string>(e: T | Array<T>): T[] {
    return Array.isArray(e) ? e : [e];
}

export const randomBoolean = () => Math.random() >= 0.5;

export type EnumKeysReturn<T> = Record<StringKeyOf<T>, StringKeyOf<T>>;

/**
 * @description Convert Record<keyString, number> to Record<keyString, keyString>
 **/
export function convertEnumKeys<T extends Record<StringKeyOf<T>, number | string>>(
    enumObj: T
): EnumKeysReturn<T> {
    const keys: StringKeyOf<T>[] = $enum(enumObj).getKeys();

    return keys.reduce((result, key: StringKeyOf<T>) => {
        result[key] = String(key) as StringKeyOf<T>;
        return result;
    }, {} as EnumKeysReturn<T>);
}

/**
 * @description Getting the enum key with the provided value
 * Since the const key = Enum[value]; will return undefined to the key
 * @param enumObj enum Obj
 * @param value: value of enum Obj
 * @returns string key base on value of enumObj
 */
export function getEnumKey<T extends Record<StringKeyOf<T>, number | string>>(
    enumObj: T,
    value: number
): string {
    return Object.keys(enumObj)[Object.values(enumObj).indexOf(value)];
}

export function arrayHasItem<T>(arr?: T[] | T | null): boolean {
    return Array.isArray(arr) && arr.length > 0;
}

/**
 * @description The `asyncForEach` function is used loop async.
 * Examples:
 * await asyncForEach<ItemInterface, void>(list, async (item, index, list) => {
 *     await someThing(item, index, list);
 * }
 *
 * @param array The list need loop
 * @param callback Call back of each loop(currentItem, currentIndex, list)
 *
 */

export const asyncForEach = async <T, Y>(
    array: T[],
    callback: (item: T, i: number, array: T[]) => Promise<Y>
) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

export const withDownloadPath = (path: string) => `./downloads/${path}`;

export function convertOneOfStringTypeToArray<T = string>(input: string): T[] {
    const regex = new RegExp(/([^[]+(?=]))/g);
    const matched = regex.exec(input);

    if (!matched) throw new Error(`Cannot find any array in the ${input}`);

    const result = matched[0]
        .replace(', ', ',')
        .split(',')
        .map((item) => item.trim()) as unknown as T[];

    return result;
}

export function convertStringTypeToArray<T = string>(input: string): T[] {
    const result = input
        .replace(', ', ',')
        .split(',')
        .map((item) => item.trim()) as unknown as T[];

    return result;
}

export function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export function getRandomElements<T>(array: T[]): T[] {
    const checkArray = new Array<boolean>(array.length);
    const n = randomInteger(2, array.length - 1); // min = 2
    const randomElements: T[] = [];
    for (let i = 0; i < n; i++) {
        let randomIndex: number;
        do {
            randomIndex = randomInteger(0, array.length - 1);
        } while (checkArray[randomIndex] != undefined);
        checkArray[randomIndex] = true;
    }
    for (let i = 0; i < checkArray.length; i++) {
        if (checkArray[i] == true) {
            randomElements.push(array[i]);
        }
    }
    return randomElements;
}

export function getRandomElementsWithLength<T>(array: T[], length = 1): T[] {
    if (array.length < length) {
        return array;
    }

    const shuffleArray = array
        .map((_) => ({ rnd: Math.random(), value: _ }))
        .sort((a, b) => a.rnd - b.rnd)
        .map((_) => _.value);

    return shuffleArray.slice(0, length);
}

export const randomOneOfStringType = <T>(input: string): T => {
    const types = convertOneOfStringTypeToArray<T>(input);

    return getRandomElement<T>(types);
};

export function pick1stElement<T>(arr: T[], defaultValue?: T): T | undefined {
    if (Array.isArray(arr)) {
        return arr[0];
    }

    return defaultValue || undefined;
}

export function getUsersFromContextByRegexKeys(
    scenarioContext: ScenarioContext,
    prefixAlias: string
): UserProfileEntity[] {
    return scenarioContext.getByRegexKeys(prefixAlias);
}

export function getNamesFromContext(scenarioContext: ScenarioContext, prefixAlias: string) {
    return getUsersFromContextByRegexKeys(scenarioContext, prefixAlias).map((user) => user.name);
}

export const sliceQueryNameFromGqlBody = (query: string): string => {
    const index = query.indexOf('('); //get index after entity name
    const entityName = query
        .substring(0, index)
        .replace(/{/gi, '')
        .replace(/ /gi, '')
        .replace(/\n/gi, '');

    return entityName;
};

export const convertTimestampToDate = (timestamp: Timestamp.AsObject) => {
    return new Date(timestamp.seconds * 1000 + timestamp.nanos / 1000000);
};

export function randomEnumKey<T extends object, K extends keyof T>(anEnum: T, omitProps?: K[]): K {
    const enumValues = Object.keys(anEnum).filter(
        (x) => isNaN(parseInt(x)) && !omitProps?.includes(x as K)
    ) as K[];
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    const randomEnumValue = enumValues[randomIndex];
    return randomEnumValue;
}

export function isCombinationWithAnd(item: string) {
    return item.includes('&') || item.includes('and');
}

/**
 * @description The `splitAndCombinationIntoArray` function is used to split the string with the `&` or `and` separator.
 * Examples: `'student S1 and student S2'` or `'student S1 & student S2'` into `['student S1', 'student S2]`
 *
 * @param combination the combination to be split into string array
 * @returns The string array of the combination
 */

export function splitAndCombinationIntoArray(combination: string) {
    if (combination.includes('&')) {
        return combination.split(' & ');
    }

    if (combination.includes('and')) {
        return combination.split(' and ');
    }

    return [combination];
}

export function splitRolesStringToAccountRoles(roles: string): AccountRoles[] {
    return roles.split(', ') as AccountRoles[];
}

export const parseBrightcoveVideoInfos = (content: string): BrightcoveVideoInfo[] => {
    if (!content) return [];
    return content
        .replace(/^\s*[\r\n]/gm, '')
        .trim()
        .split('\n')
        .map((url) => url.match(/\d{13}/gm) || [''])
        .map((token) => ({
            accountId: token[0],
            videoId: token[1],
        }));
};

export function capitalizeFirstLetter(string: string) {
    return string.replace(/^./, string[0].toUpperCase());
}

export function convertDataTableToArray(dataTable: DataTable): string[] {
    let listFields: string[] = [];
    listFields = listFields.concat.apply([], dataTable.raw());
    return listFields;
}

export function generateText(length: number) {
    const result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        if (i % 5 === 0) {
            result.push(' ');
        }
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('').trim();
}

export const createNumberArrayWithLength = (length: number) => [...Array(length).keys()];

export const randomUniqueIntegers = (max: number, count: number, min = 0): number[] => {
    const numbers = new Set<number>();
    while (numbers.size < count) {
        const random = randomInteger(min, max);
        numbers.add(random);
    }
    return [...numbers];
};

export const randomUniqueIntegersByType = (type: 'one' | 'multiple' | 'all', max: number) => {
    if (type === 'one') return [randomInteger(0, max)];

    if (type === 'multiple') return randomUniqueIntegers(max, Math.floor(max / 2));

    return createNumberArrayWithLength(max + 1);
};

export function randomGrade() {
    const randomValue = randomInteger(1, 12);

    /// TODO: Add grade for University
    return `Grade ${randomValue}`;
}

export const canMoveItem = (direction: MoveDirection, index: number, maxLength: number) => {
    if (index === 0 && direction === 'up') return false;
    if (index === maxLength - 1 && direction === 'down') return false;
    return true;
};

export const getExpectIndexAfterMoved = (moveIndex: number, direction: MoveDirection) => {
    const expectIndex = direction === 'up' ? moveIndex - 1 : moveIndex + 1;
    return expectIndex;
};

export async function openDatePickerDialog(
    cms: CMSInterface,
    datePickerSelector: string,
    elementSelector?: ElementHandle<SVGElement | HTMLElement> | null | Locator
) {
    const page = cms.page!;

    await cms.instruction(`Open date picker dialog`, async function () {
        if (elementSelector) {
            await elementSelector.click();
        } else {
            await page.locator(datePickerSelector).click();
        }
    });
}

export async function goToPrevOrNextMonth(cms: CMSInterface, isPrev = true) {
    const lastOrNext = isPrev ? 'last' : 'next';
    const selectMonthButton = isPrev ? datePickerPreviousMonthButton : datePickerNextMonthButton;

    await cms.instruction(`Go to ${lastOrNext} month`, async function () {
        await cms.page!.click(selectMonthButton);
    });
}

export async function selectDateInDatePicker(cms: CMSInterface, day: number) {
    await cms.instruction(`Select date ${day}`, async function () {
        const dateSelector = getDateSelectorOfDatePickerCalendar(day);
        await cms.page!.click(dateSelector);
    });
}

export async function clickOnOkButtonOnDatePickerFooter(cms: CMSInterface) {
    await cms.page!.click(okButtonInDatePicker);
}

export function getExpectedMonthFromMonthDiff(monthDiff: number) {
    const expectedMonth = new Date().getMonth() - monthDiff;
    return expectedMonth < 0 ? expectedMonth + 12 : expectedMonth;
}

export const gradesCMSMap = {
    '0': 'Others',
    '1': 'Grade 1',
    '2': 'Grade 2',
    '3': 'Grade 3',
    '4': 'Grade 4',
    '5': 'Grade 5',
    '6': 'Grade 6',
    '7': 'Grade 7',
    '8': 'Grade 8',
    '9': 'Grade 9',
    '10': 'Grade 10',
    '11': 'Grade 11',
    '12': 'Grade 12',
    '13': 'University 1',
    '14': 'University 2',
    '15': 'University 3',
    '16': 'University 4',
};

export type NumberOfRowsPerPage = 5 | 10 | 25 | 50 | 100;

export const convertGradesToArrayString = (grades: number[]) => {
    return grades.map((grade) => gradesCMSMap[grade as unknown as keyof typeof gradesCMSMap]);
};

export const convertGradesToString = (grades: number[], separator = ', ') => {
    const arr = convertGradesToArrayString(grades);
    return arr.join(separator);
};

export const getLearnerProfiles = async (learners: LearnerInterface[]) => {
    const promises = learners.map((learner) => learner.getProfile());

    return Promise.all(promises);
};

// teacher and school admin 2 on CMS
export function getCMSInterfaceByRole(masterWorld: IMasterWorld, role: AccountRoles) {
    switch (role) {
        case 'school admin':
        case 'school admin 1':
            return masterWorld.cms;

        case 'teacher':
        case 'school admin 2':
            return masterWorld.cms2;

        case 'teacher T1':
            return masterWorld.cms3;

        case 'teacher T2':
            return masterWorld.cms4;

        default:
            return masterWorld.cms;
    }
}

export async function getTotalRecordsOfDataTable(cms: CMSInterface) {
    const footerElement = await cms.page?.waitForSelector(tableBaseFooter);
    const footerContent = await footerElement?.textContent();

    /// Rows per page:${rowsPerPage}${startIndex}-${endIndex} of ${totalRecords}
    const totalRecords = footerContent?.split(' of ')[1];

    return totalRecords;
}

// Paging in table

export async function seesEqualRowsPerPageOnCMS(cms: CMSInterface, rowsPerPage: number) {
    const page = cms.page!;

    const rowsPerPageElement = await page.waitForSelector(CMSKeys.tableBaseFooterSelect);
    const rowsPerPageContent = (await rowsPerPageElement?.textContent()) || 0;
    const numberOfRowsPerPage = +rowsPerPageContent;

    weExpect(numberOfRowsPerPage, 'rows per page from input equal to on table').toEqual(
        rowsPerPage
    );
}

export async function seesItemLengthLessThanOrEqualRowsPerPageOnCMS(
    cms: CMSInterface,
    rowsPerPage: string
) {
    const page = cms.page!;

    const itemElements = await page.$$(CMSKeys.tableBaseRow);

    const numberOfRowsPerPage = +rowsPerPage;

    weExpect(
        itemElements.length,
        'item list less than or equal rows per page on table'
    ).toBeLessThanOrEqual(numberOfRowsPerPage);
}

export async function changeRowsPerPage(
    cms: CMSInterface,
    numberOfRows: number,
    shouldWaitForSkeletonLoading = true
) {
    const page = cms.page!;

    await cms.instruction(`School admin change rows ${numberOfRows}`, async function () {
        // Select input change row
        await page.click(tableBaseFooterSelect);

        // Choose number row
        await page.click(tableRowItem(numberOfRows));
    });

    if (shouldWaitForSkeletonLoading) {
        await cms.waitForSkeletonLoading();
    }
}

export async function isInPagePositionOnCMS(cms: CMSInterface, pagePosition: PagePosition) {
    const page = cms.page!;

    switch (pagePosition) {
        case PagePosition.First:
            await isInFirstPageOnCMS(page);
            break;

        case PagePosition.Last:
            await isInLastPageOnCMS(page);
            break;

        // Other
        default:
            await isInOtherPageOnCMS(page);
            break;
    }
}

async function isInFirstPageOnCMS(page: Page) {
    const buttonControlPaging = await page.waitForSelector(buttonPreviousPageTable);

    const isDisabled = await buttonControlPaging?.isDisabled();

    weExpect(isDisabled).toEqual(true);
}

async function isInLastPageOnCMS(page: Page) {
    const buttonControlPaging = await page.waitForSelector(buttonNextPageTable);

    const isDisabled = await buttonControlPaging?.isDisabled();

    weExpect(isDisabled).toEqual(true);
}

async function isInOtherPageOnCMS(page: Page) {
    const buttonPreviousPaging = await page.waitForSelector(buttonPreviousPageTable);

    const isDisabledButtonPreviousPaging = await buttonPreviousPaging?.isDisabled();

    weExpect(isDisabledButtonPreviousPaging).toEqual(false);

    const buttonNextPaging = await page.waitForSelector(buttonNextPageTable);

    const isDisabledButtonNextPaging = await buttonNextPaging?.isDisabled();

    weExpect(isDisabledButtonNextPaging).toEqual(false);
}

export async function checkFooterRowsRange(
    cms: CMSInterface,
    { recordFrom = 1, recordTo = 5 }: { recordFrom: number; recordTo: number }
) {
    const rowsRange = `${recordFrom}-${recordTo}`;
    const caption = await cms.getTextContentElement(tableFooterCaption);

    weExpect(caption, 'Table pagination should show correct row range text').toContain(rowsRange);
}

export function getTextInsideBrackets<T extends string>(content: string): T {
    let str = content.substring(content.indexOf('(') + 1);
    str = str.substring(0, str.indexOf(')'));
    return str as T;
}

export async function retrieveLowestLocations(cms: CMSInterface): Promise<LocationInfoGRPC[]> {
    const cmsToken = await cms.getToken();
    await cms.attach('Get Location list by GRPC');
    const { response } = await MasterReaderService.retrieveLowestLocations(cmsToken);
    let locationsList = response?.locationsList || [];
    if (!arrayHasItem(locationsList)) {
        await cms.attach('Dont have any locations by GRPC');
        await cms.attach('Importing location master-data...');
        await cms.importLocationData();
        await cms.attach('Get Location list by GRPC again');
        const { response } = await MasterReaderService.retrieveLowestLocations(cmsToken);
        locationsList = response?.locationsList || [];
    }

    return locationsList;
}

export async function retrieveLocations(cms: CMSInterface): Promise<LocationObjectGRPC[]> {
    const cmsToken = await cms.getToken();
    await cms.attach('Get Location list by GRPC');
    const { response } = await MasterReaderService.retrieveLocations(cmsToken);
    const locationsList = response?.locationsList || [];
    if (!arrayHasItem(locationsList)) throw Error('Error: Can not get locations by GRPC');

    return locationsList;
}

export async function retrieveLocationTypes(cms: CMSInterface): Promise<LocationTypeGRPC[]> {
    const cmsToken = await cms.getToken();
    await cms.attach('Get Location type list by GRPC');
    const { response } = await MasterReaderService.retrieveLocationTypes(cmsToken);
    const locationTypesList = response?.locationTypesList || [];
    if (!arrayHasItem(locationTypesList)) throw Error('Error: Can not get location types by GRPC');

    return locationTypesList;
}

export async function retrieveAllChildrenLocationsOfParent(
    cms: CMSInterface,
    parentLocationId: string
): Promise<{
    locations: LocationObjectGRPC[];
    allChildrenLocationsOfParent: LocationObjectGRPC[];
}> {
    const locations = await retrieveLocations(cms);

    const allChildrenLocationsOfParent = locations.filter(
        (location) => location.parentLocationId === parentLocationId
    );

    return {
        locations: locations,
        allChildrenLocationsOfParent: allChildrenLocationsOfParent,
    };
}

export function getAppInterface(
    masterWorld: IMasterWorld,
    accountType: MultiTenantAccountType,
    tenant: Tenant
): LearnerInterface | CMSInterface | TeacherInterface {
    switch (accountType) {
        case 'student':
            return tenant === 'Tenant S2' ? masterWorld.learner2! : masterWorld.learner!;
        case 'parent':
            return tenant === 'Tenant S2' ? masterWorld.parent2! : masterWorld.parent!;
        case 'teacher':
            return tenant === 'Tenant S2' ? masterWorld.teacher2! : masterWorld.teacher!;
        default:
            return tenant === 'Tenant S2' ? masterWorld.cms2! : masterWorld.cms!;
    }
}

export function buildTreeLocations(locations: TreeLocationProps[]) {
    const map = new Map<string, number>();
    const roots: TreeLocationProps[] = [];

    locations.forEach((location, i) => {
        map.set(location.locationId, i);
        location['children'] = [];
    });

    locations.forEach((location) => {
        if (location.parentLocationId === '') return roots.push(location);
        const indexChild = map.get(location.parentLocationId) || 0;

        locations[indexChild]['children']!.push({ ...location });
    });

    return roots[0];
}

export const getParentLocationNameByRecursive = (
    root: TreeLocationProps = {
        locationId: '',
        name: '',
        locationType: '',
        parentLocationId: '',
        accessPath: '',
    },
    selectedLocations: LocationInfoGRPC[]
) => {
    if (root.children && root.children?.length !== 0) {
        for (const child of root.children) {
            getParentLocationNameByRecursive(child, selectedLocations);
        }
        const locationsInParent = root.children!.filter(
            (c) => selectedLocations.findIndex((l) => l.locationId === c.locationId) >= 0
        );
        if (locationsInParent.length === root.children?.length) {
            locationsInParent.forEach((l) => {
                const index = selectedLocations.findIndex((r) => r.locationId === l.locationId);
                selectedLocations.splice(index, 1);
            });
            selectedLocations.push({
                locationId: root.locationId,
                name: root.name,
            });
        }
    }
    return selectedLocations;
};
export function checkValidNumberPhone(
    parseValue: string,
    parseCountry: string
): boolean | undefined {
    const phoneUtil = googleLibphonenumber.PhoneNumberUtil.getInstance();
    return phoneUtil.isValidNumberForRegion(
        phoneUtil.parseAndKeepRawInput(parseValue, parseCountry),
        parseCountry
    );
}

export function parseCSVToJSON<T>(csv: string): T[] {
    const data = csv
        .split('\n')
        .map((e) => e.trim())
        .map((e) => e.split(',').map((e) => e.trim()));

    const dataCSV: T[] = [];
    for (let i = 1; i < data.length; i++) {
        const header = data[0];
        const object = {};
        data[i].forEach((value, index) => {
            Object.assign(object, {
                [header[index]]: value,
            });
        });
        dataCSV.push(object as T);
    }
    return dataCSV;
}

export function flatTreeLocationByRecursive(
    root: TreeLocationProps,
    arrayFlat: TreeLocationProps[] = []
) {
    const copyRoot = { ...root };
    delete copyRoot.children;
    arrayFlat.push(copyRoot);

    if (root.children && root.children?.length !== 0) {
        for (const child of root.children) flatTreeLocationByRecursive(child, arrayFlat);
    }
    return arrayFlat;
}

export function retrieveLocationIds(locations: LocationObjectGRPC[]) {
    return locations.map((location) => location?.locationId);
}

export function getEnumString(objEnum = {}, value: any) {
    const index = Object.values(objEnum).indexOf(value);
    if (index >= 0) {
        return Object.keys(objEnum)[index];
    }
    return '';
}

export async function importGradeMaster(cms: CMSInterface) {
    const cmsToken = await cms.getToken();

    await cms.attach('School admin imports grade master data');
    await retry(
        async function () {
            await MastermgmtImportService.importBobData(cmsToken, MasterCategory.Grade);
        },
        { retries: 2, delay: 1000 }
    ).catch(function (reason) {
        throw Error(`Import grade master data failed: ${JSON.stringify(reason)}`);
    });
}

export async function getAllGradeMaster(cms: CMSInterface) {
    await cms.attach('Get All Grade Master');
    const gradeList = await getGradeList(cms, 100);

    if (!arrayHasItem(gradeList)) {
        await cms.attach('Dont have any grade');
        await cms.attach('Importing grade master-data...');
        await importGradeMaster(cms);
        await cms.attach('Get grade master again');
        const gradeList = await getGradeList(cms, 100);
        return gradeList;
    }
    return gradeList;
}

export async function getRandomGradeMaster(cms: CMSInterface) {
    const grades = await getAllGradeMaster(cms);
    const randomIdxGrade = randomInteger(0, grades.length - 1);
    const randomGrade = grades[randomIdxGrade];
    await cms.attach(`Get random Grade Master: ${JSON.stringify(randomGrade)}`);
    if (!randomGrade) {
        await cms.attach(
            `Not found random Grade Master. Idx: ${randomIdxGrade}, all Grades master ${JSON.stringify(
                grades
            )}`
        );
    }
    return randomGrade;
}

export function addDayFromDate(currentDate: Date, amount: number): string {
    return moment(currentDate || new Date())
        .add(amount, 'days')
        .format('YYYY/MM/DD');
}
