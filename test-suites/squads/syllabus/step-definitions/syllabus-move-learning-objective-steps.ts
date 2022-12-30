import { getExpectIndexAfterMoved, getRandomElement } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld, LOType } from '@supports/app-types';
import { MoveDirection, Position } from '@supports/types/cms-types';

import {
    aliasCourseId,
    aliasCourseName,
    aliasStudyPlanName,
    aliasTopicName,
} from './alias-keys/syllabus';
import { loAndAssignmentRoot, tableBaseRow } from './cms-selectors/cms-keys';
import { teacherGoToCourseStudentDetail } from './create-course-studyplan-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    getLOsWillBeMove,
    schoolAdminMoveLOs,
    schoolAdminWaitingForLOsOrderEndPoint,
    schoolAdminWaitingLOsForTopic,
} from './syllabus-move-learning-objective-definitions';
import {
    schoolAdminSelectCourseStudyPlan,
    schoolAdminSelectStudyPlanOfStudent,
    schoolAdminSelectStudyPlanTabByType,
    schoolAdminWaitingStudyPlanDetailLoading,
} from './syllabus-study-plan-common-definitions';
import {
    studentSeeStudyPlanItem,
    teacherSeeStudyPlanItem,
} from './syllabus-study-plan-upsert-definitions';
import { studentGoToCourseDetail, studentRefreshHomeScreen } from './syllabus-utils';
import { convertOneOfStringTypeToArray } from 'test-suites/squads/syllabus/utils/common';

const aliasLONameMoved = `aliasLONameMoved`;
const aliasLOIndexMoved = `aliasLOIndexMoved`;
const aliasLOExpectIndexMoved = `aliasLOExpectIndexMoved`;

/*

Get (list)LO type to interactive loop list LOs and Assignment and filter them by LO type

Random LO to interactive then get index and name of them
Move LO random selected previous step by direction passed via BDD
Check result after move by direction passed via BDD
If moved change -> index + 1(down) || -1(up) and check name
Otherwise items(index) and check name

*/

Given(
    'school admin selects a content learning {string} is not at {string}',
    async function (this: IMasterWorld, loType: string, position: Position) {
        const direction: MoveDirection = position === 'top' ? 'up' : 'down';

        const topicName = this.scenario.get(aliasTopicName);

        await this.cms.instruction(`School admin waiting LOs of topic ${topicName}`, async () => {
            await schoolAdminWaitingLOsForTopic(this.cms, topicName);
        });

        await this.cms.instruction('School admin select LOs to move', async () => {
            const list = convertOneOfStringTypeToArray<LOType>(loType);

            const type = getRandomElement<LOType>(list);

            const { moveIndex, name } = await getLOsWillBeMove(this.cms, type, direction);
            this.scenario.set(aliasLOIndexMoved, moveIndex);
            this.scenario.set(aliasLONameMoved, name);

            this.scenario.set(
                aliasLOExpectIndexMoved,
                getExpectIndexAfterMoved(moveIndex, direction)
            );
        });
    }
);

When(
    'school admin moves {string} {string}',
    async function (this: IMasterWorld, _lo: string, direction: MoveDirection) {
        const moveIndex = this.scenario.get<number>(aliasLOIndexMoved);
        const loName = this.scenario.get<string>(aliasLONameMoved);

        await this.cms.instruction(
            `School move LO ${loName} at ${moveIndex} with ${direction} action`,
            async () => {
                await schoolAdminMoveLOs(this.cms, loName, direction, moveIndex);
                await schoolAdminWaitingForLOsOrderEndPoint(this.cms);
            }
        );
    }
);

Then(
    'school admin sees that content learning is moved {string} on CMS',
    async function (this: IMasterWorld, _direction: MoveDirection) {
        const expectIndex = this.scenario.get<number>(aliasLOExpectIndexMoved);
        const loName = this.scenario.get<string>(aliasLONameMoved);

        await this.cms.instruction(
            `School admin see ${loName} position at ${expectIndex}`,
            async () => {
                await this.cms.waitForSelectorHasText(
                    `${loAndAssignmentRoot} li:nth-child(${expectIndex + 1})`,
                    loName
                );
            }
        );
    }
);

