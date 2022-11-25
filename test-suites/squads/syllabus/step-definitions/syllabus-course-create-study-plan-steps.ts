import { schoolAdminSeeEmptyTableMsg } from '@legacy-step-definitions/cms-common-definitions';
import { UPSERT_STUDYPLAN_ENDPOINT } from '@legacy-step-definitions/endpoints/eureka-studyplan-modifier';

import { Then, When } from '@cucumber/cucumber';

import { ActionOptions } from '@supports/types/cms-types';
import { genId } from '@supports/utils/ulid';

import {
    aliasCourseId,
    aliasCourseStudyPlan,
    aliasDescCreatedCourseStudyPlans,
    aliasRandomBooks,
    aliasRandomStudyPlanItems,
    aliasRandomTopics,
    aliasStudyPlanId,
    aliasStudyPlanName,
} from './alias-keys/syllabus';
import * as StudyPlanKeys from './cms-selectors/study-plan';
import { schoolAdminFillStudyPlanForm } from './syllabus-course-create-study-plan-definitions';
import {
    generateFormDataByStudyPlanInfo,
    schoolAdminClickAddStudyPlanButton,
    schoolAdminDecodeUpsertStudyPlan,
    schoolAdminIsOnStudyPlanTab,
    schoolAdminSeeErrorMessageFieldInStudyPlanForm,
    schoolAdminSeeStudyPlanInfo,
    schoolAdminSeeStudyPlanItemsByTopicsBaseOnBook,
    schoolAdminSubmitStudyPlanDialog,
    StudyPlanInfoType,
} from './syllabus-study-plan-common-definitions';
import { StudyPlanStatus } from 'manabuf/eureka/v1/enums_pb';
import {
    Book,
    StudyPlan,
    StudyPlanItem,
    Topic,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { UPSERT_STUDYPLAN_ENDPOINT_TIMEOUT } from 'test-suites/squads/syllabus/step-definitions/syllabus-migration-temp';

When(
    'school admin creates a master study plan with {string} field',
    async function (field: StudyPlanInfoType) {
        const context = this.scenario;
        const courseId = context.get<string>(aliasCourseId);
        const bookAssociation = context.get<Book[]>(aliasRandomBooks)[0];
        const descCreatedCourseStudyPlanList =
            context.get<StudyPlan[]>(aliasDescCreatedCourseStudyPlans) || [];
        const { schoolId } = await this.cms.getContentBasic();
        const studyPlanName = `Study Plan ${genId()}`;
        let formData: StudyPlan = {
            schoolId: schoolId,
            name: studyPlanName,
            courseId,
            bookId: bookAssociation.bookId,
            bookName: bookAssociation.name,
            gradesList: [],
            trackSchoolProgress: false,
            status: StudyPlanStatus.STUDY_PLAN_STATUS_ACTIVE,
        };

        formData = generateFormDataByStudyPlanInfo(field, formData);

        await this.cms.instruction(
            `School admin goes to master study plan tab on course ${courseId} detail page`,
            async () => {
                await schoolAdminIsOnStudyPlanTab(this.cms, courseId, 'master');
            }
        );

        await this.cms.instruction(
            `School admin clicks add button on master study plan tab`,
            async (cms) => {
                await schoolAdminClickAddStudyPlanButton(cms);
            }
        );

        await this.cms.instruction(
            `School admin fills study plan form with ${field} field`,
            async (cms) => {
                await schoolAdminFillStudyPlanForm(cms, formData, ActionOptions.ADD);

                context.set(aliasCourseStudyPlan, formData);
                context.set(aliasDescCreatedCourseStudyPlans, [
                    formData,
                    ...descCreatedCourseStudyPlanList,
                ]);
            }
        );

        await this.cms.instruction('School admin submits to create a study plan', async (cms) => {
            await schoolAdminSubmitStudyPlanDialog(cms);
        });

        if (field === 'empty book' || field == 'empty name') return;

        // TODO: because API is very slow so we need to increase timeout to make sure it can complete in time
        const response = await this.cms.waitForGRPCResponse(UPSERT_STUDYPLAN_ENDPOINT, {
            timeout: UPSERT_STUDYPLAN_ENDPOINT_TIMEOUT,
        });

        const { studyPlanId } = await schoolAdminDecodeUpsertStudyPlan(response);

        this.scenario.set(aliasStudyPlanId, studyPlanId);
        this.scenario.set(aliasStudyPlanName, studyPlanName);
    }
);

Then(
    'school admin sees the newly created master study plan in master detail page',
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
    'school admin cannot create master study plan with {string} field',
    async function (missingField: StudyPlanInfoType) {
        await this.cms.instruction(
            `School admin sees error message with ${missingField} field`,
            async (cms) => {
                await schoolAdminSeeErrorMessageFieldInStudyPlanForm(cms, missingField);
            }
        );
    }
);
