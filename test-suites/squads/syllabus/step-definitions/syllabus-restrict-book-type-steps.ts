import {
    getLearnerInterfaceFromRole,
    getRandomElement,
    getUserProfileFromContext,
} from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    aliasCourseId,
    aliasCourseIds,
    aliasCourseName,
    aliasCourseNames,
    aliasTaskAssignmentName,
} from './alias-keys/syllabus';
import { loAndAssignmentByName, studyPlanBookLink } from './cms-selectors/cms-keys';
import {
    schoolAdminGoToCourseDetail,
    schoolAdminIsOnCoursePage,
} from './syllabus-add-book-to-course-definitions';
import {
    schoolAdminSeeAllAddButtonDisabled,
    schoolAdminSeeAllMoveLOsDisabled,
    schoolAdminSeeAllToggleButtonDisabled,
} from './syllabus-restrict-book-type-definitions';
import {
    schoolAdminSelectStudyPlanOfStudent,
    schoolAdminSelectStudyPlanTabByType,
    schoolAdminWaitingStudyPlanDetailLoading,
} from './syllabus-study-plan-common-definitions';
import { createRandomCourses } from 'test-suites/common/step-definitions/course-definitions';
import { addCoursesForStudent } from 'test-suites/squads/user-management/step-definitions/user-update-student-definitions';

Given('school admin has created a course for student', async function (this: IMasterWorld) {
    const context = this.scenario;
    const cms = this.cms;
    const studentProfile = getUserProfileFromContext(
        context,
        learnerProfileAliasWithAccountRoleSuffix('student')
    );

    await this.cms.instruction('School admin create a course by calling gRPC', async function () {
        const { request } = await createRandomCourses(cms);

        context.set(aliasCourseId, request[0].id);
        context.set(aliasCourseName, request[0].name);
    });

    const courseId = context.get<string>(aliasCourseId);

    await this.cms.instruction(
        'School admin add a course for student by calling gRPC',
        async function () {
            const courseIdList = [courseId];
            const randomLocation = getRandomElement(studentProfile.locations || []);

            await addCoursesForStudent(cms, {
                courseIds: courseIdList,
                studentId: studentProfile.id,
                locationId: randomLocation.locationId,
            });
        }
    );
});

Given('school admin has created a course 2 for student', async function (this: IMasterWorld) {
    const context = this.scenario;
    const cms = this.cms;
    const courseNames: string[] = [];
    const courseIds: string[] = [];
    const course1 = context.get<string>(aliasCourseName);
    const course1Id = context.get<string>(aliasCourseId);
    courseNames.push(course1);
    courseIds.push(course1Id);
    const studentProfile = getUserProfileFromContext(
        context,
        learnerProfileAliasWithAccountRoleSuffix('student')
    );

    await this.cms.instruction('School admin create a course by calling gRPC', async function () {
        const { request } = await createRandomCourses(cms);

        context.set(aliasCourseId, request[0].id);
        context.set(aliasCourseName, request[0].name);
    });

    const courseId = context.get<string>(aliasCourseId);
    courseNames.push(context.get<string>(aliasCourseName));
    courseIds.push(courseId);
    context.set(aliasCourseName, course1);
    context.set(aliasCourseId, course1Id);
    context.set(aliasCourseIds, courseIds);
    context.set(aliasCourseNames, courseNames);

    await this.cms.instruction(
        'School admin add a course for student by calling gRPC',
        async function () {
            const courseIdList = [courseId];
            const randomLocation = getRandomElement(studentProfile.locations || []);

            await addCoursesForStudent(cms, {
                courseIds: courseIdList,
                studentId: studentProfile.id,
                locationId: randomLocation.locationId,
            });
        }
    );
});

Then(
    'school admin sees the auto-generated study plan of {string} in individual tab',
    async function (this: IMasterWorld, role: AccountRoles) {
        const scenario = this.scenario;
        const cms = this.cms;
        const courseName = scenario.get(aliasCourseName);
        const learner = getLearnerInterfaceFromRole(this, role);
        const learnerProfile = await learner.getProfile();

        await this.cms.instruction(`School admin goes to course page`, async function () {
            await schoolAdminIsOnCoursePage(cms);
        });

        await this.cms.instruction(`School admin goes to course ${courseName}`, async function () {
            await schoolAdminGoToCourseDetail(cms, courseName);
        });

        await this.cms.instruction(
            `School admin goes to individual study plan tab`,
            async function () {
                await schoolAdminSelectStudyPlanTabByType(cms, 'student');
            }
        );

        await this.cms.instruction(
            `School admin click to the the auto-generated study plan of ${learnerProfile.name}`,
            async function () {
                const studyPlanName = `${learnerProfile.name}'s To-do`;

                await schoolAdminSelectStudyPlanOfStudent(cms, learnerProfile.name, studyPlanName);
                await schoolAdminWaitingStudyPlanDetailLoading(cms);
            }
        );
    }
);

Then(
    'school admin sees the auto-generated book of {string} in study plan detail',
    async function (this: IMasterWorld, role: AccountRoles) {
        const scenario = this.scenario;
        const cms = this.cms;
        const courseName = scenario.get(aliasCourseName);
        const learner = getLearnerInterfaceFromRole(this, role);
        const learnerProfile = await learner.getProfile();

        const bookName = `${learnerProfile.name}'s To-do`;

        await this.cms.instruction(
            `School admin sees book ${bookName} is displayed in course ${courseName}`,
            async function () {
                const linkByText = (linkSelector: string, text: string) =>
                    `${linkSelector} p:has-text("${text}")`;

                const bookLinkElement = await cms.page!.waitForSelector(
                    linkByText(studyPlanBookLink, bookName)
                );

                await bookLinkElement?.click();
                await schoolAdminWaitingStudyPlanDetailLoading(cms);
            }
        );
    }
);

Then(
    'school admin cannot edit the auto-generated book of {string}',
    async function (this: IMasterWorld, role: AccountRoles) {
        const context = this.scenario;
        const cms = this.cms;
        const learner = getLearnerInterfaceFromRole(this, role);
        const learnerProfile = await learner.getProfile();

        const taskAssignmentName = context.get<string>(aliasTaskAssignmentName);

        await this.cms.instruction(
            `School admin sees task assignment ${taskAssignmentName} of ${learnerProfile.name}`,
            async function () {
                await cms.page?.waitForSelector(loAndAssignmentByName(taskAssignmentName));
            }
        );

        await cms.instruction(
            `School admin cannot click the toggle button in book detail page`,
            async () => {
                await schoolAdminSeeAllToggleButtonDisabled(cms);
            }
        );

        await cms.instruction(
            `School admin cannot click the any add new LO/Topic/Chapter buttons in book detail page`,
            async () => {
                await schoolAdminSeeAllAddButtonDisabled(cms);
            }
        );
    }
);

Then('school admin cannot move 2 task assignments', async function (this: IMasterWorld) {
    const cms = this.cms;
    await cms.instruction(
        `School admin cannot click any move up/down button in book detail page`,
        async () => {
            await schoolAdminSeeAllMoveLOsDisabled(cms);
        }
    );
});
