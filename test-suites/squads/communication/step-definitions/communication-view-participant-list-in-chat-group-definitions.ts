import { getAccountProfileAliasOfStudent } from '@legacy-step-definitions/credential-account-definitions';
import { TeacherKeys } from '@legacy-step-definitions/teacher-keys/teacher-keys';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { AccountRoles, IMasterWorld, TeacherInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    conversationUserInfoAvatar,
    conversationUserInfoName,
    moreOptionButton,
    viewInfoButton,
} from './learner-keys/communication-key';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherMoveToParticipantList(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const menuPopupButtonFinder = new ByValueKey(TeacherKeys.conversationDetailMenuPopupButton);
    await driver.tap(menuPopupButtonFinder);

    const participantListFinder = new ByValueKey(TeacherKeys.participantListButton);
    await driver.tap(participantListFinder);
}

export async function teacherVerifyTeacherInParticipantList(
    master: IMasterWorld,
    teacher: TeacherInterface,
    teacherRole: AccountRoles,
    isDisplay = true
) {
    const profile = master.scenario.get<UserProfileEntity>(
        staffProfileAliasWithAccountRoleSuffix(teacherRole)
    );

    await teacherVerifyUserInfoInParticipantList(teacher, profile, isDisplay);
}

export async function teacherVerifyLearnerInParticipantList(
    master: IMasterWorld,
    teacher: TeacherInterface,
    accountRole: AccountRoles,
    studentRole: AccountRoles,
    isDisplay = true
) {
    const profile = getAccountProfileAliasOfStudent(master, accountRole, studentRole)!;

    await teacherVerifyUserInfoInParticipantList(teacher, profile, isDisplay);
}

async function teacherVerifyUserInfoInParticipantList(
    teacher: TeacherInterface,
    profile: UserProfileEntity,
    isDisplay = true
) {
    const driver = teacher.flutterDriver!;

    const avatarFinder = new ByValueKey(conversationUserInfoAvatar(profile.avatar, profile.id));
    isDisplay ? await driver.waitFor(avatarFinder) : await driver.waitForAbsent(avatarFinder);

    const nameFinder = new ByValueKey(conversationUserInfoName(profile.name, profile.id));
    isDisplay ? await driver.waitFor(nameFinder) : await driver.waitForAbsent(avatarFinder);
}

export async function teacherSelectsViewInfoOptionInParticipantList(
    teacher: TeacherInterface,
    userId: string
) {
    const driver = teacher.flutterDriver!;

    const moreOptionFinder = new ByValueKey(moreOptionButton(userId));
    await driver.tap(moreOptionFinder);

    const viewInfoFinder = new ByValueKey(viewInfoButton);
    await driver.tap(viewInfoFinder);
}

export async function teacherVerifyStudentInformation(
    teacher: TeacherInterface,
    profile: UserProfileEntity
) {
    const driver = teacher.flutterDriver!;

    const avatarFinder = new ByValueKey(TeacherKeys.studentInfoAvatar(profile.id, profile.avatar));
    await driver.waitFor(avatarFinder);

    const nameFinder = new ByValueKey(TeacherKeys.studentInfoName(profile.id, profile.name));
    await driver.waitFor(nameFinder);
}