Then(
    '{string} is moved {string} in the master study plan detail',
    async function (this: IMasterWorld, _lo: string, _direction: MoveDirection) {
        const studyPlanName = this.scenario.get(aliasStudyPlanName);
        const expectIndex = this.scenario.get<number>(aliasLOExpectIndexMoved);
        const loName = this.scenario.get<string>(aliasLONameMoved);

        await this.cms.instruction('User go the course study plan detail', async () => {
            await schoolAdminSelectCourseStudyPlan(this.cms, studyPlanName);

            await schoolAdminWaitingStudyPlanDetailLoading(this.cms);
        });

        await this.cms.instruction(
            `School admin see ${loName} position at ${expectIndex}`,
            async () => {
                await this.cms.waitForSelectorHasText(
                    `${tableBaseRow}:nth-child(${expectIndex + 1})`,
                    loName
                );
            }
        );
    }
);

Then(
    '{string} is moved {string} in the student study plan detail',
    async function (this: IMasterWorld, _lo: string, _direction: MoveDirection) {
        const expectIndex = this.scenario.get<number>(aliasLOExpectIndexMoved);
        const loName = this.scenario.get<string>(aliasLONameMoved);
        const studyPlanName = this.scenario.get(aliasStudyPlanName);

        await this.cms.page?.goBack();

        await this.cms.instruction('User select the student study plan tab', async () => {
            await schoolAdminSelectStudyPlanTabByType(this.cms, 'student');

            await this.cms.waitForSkeletonLoading();
        });

        const { name } = await this.learner.getProfile();

        await this.cms.instruction(
            `User goes to the study plan ${studyPlanName} of student ${name}`,
            async () => {
                await schoolAdminSelectStudyPlanOfStudent(this.cms, name, studyPlanName);
            }
        );

        await schoolAdminWaitingStudyPlanDetailLoading(this.cms);

        await this.cms.instruction(
            `School admin see ${loName} position at ${expectIndex}`,
            async () => {
                await this.cms.waitForSelectorHasText(
                    `${tableBaseRow}:nth-child(${expectIndex + 1})`,
                    loName
                );
            }
        );
    }
);

Then(
    'student sees the {string} moved {string} in Topic detail screen on Learner App',
    async function (this: IMasterWorld, _lo: string, _direction: MoveDirection) {
        const loName = this.scenario.get<string>(aliasLONameMoved);
        const moveIndex = this.scenario.get<number>(aliasLOExpectIndexMoved);
        const courseName = this.scenario.get(aliasCourseName);
        const topicName = this.scenario.get(aliasTopicName);

        await this.learner.instruction('Refresh learner app', async () => {
            await studentRefreshHomeScreen(this.learner);
        });

        await this.learner.instruction('Student go to the course student detail', async () => {
            await studentGoToCourseDetail(this.learner, courseName);
        });

        await this.learner.instruction('Student go to topic detail', async () => {
            await studentGoToTopicDetail(this.learner, topicName);
        });

        const instruction = `Student will see ${loName} keep order at ${moveIndex}`;
        await this.learner.instruction(instruction, async () => {
            await studentSeeStudyPlanItem(this.learner, topicName, loName, moveIndex);
        });
    }
);

Then(
    'teacher sees the {string} moved {string} in studyplan on Teacher App',
    async function (this: IMasterWorld, _lo: string, _direction: MoveDirection) {
        const loName = this.scenario.get<string>(aliasLONameMoved);
        const expectIndex = this.scenario.get<number>(aliasLOExpectIndexMoved);
        const courseId = this.scenario.get(aliasCourseId);
        const learnerProfile = await this.learner.getProfile();

        await this.teacher.instruction(
            `Teacher go to the course student detail: ${learnerProfile.name}`,
            async () => {
                await teacherGoToCourseStudentDetail(this.teacher, courseId, learnerProfile.id);
            }
        );

        const instruction = `Teacher will see ${loName} keep order at ${expectIndex}`;
        await this.teacher.instruction(instruction, async () => {
            await teacherSeeStudyPlanItem(this.teacher, loName, expectIndex);
        });
    }
);
