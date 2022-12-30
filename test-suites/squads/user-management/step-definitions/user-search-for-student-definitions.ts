import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import { toShortenStr } from '@legacy-step-definitions/utils';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { MappedLearnerProfile } from '@supports/entities/user-profile-entity';

import { findNewlyCreatedStudent } from './user-definition-utils';

export async function filterStudentByCourseGrade(
    cms: CMSInterface,
    option: string,
    student: MappedLearnerProfile
) {
    const page = cms.page!;
    const gradeField = await page.waitForSelector(CMSKeys.gradeMasterAutoCompleteHFRoot);
    const courseField = await page.waitForSelector(CMSKeys.courseAutocompleteHFRoot);

    await cms.instruction(
        `School admin chooses ${option} and clicks apply button`,
        async function () {
            if (option === 'grade') {
                await gradeField.click();
                await cms.chooseOptionInAutoCompleteBoxByText(student?.gradeMaster?.name || '');
                await gradeField.click();
            } else if (option === 'course') {
                await courseField.click();
                await cms.chooseOptionInAutoCompleteBoxByText(toShortenStr(student.courses?.[0]));
                await courseField.click();
            } else {
                await gradeField.click();
                await cms.chooseOptionInAutoCompleteBoxByText(student?.gradeMaster?.name || '');
                await gradeField.click();
                await courseField.click();
                await cms.chooseOptionInAutoCompleteBoxByText(toShortenStr(student.courses?.[0]));
                await courseField.click();
            }
            const applyBtn = await page.waitForSelector(CMSKeys.applyFilterAdvancedButton);
            await applyBtn.click();
            await page.keyboard.press('Escape');
            await page.waitForSelector(CMSKeys.lookingForIcon, {
                state: 'hidden',
            });
            await cms.waitForSkeletonLoading();
        }
    );
}

export async function assertStudentWithCourseGrade(
    cms: CMSInterface,
    student: MappedLearnerProfile,
    option: string
) {
    const newlyCreatedStudentItem = await findNewlyCreatedStudent(cms, student);
    const newlyCreatedStudentGradeItem = await newlyCreatedStudentItem!.waitForSelector(
        studentPageSelectors.tableStudentGrade,
        { timeout: 10000 }
    );
    const newlyCreatedStudentGrade = await newlyCreatedStudentGradeItem.innerText();
    const newlyCreatedStudentCourseItem = await newlyCreatedStudentItem!.waitForSelector(
        studentPageSelectors.tableStudentCourse,
        { timeout: 10000 }
    );
    const newlyCreatedStudentCourses = await newlyCreatedStudentCourseItem.innerText();
    if (option === 'grade') {
        weExpect(newlyCreatedStudentGrade, 'The new student grade should match with the UI').toBe(
            student.gradeMaster?.name
        );
    } else if (option === 'course') {
        weExpect(
            newlyCreatedStudentCourses,
            'The new student course should match with the UI'
        ).toContain(student.courses?.[0]);
    } else {
        weExpect(newlyCreatedStudentGrade, 'The new student grade should match with the UI').toBe(
            student.gradeMaster?.name
        );
        weExpect(
            newlyCreatedStudentCourses,
            'The new student course should match with the UI'
        ).toContain(student.courses[0]);
    }
}
