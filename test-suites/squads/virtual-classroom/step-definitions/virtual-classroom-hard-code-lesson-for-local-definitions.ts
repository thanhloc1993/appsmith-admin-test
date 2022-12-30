import { LearnerKeys } from '@common/learner-key';
import { TeacherKeys } from '@common/teacher-keys';
import {
    aLearnerAlreadyLoginSuccessInLearnerWeb,
    fillUserNameAndPasswordLearnerWeb,
} from '@legacy-step-definitions/learner-email-login-definitions';
import {
    aTeacherAlreadyLoginSuccessInTeacherWeb,
    teacherEnterAccountInformation,
} from '@legacy-step-definitions/teacher-email-login-definitions';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import {
    AccountRoles,
    IMasterWorld,
    LearnerInterface,
    TeacherInterface,
} from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { ByValueKey } from 'flutter-driver-x';
import { getLearnerInterfaceFromRole } from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasCourseId, aliasLessonId } from 'test-suites/squads/lesson/common/alias-keys';
import { userAuthenticationMultiTenant } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';
import { learnerOpensCalendarOnLearnerApp } from 'test-suites/squads/virtual-classroom/utils/lesson';
import {
    learnerClickJoinLesson,
    learnerGoToLesson,
} from 'test-suites/squads/virtual-classroom/utils/navigation';

export async function teacherLoginsAppLocal(_this: IMasterWorld, role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(_this, role);

    await teacher.instruction('User not login yet, see login form', async function () {
        await teacher.flutterDriver!.waitForAbsent(new ByValueKey(TeacherKeys.homeScreen), 15000);
    });

    await teacher.instruction('Fill username, password in login page', async function () {
        let userName = '';
        if (role === 'teacher' || role === 'teacher T1') {
            userName = 'trungkim.tran+virtual_teacher01@manabie.com';
        } else {
            userName = 'trungkim.tran+virtual_teacher02@manabie.com';
        }

        /// This function already had instruction inside
        await teacherEnterAccountInformation({
            teacher,
            username: userName,
            password: '123456',
        });
    });

    await teacher.instruction('Logged in, see home page', async function () {
        await aTeacherAlreadyLoginSuccessInTeacherWeb(teacher);
    });
}

export async function learnerLoginsAppLocal(_this: IMasterWorld, role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(_this, role);

    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );

    let userName = '';
    let userPassword = '';
    if (role === 'student' || role === 'student S1') {
        userName = 'trungkim.tran+virtual_learner01@manabie.com';
        userPassword = '8B27F0';
    } else {
        userName = 'trungkim.tran+virtual_learner02@manabie.com';
        userPassword = 'D6DAGS';
    }

    await learner.instruction('Fill username, password in login page', async function () {
        await fillUserNameAndPasswordLearnerWeb({
            learner,
            username: userName,
            password: userPassword,
            isMultiTenantLogin: isEnabledMultiTenantLogin,
        });
    });

    await learner.instruction(
        'Logged in, see welcome screen and press start button',
        async function () {
            await aLearnerAlreadyLoginSuccessInLearnerWeb(learner);
        }
    );
}

export async function teacherGoToLiveLessonDetailByURLLocal(
    teacher: TeacherInterface,
    context: ScenarioContext
) {
    const courseId = context.get(aliasCourseId);
    const lessonId = context.get(aliasLessonId);
    const driver = teacher.flutterDriver!;
    const websiteDomain = await driver.webDriver!.getUrlOrigin();
    const lessonLink = `${websiteDomain}liveLessonDetailScreen?course_id=${courseId}&lesson_id=${lessonId}`;

    await teacher.instruction(
        `Teacher go to live lesson detail screen by link: ${lessonLink}`,
        async function () {
            await driver.webDriver!.page.goto(lessonLink);
        }
    );
}

export async function learnerJoinsLessonLocal(
    learner: LearnerInterface,
    lessonId: string
): Promise<void> {
    await learnerGoToLesson(learner);
    await learnerOpensCalendarOnLearnerApp(learner);
    await learnerChoosesDesiredLessonDateToViewLessonLocal(learner);
    await learnerClickJoinLesson(learner, lessonId, '');
    const waitingRoom = new ByValueKey(LearnerKeys.waitingRoomTeacher);
    await learner.flutterDriver!.waitFor(waitingRoom, 10000);
}

async function learnerChoosesDesiredLessonDateToViewLessonLocal(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    const lessonStartDate = new Date(2022, 8, 30, 9, 30);

    const now = new Date().getMonth();

    if (now > lessonStartDate.getMonth()) {
        for (let i = lessonStartDate.getMonth(); i < now; i++) {
            await driver.tap(new ByValueKey(LearnerKeys.liveLessonScheduleCalendarPreviousButton));
        }
    }

    const calendarDay = new ByValueKey(
        LearnerKeys.normalDate(lessonStartDate.getDate(), lessonStartDate.getMonth())
    );
    await driver.tap(calendarDay);
    // Unfocus
    await driver.webDriver!.page.mouse.click(0, 0);
}
