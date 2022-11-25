import { getUserProfileFromContext } from '@legacy-step-definitions/utils';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface, LearnerInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';

import { cmsAddExistedParentForStudent } from './communication-create-group-chat-definitions';
import { notificationItem, targetNameKey } from './learner-keys/communication-key';
import { ByValueKey } from 'flutter-driver-x';
import { createARandomStudentGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

export async function createParentWithTwoStudents(
    cms: CMSInterface,
    context: ScenarioContext,
    student1Role: AccountRoles,
    student2Role: AccountRoles
) {
    await createStudentWithParent(cms, context, student1Role);
    await createStudentWithParent(cms, context, student2Role);
    const student1Parent = context.get<Array<UserProfileEntity>>(
        parentProfilesAliasWithAccountRoleSuffix(student1Role)
    )[0];
    const student2Profile = getUserProfileFromContext(
        context,
        learnerProfileAliasWithAccountRoleSuffix(student2Role)
    );

    await cmsAddExistedParentForStudent(cms, student2Profile, student1Parent);
}

export async function parentSeesTwoItemsInNotificationList(parent: LearnerInterface) {
    const driver = parent.flutterDriver!;

    const firstNotificationItemFinder = new ByValueKey(notificationItem(0));
    const secondNotificationItemFinder = new ByValueKey(notificationItem(1));
    await driver.waitFor(firstNotificationItemFinder);
    await driver.waitFor(secondNotificationItemFinder);
}
export async function verifyStudentNameInNotificationDetailScreen(
    parent: LearnerInterface,
    notificationItemIndex: number,
    studentName: string
) {
    const driver = parent.flutterDriver!;
    const notificationItemFinder = new ByValueKey(notificationItem(notificationItemIndex));
    await driver.tap(notificationItemFinder);

    const targetNameFinder = new ByValueKey(targetNameKey(studentName));
    await driver.waitFor(targetNameFinder);
}

export async function createStudentWithParent(
    cms: CMSInterface,
    context: ScenarioContext,
    accountRoleSuffix: AccountRoles
) {
    const studentKey = learnerProfileAliasWithAccountRoleSuffix(accountRoleSuffix);
    const parentKey = parentProfilesAliasWithAccountRoleSuffix(accountRoleSuffix);

    const { student, parents } = await createARandomStudentGRPC(cms, {
        parentLength: 1,
        studentPackageProfileLength: 0,
    });

    // Set student and parent info for learner app login
    context.set(studentKey, student);
    context.set(parentKey, parents);
}
