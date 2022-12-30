import { aliasCourseId } from '@legacy-step-definitions/alias-keys/syllabus';
import { getRandomElement, getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { learnerProfileAlias } from '@user-common/alias-keys/user';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';
import {
    buttonSaveEditStudent,
    studentInputFirstNameSelector,
    studentInputLastNameSelector,
    studentInputFirstNamePhoneticSelector,
    studentInputLastNamePhoneticSelector,
} from '@user-common/cms-selectors/student';

import { CMSInterface, IMasterWorld } from '@supports/app-types';
import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { usermgmtUserModifierService } from '@supports/services/usermgmt-student-service';

import { createStudentPackageProfiles } from './user-create-student-definitions';
import {
    findNewlyCreatedLearnerOnCMSStudentsPage,
    gotoEditPageOnCMS,
    schoolAdminSeesDetailStudentCorrectly,
} from './user-definition-utils';
import {
    clickOnStudentOnStudentsTab,
    NeverLoggedInTagCondition,
    seeNewlyCreatedStudentOnCMS,
} from './user-view-student-details-definitions';

export async function addCoursesForStudent(
    cms: CMSInterface,
    {
        courseIds,
        studentId,
        startTime,
        endTime,
        studentPackageId,
        locationId,
    }: {
        courseIds: string[];
        studentId: string;
        locationId: string;
        startTime?: Date;
        endTime?: Date;
        studentPackageId?: string;
    }
) {
    const [token] = await Promise.all([cms.getToken(), cms.getProfile()]);
    const studentPackages = (
        await createStudentPackageProfiles(cms, { courseIds, startTime, endTime })
    ).map((studentPackageProfile) => ({
        studentPackageId: studentPackageId || '',
        locationId,
        ...studentPackageProfile,
    }));

    return await usermgmtUserModifierService.upsertStudentCoursePackageReq(token, {
        studentId: studentId,
        studentPackages,
    });
}

export async function schoolAdminHasAddCourseToStudentByGRPC(this: IMasterWorld) {
    const scenario = this.scenario;
    const courseId = scenario.get(aliasCourseId);
    await this.cms.instruction(
        'The new course is add to student',
        async function (this: CMSInterface) {
            const profile = getUserProfileFromContext(
                scenario,
                learnerProfileAliasWithAccountRoleSuffix('student')
            );
            const randomLocation = getRandomElement(profile.locations || []);

            await addCoursesForStudent(this, {
                courseIds: [courseId],
                studentId: profile.id,
                locationId: randomLocation.locationId,
            });
        }
    );
}

export async function goToEditStudentDetailPage(
    master: IMasterWorld,
    learnerProfile: UserProfileEntity,
    parents: Array<UserProfileEntity>,
    studentCoursePackages: Array<StudentCoursePackageEntity> = []
) {
    const cms = master.cms;
    const page = cms.page!;

    await page.reload();

    await seeNewlyCreatedStudentOnCMS({
        cms,
        data: { learnerProfile, parents, studentCoursePackages },
    });
    await gotoEditPageOnCMS(cms, 'Student');
}

export async function updateStudentName(master: IMasterWorld, learnerProfile: UserProfileEntity) {
    const cms = master.cms;
    const page = cms.page!;

    const { context } = master.scenario;
    await cms.instruction('Fill a new name for the student', async () => {
        const firstName = `${learnerProfile.firstName}-edited`;
        const lastName = `${learnerProfile.lastName}-edited`;
        const name = `${lastName} ${firstName}`;
        const firstNamePhonetic = `${learnerProfile.firstNamePhonetic}-edited`;
        const lastNamePhonetic = `${learnerProfile.lastNamePhonetic}-edited`;
        const fullNamePhonetic = `${lastNamePhonetic} ${firstNamePhonetic}`;

        await page.fill(studentInputFirstNameSelector, firstName);
        await page.fill(studentInputLastNameSelector, lastName);
        await page.fill(studentInputFirstNamePhoneticSelector, firstNamePhonetic);
        await page.fill(studentInputLastNamePhoneticSelector, lastNamePhonetic);

        context.set(learnerProfileAlias, {
            ...learnerProfile,
            firstName,
            lastName,
            name,
            firstNamePhonetic,
            lastNamePhonetic,
            fullNamePhonetic,
        });
    });

    await cms.instruction('Update student info', async () => {
        await page.click(buttonSaveEditStudent);
    });
}

export async function schoolAdminSeesEditedStudentOnCMS(
    cms: CMSInterface,
    learnerProfile: UserProfileEntity,
    neverLoggedInTagCondition: NeverLoggedInTagCondition = {
        shouldVerifyNeverLoggedInTag: false,
        hasLoggedInTag: false,
    }
) {
    await cms.instruction(`Find student ${learnerProfile.name} on student list`, async function () {
        await findNewlyCreatedLearnerOnCMSStudentsPage(
            cms,
            learnerProfile,
            neverLoggedInTagCondition,
            true
        );
    });

    await cms.instruction(
        `Click student ${learnerProfile.name} on student list`,
        async function () {
            await clickOnStudentOnStudentsTab(cms, learnerProfile);
        }
    );
    await cms.waitingForLoadingIcon();

    await cms.instruction('School admin sees data detail student correctly', async function () {
        await schoolAdminSeesDetailStudentCorrectly(cms, learnerProfile);
    });
}

export async function schoolAdminClicksOnCancelButton(cms: CMSInterface) {
    await cms.instruction(
        'school admin clicks on cancel button',
        async function (this: CMSInterface) {
            await this.selectAButtonByAriaLabel('Cancel');
        }
    );
}

export async function schoolAdminClicksOnCloseButton(cms: CMSInterface) {
    await cms.instruction(
        'school admin clicks on close button',
        async function (this: CMSInterface) {
            await this.selectAButtonByAriaLabel('close');
        }
    );
}

export async function discardStudentUpsertForm(cms: CMSInterface, button: string) {
    await cms.instruction(`school admin clicks on ${button} button`, async function () {
        if (button === 'cancel') {
            await schoolAdminClicksOnCancelButton(cms);
        } else if (button === 'escape') {
            await cms.page!.keyboard.press('Escape');
        } else {
            await schoolAdminClicksOnCloseButton(cms);
        }
    });
}
