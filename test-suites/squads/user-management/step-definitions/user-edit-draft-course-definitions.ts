import {
    dialogWithHeaderFooterWrapper,
    tableBaseCheckbox,
    tableBaseRow,
    tableWithCheckboxHeader,
} from '@user-common/cms-selectors/students-page';

import { ElementHandle } from 'playwright';

import { CMSInterface } from '@supports/app-types';

export enum DraftCoursesActions {
    SELECTS = 'selects',
    DESELECTS = 'deselects',
    RE_SELECTS = 're-selects',
}
export enum DraftCoursesAmount {
    ONE = 'one',
    MULTIPLE = 'multiple',
    ALL = 'all',
}

export enum CoursesTypes {
    DRAFT = 'draft',
    PREVIOUS_ADDED = 'previous added',
}

export function convertAmountToNumberDraftCourse(amount: DraftCoursesAmount): number {
    let number = 1;

    switch (amount) {
        case DraftCoursesAmount.MULTIPLE:
            number = 2;
            break;
        case DraftCoursesAmount.ALL:
            number = 3;
            break;
        case DraftCoursesAmount.ONE:
            number = 1;
            break;
        default:
            throw new Error('Not found amount course');
    }
    return number;
}

export async function getBaseCheckboxTableCoursePopup(
    cms: CMSInterface
): Promise<ElementHandle<SVGElement | HTMLElement>[]> {
    const dialogAddCourse = await cms.page?.waitForSelector(dialogWithHeaderFooterWrapper);

    const courses = await dialogAddCourse?.$$(tableBaseRow);

    if (!courses) throw new Error('Not found courses in table');

    const baseInputCheckbox = await Promise.all(
        courses.map((course) => course.waitForSelector(tableBaseCheckbox))
    );

    return baseInputCheckbox;
}

export async function schoolAdminInteractiveDraftCourse(
    cms: CMSInterface,
    checkboxCourses: ElementHandle<SVGElement | HTMLElement>[],
    actions: DraftCoursesActions,
    amount: DraftCoursesAmount,
    type: CoursesTypes
) {
    const number = convertAmountToNumberDraftCourse(amount);

    const selectedCourses = checkboxCourses.slice(checkboxCourses.length - number);

    if (amount !== DraftCoursesAmount.ALL) {
        for (const input of selectedCourses) {
            await input.click();
        }
    } else {
        await cms.selectElementByDataTestId(tableWithCheckboxHeader);
    }

    const isCheckedCourse = await Promise.all(selectedCourses.map((input) => input.isChecked()));

    await cms.instruction(`School admin ${actions} ${amount} ${type} course`, async function () {
        for (const isChecked of isCheckedCourse) {
            if (actions === DraftCoursesActions.DESELECTS) {
                weExpect(isChecked, 'course should not be checked').toBe(false);
            } else {
                weExpect(isChecked, 'course should be checked').toBe(true);
            }
        }
    });
}

export async function schoolAdminCannotInteractiveDraftCourse(
    cms: CMSInterface,
    checkboxCourses: ElementHandle<SVGElement | HTMLElement>[],
    actions: DraftCoursesActions,
    amount: DraftCoursesAmount,
    type: CoursesTypes
) {
    const number = convertAmountToNumberDraftCourse(amount);

    const selectedCourses = checkboxCourses.slice(checkboxCourses.length - number);

    const isDisabledCourse = await Promise.all(
        selectedCourses.map((course) => course.isDisabled())
    );

    await cms.instruction(
        `School admin cannot ${actions} ${amount} ${type} course`,
        async function () {
            for (const isDisabled of isDisabledCourse) {
                weExpect(isDisabled, 'course should be disabled').toBe(true);
            }
        }
    );
}
