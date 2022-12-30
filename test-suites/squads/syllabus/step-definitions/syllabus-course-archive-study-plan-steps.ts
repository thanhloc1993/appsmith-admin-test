import {
    schoolAdminOpenFilterAdvanced,
    schoolAdminSeeEmptyTableMsg,
} from '@legacy-step-definitions/cms-common-definitions';
import {
    asyncForEach,
    createNumberArrayWithLength,
    delay,
    getRandomElement,
} from '@legacy-step-definitions/utils';
import { learnersProfileAlias } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ActionOptions } from '@supports/types/cms-types';

import { aliasCourseId, aliasCourseStudyPlans } from './alias-keys/syllabus';
import * as StudyPlanKeys from './cms-selectors/study-plan';
import {
    getStudyPlanListByAllStatus,
    getStudyPlanListByStatus,
    schoolAdminClickActionButtonInStudyPlanDetailPage,
    schoolAdminDoesNotSeeStudyPlanByStudents,
    schoolAdminFilterShowArchivedStudyPlan,
    schoolAdminIsOnStudyPlanTab,
    schoolAdminSeesStudyPlanContentActionState,
    schoolAdminSelectCourseStudyPlan,
    schoolAdminSelectStudyPlanTabByType,
} from './syllabus-study-plan-common-definitions';
import { schoolAdminSeeTableRowTotal } from './syllabus-utils';
import { StudyPlanStatus } from 'manabuf/eureka/v1/enums_pb';
import { StudyPlan } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(
    'school admin archives {int} master study plans in master detail page',
    async function (quantity: number) {
        const context = this.scenario;
        const courseId = context.get<string>(aliasCourseId);

        await asyncForEach<number, void>(createNumberArrayWithLength(quantity), async () => {
            const courseStudyPlanList = context.get<StudyPlan[]>(aliasCourseStudyPlans);
            const activeStudyPlanList = getStudyPlanListByStatus(
                courseStudyPlanList,
                StudyPlanStatus.STUDY_PLAN_STATUS_ACTIVE
            );
            const activeCourseStudyPlan = getRandomElement<StudyPlan>(activeStudyPlanList);

            await this.cms.instruction(
                `School admin goes to master study plan ${activeCourseStudyPlan.name} detail page`,
                async () => {
                    await schoolAdminIsOnStudyPlanTab(this.cms, courseId, 'master');

                    await schoolAdminSelectCourseStudyPlan(this.cms, activeCourseStudyPlan.name);
                    await this.cms.waitingForLoadingIcon();
                    await this.cms.waitForSkeletonLoading();
                }
            );

            await this.cms.instruction(
                `School admin clicks on archive button in master study plan detail page`,
                async () => {
                    await schoolAdminClickActionButtonInStudyPlanDetailPage(
                        this.cms,
                        ActionOptions.ARCHIVE
                    );

                    const activeCourseStudyPlanIndex = courseStudyPlanList.findIndex(
                        (studyPlan) => studyPlan.name === activeCourseStudyPlan.name
                    );

                    courseStudyPlanList[activeCourseStudyPlanIndex] = {
                        ...activeCourseStudyPlan,
                        status: StudyPlanStatus.STUDY_PLAN_STATUS_ARCHIVED,
                    };

                    context.set(aliasCourseStudyPlans, courseStudyPlanList);

                    await this.cms.waitForSkeletonLoading();
                    // TODO: find out what happened we need to wait a bit
                    await delay(2000);
                }
            );

            await this.cms.instruction(
                'School admin sees all actions of study plan content are disabled in master study plan detail page',
                async () => {
                    await schoolAdminSeesStudyPlanContentActionState(this.cms, true);
                }
            );
        });
    }
);

Then('school admin does not see the archived study plans in master tab', async function () {
    const context = this.scenario;
    const courseId = context.get<string>(aliasCourseId);
    const courseStudyPlanList = context.get<StudyPlan[]>(aliasCourseStudyPlans);
    const { archivedStudyPlanList, activeStudyPlanList } =
        getStudyPlanListByAllStatus(courseStudyPlanList);

    await this.cms.instruction(
        `School admin goes to master study plan tab on course ${courseId} detail page`,
        async () => {
            await schoolAdminIsOnStudyPlanTab(this.cms, courseId, 'master');
        }
    );

    if (archivedStudyPlanList.length === courseStudyPlanList.length) {
        return await this.cms.instruction(
            'School admin see empty master study plan table in master tab',
            async () => {
                await schoolAdminSeeEmptyTableMsg(this.cms, {
                    wrapper: StudyPlanKeys.courseStudyPlanTable,
                });
            }
        );
    }

    await this.cms.instruction(
        `School admin sees ${activeStudyPlanList.length} active study plan(s) in master tab`,
        async () => {
            await schoolAdminSeeTableRowTotal(this.cms, {
                wrapper: StudyPlanKeys.courseStudyPlanTable,
                rowTotal: activeStudyPlanList.length,
            });
        }
    );

    await asyncForEach(archivedStudyPlanList, async (studyPlan) => {
        const { name } = studyPlan;

        await this.cms.instruction(
            `School admin does not see the archived study plan ${name} in master tab`,
            async () => {
                await this.cms.page!.waitForSelector(
                    StudyPlanKeys.getCourseStudyPlanNameLink(name),
                    {
                        state: 'detached',
                    }
                );
            }
        );
    });
});

