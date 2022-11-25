import {
    schoolAdminApplyFilterAdvanced,
    schoolAdminOpenFilterAdvanced,
    schoolAdminSeeEmptyTableMsg,
} from '@legacy-step-definitions/cms-common-definitions';
import { SearchStringCase } from '@legacy-step-definitions/types/common';
import { asyncForEach } from '@legacy-step-definitions/utils';

import { Then } from '@cucumber/cucumber';

import {
    aliasBooks,
    aliasCourseStudyPlan,
    aliasFilterStudyPlan,
    aliasRandomStudyPlanShouldMatch,
    aliasSearchStringTestCase,
} from './alias-keys/syllabus';
import { tableBaseRow } from './cms-selectors/cms-keys';
import {
    createStudyPlanFilters,
    FilterStudyPlan,
    getStudyPlansMatchedWithFilters,
    GradeAndBookFilterStudyPlanCase,
    schoolAdminFilterAdvancedStudyPlan,
} from './search-course-study-plan-definitions';
import { StudyPlanStatus } from 'manabuf/eureka/v1/enums_pb';
import { UpsertStudyPlanRequest } from 'manabuf/eureka/v1/study_plan_modifier_pb';
import { Book } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

Then(
    'school admin filters {string} in the student study plan',
    async function (gradeAndBook: GradeAndBookFilterStudyPlanCase) {
        const booksContext = this.scenario.get<Book[]>(aliasBooks);
        const filtersPreviousStep = this.scenario.get<FilterStudyPlan>(aliasFilterStudyPlan);
        const studyPlan = this.scenario.get<UpsertStudyPlanRequest.AsObject>(
            aliasRandomStudyPlanShouldMatch
        );
        const filters = createStudyPlanFilters(gradeAndBook, booksContext, studyPlan);

        await this.cms.instruction('User open filter advanced', async () => {
            await schoolAdminOpenFilterAdvanced(this.cms);
        });

        await this.cms.instruction('User filter advanced', async () => {
            // Student study plan don't have filter for status
            await schoolAdminFilterAdvancedStudyPlan(this.cms, { ...filters, status: undefined });
        });

        await this.cms.instruction('User apply filters', async () => {
            await schoolAdminApplyFilterAdvanced(this.cms);
            await this.cms.page?.keyboard.press('Escape');
        });

        await this.cms.waitForSkeletonLoading();

        this.scenario.set(aliasFilterStudyPlan, { ...filtersPreviousStep, ...filters });
    }
);

Then('school admin sees all student study plan matches with the above filters', async function () {
    const filters = this.scenario.get<FilterStudyPlan>(aliasFilterStudyPlan);
    const studyPlans = this.scenario.get<UpsertStudyPlanRequest.AsObject[]>(aliasCourseStudyPlan);
    const studyPlansMatched = getStudyPlansMatchedWithFilters(studyPlans, filters, true);
    const testCase = this.scenario.get<SearchStringCase>(aliasSearchStringTestCase);

    if (testCase === 'incorrect') {
        await this.cms.instruction('User sees empty student study plan table', async () => {
            await schoolAdminSeeEmptyTableMsg(this.cms);
        });

        return;
    }

    await this.cms.instruction(
        `User sees total ${studyPlansMatched.length} study plans matched`,
        async () => {
            const tableRows = await this.cms.page?.$$(tableBaseRow);
            weExpect(tableRows?.length).toEqual(studyPlansMatched.length);
        }
    );

    await asyncForEach(studyPlansMatched, async (studyPlan) => {
        const { name } = studyPlan;
        await this.cms.instruction(`User see study plan ${name} matching with filter`, async () => {
            await this.cms.page?.waitForSelector(`${tableBaseRow}:has-text("${name}")`, {
                state: 'attached',
            });
        });
    });
});

Then('school admin sees all student study plan matches with search', async function () {
    const testCase = this.scenario.get<SearchStringCase>(aliasSearchStringTestCase);
    const filters = this.scenario.get<FilterStudyPlan>(aliasFilterStudyPlan);
    const courseStudyPlans =
        this.scenario.get<UpsertStudyPlanRequest.AsObject[]>(aliasCourseStudyPlan);

    const studyPlansMatched = getStudyPlansMatchedWithFilters(
        courseStudyPlans,
        { searchKeyWord: filters.searchKeyWord, status: StudyPlanStatus.STUDY_PLAN_STATUS_ACTIVE },
        true
    );

    await this.cms.waitForSkeletonLoading();

    if (testCase === 'incorrect') {
        await this.cms.instruction('User sees empty student study plan table', async () => {
            await schoolAdminSeeEmptyTableMsg(this.cms);
        });
        return;
    }

    if (!studyPlansMatched.length && filters.status === StudyPlanStatus.STUDY_PLAN_STATUS_ACTIVE) {
        throw new Error('No study plan matched is invalid');
    }

    await this.cms.instruction(
        `User sees total ${studyPlansMatched.length} study plans matched`,
        async () => {
            const tableRows = await this.cms.page?.$$(tableBaseRow);
            weExpect(tableRows?.length).toEqual(studyPlansMatched.length);
        }
    );

    await asyncForEach(studyPlansMatched, async (studyPlan) => {
        const { name } = studyPlan;
        await this.cms.instruction(`User see study plan ${name} matching with filter`, async () => {
            await this.cms.page?.waitForSelector(`${tableBaseRow}:has-text("${name}")`, {
                state: 'attached',
            });
        });
    });
});
