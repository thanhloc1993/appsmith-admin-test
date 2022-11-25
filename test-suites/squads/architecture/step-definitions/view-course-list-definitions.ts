import {
    buttonNextPageTable,
    buttonPreviousPageTable,
    tableBaseFooter,
    tableBaseFooterSelect,
    tableBaseRowWithId,
} from '@legacy-step-definitions/cms-selectors/cms-keys';
import { courseTableName } from '@legacy-step-definitions/cms-selectors/course';

import { CMSInterface } from '@supports/app-types';
import { PageAction } from '@supports/types/cms-types';

export type CourseType = {
    country: string;
    course_id: string;
    display_order: number;
    grade: number;
    icon: string;
    name: string;
    school_id: number;
    subject: string;
};

export async function schoolAdminSeesCourseTable(
    cms: CMSInterface,
    courses: CourseType[]
): Promise<void> {
    await Promise.all(
        courses.map(
            async (course) => await cms.page?.waitForSelector(tableBaseRowWithId(course.course_id))
        )
    );
}

export async function checkTotalCourses(cms: CMSInterface, totalCourses: number): Promise<void> {
    const footerElement = await cms.page?.waitForSelector(tableBaseFooter);
    const footerContent = await footerElement?.textContent();

    weExpect(footerContent, 'course table contains total records').toContain(`${totalCourses}`);
}

export async function checkCourseTableRecord(
    cms: CMSInterface,
    courses: CourseType[] = []
): Promise<void> {
    const nameElements = await cms.page?.$$(courseTableName);
    if (!nameElements) {
        throw new Error('Not found column headers');
    }

    courses.map(async (course, index) => {
        const nameContent = await nameElements[index].textContent();
        weExpect(nameContent, 'course table contains course name').toBe(course.name);
    });
}

export async function checkCourseTablePagesAtLeast(
    cms: CMSInterface,
    totalCourses: number,
    pageNumber: number
): Promise<void> {
    const totalCoursesPerPageElement = await cms.page?.waitForSelector(tableBaseFooterSelect);
    const totalCoursesPerPage = await totalCoursesPerPageElement?.textContent();
    const totalPages = totalCoursesPerPage && totalCourses / +totalCoursesPerPage;

    weExpect(totalPages).toBeGreaterThanOrEqual(pageNumber);
}

export async function schoolAdminGoesToNextPage(cms: CMSInterface): Promise<void> {
    await cms.page?.click(buttonNextPageTable);
}

export async function schoolAdminClickNavigationButton(
    cms: CMSInterface,
    action: PageAction
): Promise<void> {
    const selector = action === PageAction.Previous ? buttonPreviousPageTable : buttonNextPageTable;
    await cms?.page?.click(selector);
}