Then('school admin does not see the archived master study plans', async function () {
    const context = this.scenario;
    const courseStudyPlanList = context.get<StudyPlan[]>(aliasCourseStudyPlans);
    const { archivedStudyPlanList, activeStudyPlanList } =
        getStudyPlanListByAllStatus(courseStudyPlanList);

    if (archivedStudyPlanList.length === courseStudyPlanList.length) {
        return await this.cms.instruction(
            'School admin see empty master study plan table in master tab',
            async () => {
                await schoolAdminSeeEmptyTableMsg(this.cms, {
                    wrapper: StudyPlanKeys.courseStudyPlanTable,
                });
            }
        );
    }

    await this.cms.instruction(
        `School admin sees ${activeStudyPlanList.length} active study plan(s) in master tab`,
        async () => {
            await schoolAdminSeeTableRowTotal(this.cms, {
                wrapper: StudyPlanKeys.courseStudyPlanTable,
                rowTotal: activeStudyPlanList.length,
            });
        }
    );

    await asyncForEach(archivedStudyPlanList, async (studyPlan) => {
        const { name } = studyPlan;

        await this.cms.instruction(
            `School admin does not see the archived study plan ${name} in master tab`,
            async () => {
                await this.cms.page!.waitForSelector(
                    StudyPlanKeys.getCourseStudyPlanNameLink(name),
                    {
                        state: 'detached',
                    }
                );
            }
        );
    });
});

Then('school admin sees the archived study plans by the filter in master tab', async function () {
    const context = this.scenario;
    const courseStudyPlanList = context.get<StudyPlan[]>(aliasCourseStudyPlans);
    const archivedStudyPlanList = getStudyPlanListByStatus(
        courseStudyPlanList,
        StudyPlanStatus.STUDY_PLAN_STATUS_ARCHIVED
    );

    await this.cms.instruction(
        `School admin filters study plan with showing archived study plan in master tab`,
        async () => {
            await schoolAdminFilterShowArchivedStudyPlan(this.cms, true);
        }
    );

    await this.cms.instruction(
        `School admin sees ${courseStudyPlanList.length} study plan(s) by all status in master tab`,
        async () => {
            await schoolAdminSeeTableRowTotal(this.cms, {
                wrapper: StudyPlanKeys.courseStudyPlanTable,
                rowTotal: courseStudyPlanList.length,
            });
        }
    );

    await asyncForEach(archivedStudyPlanList, async (studyPlan) => {
        const { name } = studyPlan;

        await this.cms.instruction(
            `School admin see the archived study plan ${name} in master tab`,
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
    'school admin does not see the archived study plans of all students in individual tab',
    async function () {
        const context = this.scenario;
        const courseStudyPlanList = context.get<StudyPlan[]>(aliasCourseStudyPlans);
        const { archivedStudyPlanList, activeStudyPlanList } =
            getStudyPlanListByAllStatus(courseStudyPlanList);
        const studentProfileList = context.get<UserProfileEntity[]>(learnersProfileAlias);
        const numberActiveStudyPlansByStudents =
            activeStudyPlanList.length * studentProfileList.length;

        await this.cms.instruction(`School admin goes to individual study plan tab`, async () => {
            await schoolAdminSelectStudyPlanTabByType(this.cms, 'student');
        });

        if (archivedStudyPlanList.length === courseStudyPlanList.length) {
            return await this.cms.instruction(
                `School admin does not see any study plan of ${studentProfileList.length} student(s)`,
                async () => {
                    await schoolAdminDoesNotSeeStudyPlanByStudents(this.cms, studentProfileList);
                }
            );
        }

        await this.cms.instruction(
            `School admin sees ${studentProfileList.length} student(s) with ${numberActiveStudyPlansByStudents} active study plan(s)`,
            async () => {
                await schoolAdminSeeTableRowTotal(this.cms, {
                    wrapper: StudyPlanKeys.studentTable,
                    rowTotal: numberActiveStudyPlansByStudents,
                });
            }
        );

        await asyncForEach(archivedStudyPlanList, async (studyPlan) => {
            const { name } = studyPlan;

            await this.cms.instruction(
                `School admin does not see the archived study plan ${name} in individual tab`,
                async () => {
                    await this.cms.page!.waitForSelector(
                        StudyPlanKeys.getStudentStudyPlanNameLink(name),
                        {
                            state: 'detached',
                        }
                    );
                }
            );
        });
    }
);

Then(
    'school admin cannot filter individual study plan with showing archived study plan in individual tab',
    async function () {
        await this.cms.instruction(
            `School admin does not see the showing archived study plan filter in individual tab`,
            async () => {
                await schoolAdminOpenFilterAdvanced(this.cms);

                await this.cms.page!.waitForSelector('input[type="checkbox"]', {
                    state: 'detached',
                });
            }
        );
    }
);
