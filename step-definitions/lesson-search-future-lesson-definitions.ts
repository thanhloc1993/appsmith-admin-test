import { CMSInterface } from '@supports/app-types';

import * as LessonManagementKeys from './cms-selectors/lesson-management';
import { clearInput } from './lesson-management-utils';
import { userIsOnLessonDetailPage } from './lesson-teacher-can-delete-individual-lesson-report-of-future-lesson-definitions';
import { retrieveLessonEndpoint } from 'step-definitions/endpoints/lesson-management';

export async function searchLessonOfLessonManagement(cms: CMSInterface, keyword: string) {
    const page = cms.page!;

    await clearInput(cms, LessonManagementKeys.lessonFormFilterAdvancedTextFieldInput);

    await cms.instruction(
        `Search lesson management by keyword: ${keyword}`,
        async function (this: CMSInterface) {
            await page.fill(LessonManagementKeys.lessonFormFilterAdvancedTextFieldInput, keyword);
            await Promise.all([
                cms.waitForGRPCResponse(retrieveLessonEndpoint),
                page.press(LessonManagementKeys.lessonFormFilterAdvancedTextFieldInput, 'Enter'),
            ]);
        }
    );
}

export async function goToLessonInfoFirstLesson(cms: CMSInterface) {
    const page = cms.page!;

    await page.click(LessonManagementKeys.lessonLink);
    await userIsOnLessonDetailPage(cms);
}

export async function assertVisibleLessonManagementByStudentName(
    cms: CMSInterface,
    studentName: string
) {
    await goToLessonInfoFirstLesson(cms);

    const studentNameCols = await cms.page!.$$(LessonManagementKeys.lessonInfoStudentNameColumn);
    const studentNames = await Promise.all(studentNameCols.map((column) => column.textContent()));

    const isIncludeKeyword = studentNames.find((name) => name?.includes(studentName));
    weExpect(isIncludeKeyword).toBeDefined();
}

export async function seeEmptyResultLessonManagementList(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction(`See empty result icon`, async function () {
        await page.waitForSelector(LessonManagementKeys.lessonNoDataMessage);
    });
}

export async function seeKeywordInSearchBar(cms: CMSInterface, keyword: string) {
    const inputSearchValue = await cms.page!.inputValue(
        LessonManagementKeys.lessonFormFilterAdvancedTextFieldInput
    );

    weExpect(inputSearchValue).toEqual(keyword);
}
