import { LearnerKeys } from '@common/learner-key';
import {
    kidProfilesOfParentAlias,
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface, LearnerInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import { StudentDetailTab } from '@supports/types/cms-types';

import { schoolAdminChooseTabInStudentDetail } from './user-create-student-definitions';
import { findNewlyCreatedLearnerOnCMSStudentsPage } from './user-definition-utils';
import { removeParentFromStudent } from './user-modify-parent-of-student-definitions';
import { clickOnStudentOnStudentsTab } from './user-view-student-details-definitions';
import { ByValueKey } from 'flutter-driver-x';
import {
    createStudentWithStatus,
    StatusTypes,
} from 'test-suites/squads/adobo/step-definitions/entry-exit-add-entry-exit-record-definitions';
import { schoolAdminCreateNewStudentWithExistingParentAndStatus } from 'test-suites/squads/adobo/step-definitions/entry-exit-parent-views-entry-exit-records-multiple-students-definitions';

export async function tapOnSwitchStudent(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    await learner.instruction('Select Switch Student on app drawer', async function () {
        const switchStudentDrawerItemFinder = new ByValueKey(LearnerKeys.switchStudentsButton);

        await driver.tap(switchStudentDrawerItemFinder);
    });
}

export async function checkStudentAvatarOnAppBar(
    parent: LearnerInterface,
    learner: UserProfileEntity
) {
    const driver = parent.flutterDriver!;

    const studentAvatarFinder = new ByValueKey(LearnerKeys.studentCurrentChildAvatar(learner.id));
    await driver.waitFor(studentAvatarFinder);
}

export async function parentSeesKidAtIndex(
    learner: LearnerInterface,
    kid: UserProfileEntity,
    role: AccountRoles,
    index: number
) {
    const driver = learner.flutterDriver!;
    const studentId = kid.id;

    const studentTileFinder = new ByValueKey(LearnerKeys.switchStudentKidTile(studentId, index));

    await learner.instruction(`${role} sees ${kid.name} at ${index}`, async function () {
        await driver.waitFor(studentTileFinder);
    });
}

export async function parentSeesKidWithCorrectAvatar(
    learner: LearnerInterface,
    kid: UserProfileEntity,
    role: AccountRoles
) {
    const driver = learner.flutterDriver!;
    const studentFirstNameInitial = kid?.firstName?.substring(0, 1) ?? '';

    const studentAvatarFinder = new ByValueKey(
        LearnerKeys.kidDefaultAvatar(kid.id, studentFirstNameInitial)
    );

    await learner.instruction(`${role} sees ${kid.name} with correct avatar`, async function () {
        await driver.waitFor(studentAvatarFinder);
    });
}

export async function tapToSwitchStudent(
    parent: LearnerInterface,
    studentId: string,
    scenarioContext?: ScenarioContext
) {
    const driver = parent.flutterDriver!;
    const entity = await parent.getKidsOfParent();
    const kids = entity.kidsOfParent;

    scenarioContext?.set(kidProfilesOfParentAlias, kids);

    let index: number;

    for (index = 0; index < kids.length; index++) {
        if (kids[index].id == studentId) {
            break;
        }
    }

    if (index == kids.length) {
        throw new Error('Student is listed as child of parent');
    }

    const studentTileFinder = new ByValueKey(LearnerKeys.switchStudentKidTile(studentId, index));
    await driver.tap(studentTileFinder);
}

export async function createStudentsWithSameParent(
    cms: CMSInterface,
    scenario: ScenarioContext,
    numOfStudents: number,
    role: AccountRoles
) {
    let studentRole: AccountRoles;

    const scenarioContext = scenario;
    for (let i = 0; i < numOfStudents; i++) {
        if (i == 0) {
            studentRole = 'student S1';

            await cms.instruction(
                `${role} creates ${studentRole}} with enrolled status and parent info`,
                async function () {
                    await createStudentWithStatus(
                        cms,
                        scenarioContext,
                        StatusTypes.ENROLLED,
                        studentRole
                    );
                }
            );
        } else {
            if (i == 1) {
                studentRole = 'student S2';
            } else {
                await cms.instruction('Find and click Students tab', async function () {
                    await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
                });
                studentRole = 'student S3';
            }

            const { context } = scenario;
            const parentProfiles: UserProfileEntity[] = context.get(
                parentProfilesAliasWithAccountRoleSuffix('student S1')
            );

            await schoolAdminCreateNewStudentWithExistingParentAndStatus(
                cms,
                scenario,
                studentRole,
                parentProfiles,
                StatusTypes.ENROLLED
            );
        }
    }
}

export async function userSeesNoStudentAssociated(parent: LearnerInterface) {
    const driver = parent.flutterDriver!;
    const noStudentsAssociatedFinder = new ByValueKey(LearnerKeys.noStudentsAssociated);
    await driver.waitFor(noStudentsAssociatedFinder);
}

export async function removeParentOfStudent(
    cms: CMSInterface,
    scenario: ScenarioContext,
    studentRole: AccountRoles
) {
    const studentKey = learnerProfileAliasWithAccountRoleSuffix(studentRole);
    const parentKey = parentProfilesAliasWithAccountRoleSuffix(studentRole);

    const learnerProfile = scenario.get<UserProfileEntity>(studentKey);
    const parentProfiles = scenario.get<UserProfileEntity[]>(parentKey);

    await cms.instruction(`Find student ${learnerProfile.name} on student list`, async function () {
        await findNewlyCreatedLearnerOnCMSStudentsPage(cms, learnerProfile);
    });

    // Go to Student Detail
    await cms.instruction(
        `Click student ${learnerProfile.name} on student list`,
        async function () {
            await clickOnStudentOnStudentsTab(cms, learnerProfile);
        }
    );

    await cms.instruction(`Go to Family Tab`, async function () {
        await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
    });

    await cms.instruction('School admin removes parent from student', async function () {
        await removeParentFromStudent(cms, parentProfiles[0]);
    });
}
