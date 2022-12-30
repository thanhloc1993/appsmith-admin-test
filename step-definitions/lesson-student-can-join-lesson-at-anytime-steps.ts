import { Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';
import { CreateLessonRequestData } from '@supports/services/bob-lesson-management/bob-lesson-management-service';

import { aliasLessonId, aliasLessonInfo, aliasLessonName } from './alias-keys/lesson';
import { learnerCanJoinLiveLesson } from './lesson-student-can-join-lesson-at-anytime-definitions';
import { getLearnerInterfaceFromRole } from './utils';
import { learnerSelectsRespectiveLessonDateOnTheCalendar } from 'test-suites/squads/virtual-classroom/utils/lesson';

Then('{string} can join lesson on Learner App', async function (role: AccountRoles) {
    const lessonId = this.scenario.get(aliasLessonId);
    const lessonName = this.scenario.get(aliasLessonName);
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(`${role} can join lesson on Learner App`, async function () {
        await learnerCanJoinLiveLesson(learner, lessonId, lessonName);
    });
});

When(
    '{string} selects respective lesson date on the calendar',
    async function (learnerRole: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, learnerRole);
        const lessonInfo = this.scenario.get<CreateLessonRequestData>(aliasLessonInfo);

        await learner.instruction(
            'student selects respective lesson date on the calendar',
            async function () {
                await learnerSelectsRespectiveLessonDateOnTheCalendar(
                    learner,
                    lessonInfo.startTime
                );
            }
        );
    }
);
