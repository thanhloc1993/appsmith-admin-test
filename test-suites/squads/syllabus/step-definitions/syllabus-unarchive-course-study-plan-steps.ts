import {
    asyncForEach,
    createNumberArrayWithLength,
    getRandomElement,
} from '@legacy-step-definitions/utils';
import { learnersProfileAlias } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ActionOptions } from '@supports/types/cms-types';

import { aliasCourseId, aliasCourseStudyPlans } from './alias-keys/syllabus';
import * as StudyPlanKeys from './cms-selectors/study-plan';
import {
    getStudyPlanListByStatus,
    schoolAdminClickActionButtonInStudyPlanDetailPage,
    schoolAdminGoesToCourseStudyPlanDetailPage,
    schoolAdminIsOnStudyPlanTab,
    schoolAdminSeesStudyPlanContentActionState,
    schoolAdminSeeStudyPlanByStudent,
    schoolAdminSelectStudyPlanTabByType,
} from './syllabus-study-plan-common-definitions';
import { schoolAdminSeeTableRowTotal } from './syllabus-utils';
import { StudyPlanStatus } from 'manabuf/eureka/v1/enums_pb';
import { StudyPlan } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(
    'school admin unarchives {int} master study plans in master detail page',
    async function (quantity: number) {
        const context = this.scenario;
        const courseId = context.get<string>(aliasCourseId);

        await asyncForEach<number, void>(createNumberArrayWithLength(quantity), async () => {
            const courseStudyPlanList = context.get<StudyPlan[]>(aliasCourseStudyPlans);
            const archivedStudyPlanList = getStudyPlanListByStatus(
                courseStudyPlanList,
                StudyPlanStatus.STUDY_PLAN_STATUS_ARCHIVED
            );

            const archivedCourseStudyPlan = getRandomElement<StudyPlan>(archivedStudyPlanList);

            await this.cms.instruction(
                `School admin goes to master study plan ${archivedCourseStudyPlan.name} detail page`,
                async () => {
                    await schoolAdminIsOnStudyPlanTab(this.cms, courseId, 'master');

                    await schoolAdminGoesToCourseStudyPlanDetailPage(
                        this.cms,
                        archivedCourseStudyPlan.name
                    );
                }
            );

            await this.cms.instruction(
                `School admin clicks on unarchive button in master study plan detail page`,
                async () => {
                    await schoolAdminClickActionButtonInStudyPlanDetailPage(
                        this.cms,
                        ActionOptions.UNARCHIVE
                    );

                    const archivedCourseStudyPlanIndex = courseStudyPlanList.findIndex(
                        (studyPlan) => studyPlan.name === archivedCourseStudyPlan.name
                    );

                    courseStudyPlanList[archivedCourseStudyPlanIndex] = {
                        ...archivedCourseStudyPlan,
                        status: StudyPlanStatus.STUDY_PLAN_STATUS_ACTIVE,
                    };

                    context.set(aliasCourseStudyPlans, courseStudyPlanList);
                }
            );

            await this.cms.assertNotification('You have unarchived study plan successfully!');

            await this.cms.waitForSkeletonLoading();

            await this.cms.instruction(
                'School admin sees all actions of study plan content are enabled in master study plan detail page',
                async () => {
                    await schoolAdminSeesStudyPlanContentActionState(this.cms, false);
                }
            );
        });
    }
);

Then('school admin sees the active study plans in master tab', async function () {
    const context = this.scenario;
    const courseId = context.get<string>(aliasCourseId);
    const courseStudyPlanList = context.get<StudyPlan[]>(aliasCourseStudyPlans);
    const activeStudyPlanList = getStudyPlanListByStatus(
        courseStudyPlanList,
        StudyPlanStatus.STUDY_PLAN_STATUS_ACTIVE
    );

    await this.cms.instruction(
        `School admin goes to master study plan tab on course ${courseId} detail page`,
        async () => {
            await schoolAdminIsOnStudyPlanTab(this.cms, courseId, 'master');
        }
    );

    await this.cms.instruction(
        `School admin sees ${activeStudyPlanList.length} active study plan(s) in master tab`,
        async () => {
            await schoolAdminSeeTableRowTotal(this.cms, {
                wrapper: StudyPlanKeys.courseStudyPlanTable,
                rowTotal: activeStudyPlanList.length,
            });
        }
    );

    await asyncForEach(activeStudyPlanList, async (studyPlan) => {
        const { name } = studyPlan;

        await this.cms.instruction(
            `School admin see the active study plan ${name} in master tab`,
            async () => {
                await this.cms.page!.waitForSelector(
                    StudyPlanKeys.getCourseStudyPlanNameLink(name),
                    {
                        state: 'attached',
                    }
                );
            }
        );
    });
});

Then(
    'school admin sees the active study plans of all students in individual tab',
    async function () {
        const context = this.scenario;
        const courseStudyPlanList = context.get<StudyPlan[]>(aliasCourseStudyPlans);
        const activeStudyPlanList = getStudyPlanListByStatus(
            courseStudyPlanList,
            StudyPlanStatus.STUDY_PLAN_STATUS_ACTIVE
        );
        const studentProfileList = context.get<UserProfileEntity[]>(learnersProfileAlias);
        const numberActiveStudyPlansByStudents =
            activeStudyPlanList.length * studentProfileList.length;

        await this.cms.instruction(`School admin goes to individual study plan tab`, async () => {
            await schoolAdminSelectStudyPlanTabByType(this.cms, 'student');
        });

        await this.cms.instruction(
            `School admin sees ${studentProfileList.length} student(s) with ${numberActiveStudyPlansByStudents} active study plan(s)`,
            async () => {
                await schoolAdminSeeTableRowTotal(this.cms, {
                    wrapper: StudyPlanKeys.studentTable,
                    rowTotal: numberActiveStudyPlansByStudents,
                });
            }
        );

        for (const student of studentProfileList) {
            for (const studyPlan of activeStudyPlanList) {
                await this.cms.instruction(
                    `School admin sees the active study plan ${studyPlan.name} of student ${student.name} in individual tab`,
                    async () => {
                        const { name: studyPlanName, bookName, gradesList } = studyPlan;

                        await schoolAdminSeeStudyPlanByStudent(this.cms, student.name, {
                            studyPlanName,
                            bookName,
                            gradesList,
                        });
                    }
                );
            }
        }
    }
);
