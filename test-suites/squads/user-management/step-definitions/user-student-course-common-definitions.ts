import * as studentPageSelectors from '@user-common/cms-selectors/students-page';
import { chooseAutocompleteOptionByExactText } from '@user-common/utils/autocomplete-actions';

import { CMSInterface } from '@supports/app-types';

import { selectorEndRowStudentCourseUpsertTable } from './user-definition-utils';

export async function clickAddCourseButton(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction(`Click Add course button`, async function () {
        const addCourseDurationButton = await page?.waitForSelector(
            studentPageSelectors.addNewCourseButton
        );
        await addCourseDurationButton?.click();
    });
}

export async function selectCourseWithName(
    cms: CMSInterface,
    courseName: string,
    isReselect?: boolean
) {
    await cms.instruction(
        `${isReselect ? 'Re-select course' : 'Select course'}: ${courseName}`,
        async function () {
            const endRowTableCourse = await selectorEndRowStudentCourseUpsertTable(cms);

            const courseCell = endRowTableCourse?.locator(
                studentPageSelectors.studentCourseUpsertTableCourseName
            );

            const inputCourse = courseCell?.getByPlaceholder('Name');
            isReselect && (await inputCourse?.selectText());

            await inputCourse?.type(courseName, { delay: 100 });

            //Debounced time
            await cms.page?.waitForTimeout(1000);

            await cms.waitingAutocompleteLoading(
                studentPageSelectors.formCourseInfoAutoCompleteCourse
            );

            await chooseAutocompleteOptionByExactText(cms, courseName);
        }
    );
}

export async function clickToOpenLocationDropdownOptions(cms: CMSInterface) {
    await cms.instruction('Click to open location dropdown options', async function () {
        const endRowTableCourse = await selectorEndRowStudentCourseUpsertTable(cms);

        const locationCell = endRowTableCourse?.locator(
            studentPageSelectors.studentCourseUpsertTableLocation
        );
        const inputLocation = locationCell?.getByPlaceholder('Location');

        await inputLocation?.click();
    });
}
