import {
    getLearnerInterfaceFromRole,
    getRandomElement,
    getUserProfileFromContext,
    randomInteger,
    splitAndCombinationIntoArray,
} from '@legacy-step-definitions/utils';
import { studentCoursePackagesAlias } from '@user-common/alias-keys/user';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { CourseDuration } from '@supports/entities/course-duration';
import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';

import {
    aliasNotificationCreatedCourseName,
    aliasSelectedReaderAccount,
} from './alias-keys/communication';
import {
    getReadNotificationAccountType,
    learnerClickOnNotificationIcon,
    ReadNotificationAccountType,
} from './communication-common-definitions';
import {
    CourseDateNotification,
    createSendNotificationByOfUserAccount,
    setStartDateAndEndDateByConditionCoursesOfNotification,
    verifyReceivedNotification,
} from './communication-send-notification-for-active-account-in-active-course-definitions';
import { addCoursesForStudent } from 'test-suites/squads/user-management/step-definitions/user-update-student-definitions';

Given(
    'school admin has set course which has {string} for student',
    async function (this: IMasterWorld, condition: CourseDuration): Promise<void> {
        const cms = this.cms;
        const context = this.scenario;
        const createdCourseName: string = context.get<string>(aliasNotificationCreatedCourseName);
        const studentCoursePackages: StudentCoursePackageEntity = context.get<
            StudentCoursePackageEntity[]
        >(studentCoursePackagesAlias)[0];
        const learner = getUserProfileFromContext(
            context,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        const randomLocation = getRandomElement(learner.locations || []);

        const { startTime, endTime }: CourseDateNotification =
            setStartDateAndEndDateByConditionCoursesOfNotification(condition);

        await cms.instruction(
            `Set course ${createdCourseName} with condition ${condition} for student ${learner.name}:
                startDate: ${startTime}
                endDate: ${endTime}`,
            async function () {
                await addCoursesForStudent(cms, {
                    courseIds: [''],
                    startTime,
                    endTime,
                    studentId: learner.id,
                    studentPackageId: studentCoursePackages.studentPackageId,
                    locationId: randomLocation.locationId,
                });
            }
        );
    }
);

When(
    `school admin creates {string} and send to {string} of user's course and user's grade`,
    async function (this: IMasterWorld, notificationType: string, receivers: string) {
        const randIndex = randomInteger(0, 1);
        const accountRole: ReadNotificationAccountType = getReadNotificationAccountType(
            receivers,
            randIndex
        );

        this.scenario.set(aliasSelectedReaderAccount, accountRole);

        await createSendNotificationByOfUserAccount(
            this.cms,
            this.scenario,
            accountRole,
            this.learner,
            notificationType
        );
    }
);

When(
    `school admin creates notification and sends to {string} of all course and grade`,
    async function (this: IMasterWorld, receivers: string) {
        const randIndex = randomInteger(0, 1);
        const accountRole: ReadNotificationAccountType = getReadNotificationAccountType(
            receivers,
            randIndex
        );

        this.scenario.set(aliasSelectedReaderAccount, accountRole);

        await createSendNotificationByOfUserAccount(
            this.cms,
            this.scenario,
            accountRole,
            this.learner,
            'notification'
        );
    }
);

Then(
    `{string} {string} notification on Learner App`,
    async function (this: IMasterWorld, receivers: string, willReceived: string) {
        const learner = this.learner;
        const cms = this.cms;

        const accountRole: ReadNotificationAccountType = this.scenario.get(
            aliasSelectedReaderAccount
        );

        const roles = splitAndCombinationIntoArray(accountRole);

        for (const role of roles) {
            const reader = getLearnerInterfaceFromRole(this, role as AccountRoles);

            await learner.instruction(
                `Click on notification button with role ${role}`,
                async function () {
                    await learnerClickOnNotificationIcon(reader);
                }
            );

            if (willReceived.includes('do not')) {
                await reader.instruction(`${role} don't receive notification`, async function () {
                    await verifyReceivedNotification(reader, false);
                });
            } else {
                await reader.instruction(`${role} receive notification`, async function () {
                    await verifyReceivedNotification(reader, true);
                });
            }
        }

        await cms.instruction(
            `Reload CMS page to check ${receivers} have read notification`,
            async function () {
                await cms.page?.reload();
            }
        );
    }
);
