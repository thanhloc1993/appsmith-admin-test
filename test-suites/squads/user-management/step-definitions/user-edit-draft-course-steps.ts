import { deleteButton, tableEmptyMessage } from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    studentCoursePackageListAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';
import { studentCourseUpsertDeleteAction } from '@user-common/cms-selectors/students-page';

import { Given, Then, When } from '@cucumber/cucumber';

import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { schoolAdminGoesToStudentDetailPage } from './user-definition-utils';
import {
    convertAmountToNumberDraftCourse,
    CoursesTypes,
    DraftCoursesActions,
    DraftCoursesAmount,
    getBaseCheckboxTableCoursePopup,
    schoolAdminCannotInteractiveDraftCourse,
    schoolAdminInteractiveDraftCourse,
} from './user-edit-draft-course-definitions';
import { verifyStudentPackagesListInStudentDetails } from './user-view-student-details-definitions';

Given(
    'school admin adds {string} draft courses to popup',
    async function (this, numberCourses: string) {
        const cms = this.cms!;
        const scenarioContext = this.scenario;

        const student = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        const studentPackages = scenarioContext.get<StudentCoursePackageEntity[]>(
            studentCoursePackageListAliasWithAccountRoleSuffix('student')
        );

        await schoolAdminGoesToStudentDetailPage(cms, student);

        await verifyStudentPackagesListInStudentDetails(cms, studentPackages);

        await cms.selectAButtonByAriaLabel('Edit');

        const parseIntNumberCourses = parseInt(numberCourses);

        if (parseIntNumberCourses)
            await cms.selectAButtonByAriaLabel('Create', { onClickTimes: parseInt(numberCourses) });
    }
);

Given("school admin can't delete any draft course", async function (this) {
    const cms = this.cms!;

    await cms.instruction("School admin can't click button delete", async function () {
        const buttonDelete = await cms.page?.waitForSelector(studentCourseUpsertDeleteAction);

        const isDisabled = await buttonDelete?.isDisabled();

        weExpect(isDisabled).toBe(true);
    });
});

When(
    'school admin {string} {string} {string} course',
    async function (
        this,
        actions: DraftCoursesActions,
        amount: DraftCoursesAmount,
        type: CoursesTypes
    ) {
        const cms = this.cms!;

        const checkboxCourses = await getBaseCheckboxTableCoursePopup(cms);

        if (type === CoursesTypes.DRAFT) {
            await schoolAdminInteractiveDraftCourse(cms, checkboxCourses, actions, amount, type);
            return;
        }
        await schoolAdminCannotInteractiveDraftCourse(cms, checkboxCourses, actions, amount, type);
    }
);

When('school admin deletes the selected course from popup', async function (this) {
    const cms = this.cms!;

    await cms.selectAButtonByAriaLabel(deleteButton);
});

Then(
    'school admin sees {string} draft course deleted and {string} previous added course on popup',
    async function (this, amount: DraftCoursesAmount, numberCourse: string) {
        const cms = this.cms!;

        const parseIntNumberCourse = parseInt(numberCourse);

        const totalCourse = parseIntNumberCourse + 3;

        const deletedNumberCourse = convertAmountToNumberDraftCourse(amount);

        const remainingCourse = totalCourse - deletedNumberCourse;

        if (remainingCourse) {
            await cms.instruction(
                `School admin sees ${remainingCourse} remaining draft course popup`,
                async function () {
                    const courses = await getBaseCheckboxTableCoursePopup(cms);

                    weExpect(
                        courses?.length,
                        `should render ${remainingCourse} on course table`
                    ).toBe(remainingCourse);
                }
            );
            return;
        }

        await cms.instruction(`School admin sees empty message on course popup`, async function () {
            await cms.page?.waitForSelector(tableEmptyMessage);
        });
    }
);

Then("school admin can't select previous added course", async function (this) {
    const cms = this.cms!;

    await cms.instruction(
        `School admin sees previous added course checkbox which isn't selected`,
        async function () {
            const baseInputCheckbox = await getBaseCheckboxTableCoursePopup(cms);

            const isCheckedOnCheckbox = await Promise.all(
                baseInputCheckbox.map((course) => course.isChecked())
            );

            for (const isChecked of isCheckedOnCheckbox) {
                weExpect(isChecked, "checkbox shouldn't checked").toBe(false);
            }
        }
    );
});
