import { schoolAdminSeeEmptyTableMsg } from '@legacy-step-definitions/cms-common-definitions';

import { Then, When } from '@cucumber/cucumber';

import { ActionOptions } from '@supports/types/cms-types';

import {
    aliasCourseId,
    aliasCourseStudyPlan,
    aliasDescCreatedCourseStudyPlans,
    aliasRandomStudyPlanItems,
    aliasRandomTopics,
} from './alias-keys/syllabus';
import * as StudyPlanKeys from './cms-selectors/study-plan';
import { schoolAdminFillStudyPlanForm } from './syllabus-course-create-study-plan-definitions';
import {
    generateFormDataByStudyPlanInfo,
    schoolAdminClickActionButtonInStudyPlanDetailPage,
    schoolAdminIsOnStudyPlanTab,
    schoolAdminSeeErrorMessageFieldInStudyPlanForm,
    schoolAdminSeeStudyPlanInfo,
    schoolAdminSeeStudyPlanItemsByTopicsBaseOnBook,
    schoolAdminSelectCourseStudyPlan,
    schoolAdminSubmitStudyPlanDialog,
    StudyPlanInfoType,
} from './syllabus-study-plan-common-definitions';
import {
    StudyPlan,
    StudyPlanItem,
    Topic,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(
    'school admin edits a master study plan with {string} field',
    async function (field: StudyPlanInfoType) {
        const context = this.scenario;
        const courseId = context.get<string>(aliasCourseId);
        const courseStudyPlanList = context.get<StudyPlan[]>(aliasDescCreatedCourseStudyPlans);

        await this.cms.instruction(
            `School admin goes to master study plan detail page`,
            async () => {
                await schoolAdminIsOnStudyPlanTab(this.cms, courseId, 'master');
                await schoolAdminSelectCourseStudyPlan(this.cms, courseStudyPlanList[0].name);
            }
        );

        await this.cms.instruction(
            `School admin clicks edit button on master study plan detail page`,
            async (cms) => {
                await schoolAdminClickActionButtonInStudyPlanDetailPage(cms, ActionOptions.EDIT);
            }
        );

        const formData = generateFormDataByStudyPlanInfo(field, courseStudyPlanList[0]);

        await this.cms.instruction(
            `School admin fills study plan form with ${field} field`,
            async (cms) => {
                await schoolAdminFillStudyPlanForm(cms, formData, ActionOptions.EDIT);

                context.set(aliasCourseStudyPlan, formData);
                context.set(aliasDescCreatedCourseStudyPlans, [formData]);
            }
        );

        await this.cms.instruction('School admin submits to edit a study plan', async (cms) => {
            await schoolAdminSubmitStudyPlanDialog(cms);
        });
    }
);

Then(
    'school admin sees the newly edited master study plan in master detail page',
    async function () {
        const context = this.scenario;
        const courseStudyPlan = context.get<StudyPlan>(aliasCourseStudyPlan);
        const topicList = context.get<Topic[]>(aliasRandomTopics);
        const studyPlanItemList = context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);

        await this.cms.instruction('School admin sees study plan info', async (cms) => {
            await schoolAdminSeeStudyPlanInfo(cms, courseStudyPlan);
        });

        if (studyPlanItemList) {
            return await this.cms.instruction(
                `School admin sees ${topicList.length} topics with ${studyPlanItemList.length} study plan items base on the book association`,
                async (cms) => {
                    await schoolAdminSeeStudyPlanItemsByTopicsBaseOnBook(
                        cms,
                        context,
                        topicList,
                        studyPlanItemList
                    );
                }
            );
        }

        return await this.cms.instruction(
            `School admin does not see any topics with study plan items base on the book association`,
            async (cms) => {
                await schoolAdminSeeEmptyTableMsg(cms, { wrapper: StudyPlanKeys.itemTable });
            }
        );
    }
);

Then(
    'school admin cannot edit master study plan with {string} field',
    async function (missingField: StudyPlanInfoType) {
        await this.cms.instruction(
            `School admin sees error message with ${missingField} field`,
            async (cms) => {
                await schoolAdminSeeErrorMessageFieldInStudyPlanForm(cms, missingField);
            }
        );
    }
);
