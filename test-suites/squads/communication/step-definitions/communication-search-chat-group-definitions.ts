import { TeacherKeys } from '@legacy-step-definitions/teacher-keys/teacher-keys';
import { randomInteger, randomString } from '@legacy-step-definitions/utils';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';
import {
    buttonSaveEditStudent,
    studentInputNameSelector,
} from '@user-common/cms-selectors/student';

import { AccountRoles, CMSInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasPartialName } from './alias-keys/communication';
import {
    teacherTapApplyFilterButton,
    teacherTapFilterIconButton,
} from './communication-common-definitions';
import { ByValueKey } from 'flutter-driver-x';
import { createARandomStudentGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

export async function createStudentWithParent(
    cms: CMSInterface,
    context: ScenarioContext,
    accountRoleSuffix: AccountRoles
): Promise<void> {
    const studentKey = learnerProfileAliasWithAccountRoleSuffix(accountRoleSuffix);
    const parentKey = parentProfilesAliasWithAccountRoleSuffix(accountRoleSuffix);

    await cms.attach(
        `Create a student ${studentKey} with course, grade and parent ${parentKey} by gRPC`
    );

    const { student, parents } = await createARandomStudentGRPC(cms, {
        parentLength: 1,
        studentPackageProfileLength: 1,
    });

    // Set student and parent info for learner app login
    context.set(studentKey, student);
    context.set(parentKey, parents);
}

export async function teacherEnterSearchTextInConversationBar(
    teacher: TeacherInterface,
    searchText: string
) {
    const driver = teacher.flutterDriver!;

    const searchBarFinder = new ByValueKey(TeacherKeys.conversationFilterTextField);
    await driver.tap(searchBarFinder);
    await driver.enterText(searchText);
}

//Temporary using student Code instead student Name. Will replace when complete improve relevance Elastic search
export async function teacherSearchConversationByStudentName(
    teacher: TeacherInterface,
    studentCode: string
) {
    await teacherEnterSearchTextInConversationBar(teacher, studentCode);
    await teacherTapFilterIconButton(teacher);
    await teacherTapApplyFilterButton(teacher);
}

export async function teacherFilterConversationByCourseIds(
    teacher: TeacherInterface,
    courseIds: string[]
) {
    const driver = teacher.flutterDriver!;

    const coursePopupButtonFinder = new ByValueKey(
        TeacherKeys.filterConversationByCoursePopupButton
    );
    const hidePopupFinder = new ByValueKey(TeacherKeys.hideMenuSelectCourseDropDown);

    const scrollViewFinder = new ByValueKey(TeacherKeys.courseFilterScrollView);
    for (const courseId of courseIds) {
        // Open course list filter
        await driver.tap(coursePopupButtonFinder);

        const courseItemFinder = new ByValueKey(
            TeacherKeys.filterConversationByCourseItemKey(courseId)
        );
        await driver.scrollUntilVisible(scrollViewFinder, courseItemFinder, 0.0, 0.0, -200, 20000);
        await driver.tap(courseItemFinder);

        // Close course list filter
        await driver.tap(hidePopupFinder);
    }
}

export async function cmsUpdateStudentWithRandomName(cms: CMSInterface, scenario: ScenarioContext) {
    const page = cms.page!;

    const newNameArr = [randomString(10), randomString(10), randomString(10)];
    const randomIndex = randomInteger(0, newNameArr.length - 1);
    const partialName = newNameArr[randomIndex];
    scenario.set(aliasPartialName, partialName);

    await page.fill(studentInputNameSelector, newNameArr.join(' '));
    await page.click(buttonSaveEditStudent);
}
