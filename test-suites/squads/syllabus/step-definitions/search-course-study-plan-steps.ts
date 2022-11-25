import {
    schoolAdminApplyFilterAdvanced,
    schoolAdminOpenFilterAdvanced,
    schoolAdminResetFilterAdvanced,
} from '@legacy-step-definitions/cms-common-definitions';
import { SearchStringCase } from '@legacy-step-definitions/types/common';
import {
    asyncForEach,
    convertGradesToString,
    getRandomElement,
} from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import studyPlanModifierService from '@supports/services/eureka-study_plan_modifier-service';

import {
    aliasBookIds,
    aliasBooks,
    aliasCourseId,
    aliasCourseStudyPlan,
    aliasFilterStudyPlan,
    aliasRandomStudyPlanShouldMatch,
    aliasSearchStringTestCase,
    aliasStudyPlanName,
} from './alias-keys/syllabus';
import { clearAllFilterAdvancedButton, tableBaseRow } from './cms-selectors/cms-keys';
import { schoolAdminGotoCourseDetail } from './create-course-studyplan-definitions';
import {
    createStudyPlanFilters,
    FilterStudyPlan,
    getStudyPlanNameForSearch,
    getStudyPlansMatchedWithFilters,
    GradeAndBookFilterStudyPlanCase,
    schoolAdminCreateNStudyPlansPayLoadToFilter,
    schoolAdminFilterAdvancedStudyPlan,
    schoolAdminSeeEmptyCourseStudyPlan,
} from './search-course-study-plan-definitions';
import { addBooksToCourseByGRPC } from './syllabus-add-book-to-course-definitions';
import { createRandomBookByGRPC } from './syllabus-content-book-create-definitions';
import {
    schoolAdminIsOnStudyPlanTab,
    schoolAdminSelectCourseStudyPlan,
    schoolAdminSelectStudyPlanOfStudent,
    schoolAdminSelectStudyPlanTabByType,
    schoolAdminWaitingStudyPlanDetailLoading,
} from './syllabus-study-plan-common-definitions';
import { StudyPlanStatus } from 'manabuf/eureka/v1/enums_pb';
import { UpsertStudyPlanRequest } from 'manabuf/eureka/v1/study_plan_modifier_pb';
import { schoolAdminChooseTabInCourseDetail } from 'test-suites/common/step-definitions/course-definitions';
import { Book, StudyPlan } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

Given(
    'school admin has created list study plan {string} status to search and filters',
    async function (statusType: 'active') {
        const courseId = this.scenario.get(aliasCourseId);

        const { schoolId } = await this.cms.getContentBasic();
        const token = await this.cms.getToken();

        const { request } = await createRandomBookByGRPC(this.cms, this.scenario, 10);

        const bookIds = request.booksList.map((book) => book.bookId);

        const studyPlans = schoolAdminCreateNStudyPlansPayLoadToFilter({
            schoolId,
            courseId,
            bookIds,
            status: statusType === 'active' ? StudyPlanStatus.STUDY_PLAN_STATUS_ACTIVE : undefined,
        });

        await this.cms.instruction('add a book to course by calling gRPC', async () => {
            await addBooksToCourseByGRPC(this.cms, courseId, bookIds);
        });

        // https://manabie.atlassian.net/browse/LT-9237
        // BE: Data race when upsert CSV besides add student to course
        // await delay(2500);

        const insertMultipleStudyPlanPromises = studyPlans.map((studyPlan) =>
            studyPlanModifierService.upsertStudyPlan(token, studyPlan)
        );

        await Promise.all(insertMultipleStudyPlanPromises);

        const randomStudyPlanShouldMatch = getRandomElement(studyPlans);
        this.scenario.set(aliasBookIds, bookIds);
        this.scenario.set(aliasBooks, request.booksList);
        this.scenario.set(aliasCourseStudyPlan, studyPlans);
        this.scenario.set(aliasRandomStudyPlanShouldMatch, randomStudyPlanShouldMatch);
    }
);

Given(
    'school admin goes to the {string} study plan in the course detail',
    async function (typeStudyPlan: 'course' | 'student') {
        const courseId = this.scenario.get(aliasCourseId);

        await this.cms.instruction(`User go to the course: ${courseId} detail`, async () => {
            await schoolAdminGotoCourseDetail(this.cms, courseId);
        });

        await this.cms.instruction(`User select study plan tab in the course detail`, async () => {
            await schoolAdminChooseTabInCourseDetail(this.cms, 'studyPlan');
        });

        await schoolAdminSelectStudyPlanTabByType(this.cms, typeStudyPlan);

        await this.cms.waitForSkeletonLoading();
    }
);

Then(
    'school admin is at the {string} study plan detail',
    async function (type: 'master' | 'individual') {
        const courseId = this.scenario.get(aliasCourseId);
        const studyPlanName = this.scenario.get(aliasStudyPlanName);

        await this.cms.instruction(`User go to the course: ${courseId} detail`, async () => {
            await schoolAdminGotoCourseDetail(this.cms, courseId);
        });

        await this.cms.instruction(`User select study plan tab in the course detail`, async () => {
            await schoolAdminChooseTabInCourseDetail(this.cms, 'studyPlan');
        });

        await schoolAdminSelectStudyPlanTabByType(this.cms, type);
        await this.cms.waitForSkeletonLoading();

        if (type === 'master') {
            await this.cms.instruction('User go the course study plan detail', async () => {
                await schoolAdminSelectCourseStudyPlan(this.cms, studyPlanName);
                await schoolAdminWaitingStudyPlanDetailLoading(this.cms);
            });
            return;
        }

        const { name } = await this.learner.getProfile();
        await this.cms.instruction(
            `User goes to the study plan ${studyPlanName} of student ${name}`,
            async () => {
                await schoolAdminSelectStudyPlanOfStudent(this.cms, name, studyPlanName);
                await schoolAdminWaitingStudyPlanDetailLoading(this.cms);
            }
        );
    }
);

When('school admin searches study plan {string} name', async function (testCase: SearchStringCase) {
    const randomStudyPlanShouldMatch = this.scenario.get<UpsertStudyPlanRequest.AsObject>(
        aliasRandomStudyPlanShouldMatch
    );

    const filtersPreviousStep = this.scenario.get<FilterStudyPlan>(aliasFilterStudyPlan);

    const searchKeyWord = getStudyPlanNameForSearch(testCase, randomStudyPlanShouldMatch);

    const filter: FilterStudyPlan = {
        ...(filtersPreviousStep || {}),
        searchKeyWord,
    };

    this.scenario.set(aliasFilterStudyPlan, filter);
    this.scenario.set(aliasSearchStringTestCase, testCase);

    if (!searchKeyWord) {
        await this.cms.instruction("User don't searching by study plan name", async () => {
            console.log('Only avoid empty block');
        });
        return;
    }

    const instruction = `User will searching ${testCase} name in studyplan search box`;
    await this.cms.instruction(instruction, async () => {
        await this.cms.searchInFilter(searchKeyWord);
    });

    await this.cms.waitForSkeletonLoading();
});

Then(
    'school admin filters {string} with random status in the course study plan',
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

        await schoolAdminFilterAdvancedStudyPlan(this.cms, filters);

        await this.cms.instruction('User apply filters', async () => {
            await schoolAdminApplyFilterAdvanced(this.cms);
            await this.cms.page?.keyboard.press('Escape');
        });
        await this.cms.waitForSkeletonLoading();

        this.scenario.set(aliasFilterStudyPlan, { ...(filtersPreviousStep || {}), ...filters });
    }
);

Then('school admin sees all course study plan matches with the above filters', async function () {
    const testCase = this.scenario.get<SearchStringCase>(aliasSearchStringTestCase);
    const filters = this.scenario.get<FilterStudyPlan>(aliasFilterStudyPlan);
    const courseStudyPlans =
        this.scenario.get<UpsertStudyPlanRequest.AsObject[]>(aliasCourseStudyPlan);
    const studyPlansMatched = getStudyPlansMatchedWithFilters(courseStudyPlans, filters);

    if (testCase === 'incorrect') {
        await this.cms.instruction('User sees empty course study plan table', async () => {
            await schoolAdminSeeEmptyCourseStudyPlan(this.cms);
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

Then('school admin resets filters study plan', async function () {
    let isApplyFilterAdvanced = null;
    try {
        await this.cms.page?.waitForSelector(clearAllFilterAdvancedButton);
        isApplyFilterAdvanced = true;
    } catch (error) {
        isApplyFilterAdvanced = false;
    }

    if (!isApplyFilterAdvanced) return;

    await this.cms.instruction('User open filter advanced', async () => {
        await schoolAdminOpenFilterAdvanced(this.cms);
    });

    await this.cms.instruction('User reset filter advanced', async () => {
        await schoolAdminResetFilterAdvanced(this.cms);
        await this.cms.page?.keyboard.press('Escape');
    });
});

Then('school admin sees all course study plan matches with search', async function () {
    const testCase = this.scenario.get<SearchStringCase>(aliasSearchStringTestCase);
    const filters = this.scenario.get<FilterStudyPlan>(aliasFilterStudyPlan);
    const courseStudyPlans =
        this.scenario.get<UpsertStudyPlanRequest.AsObject[]>(aliasCourseStudyPlan);

    const studyPlansMatched = getStudyPlansMatchedWithFilters(courseStudyPlans, {
        searchKeyWord: filters.searchKeyWord,
        status: StudyPlanStatus.STUDY_PLAN_STATUS_ACTIVE,
    });

    await this.cms.waitForSkeletonLoading();

    if (testCase === 'incorrect') {
        await this.cms.instruction('User sees empty course study plan table', async () => {
            await schoolAdminSeeEmptyCourseStudyPlan(this.cms);
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

When(
    'school admin filters study plans by {string} without showing archived study plan in master tab',
    async function (filter: 'name' | 'grades' | 'book') {
        const context = this.scenario;
        const courseId = context.get(aliasCourseId);
        const archivedCourseStudyPlan = context.get<StudyPlan>(aliasCourseStudyPlan);

        await this.cms.instruction(
            `School admin goes to master study plan tab on course ${courseId} detail page`,
            async () => {
                await schoolAdminIsOnStudyPlanTab(this.cms, courseId, 'master');
            }
        );

        switch (filter) {
            case 'name': {
                await this.cms.instruction(
                    `School admin searches study plan by ${filter} ${archivedCourseStudyPlan.name}`,
                    async () => {
                        await this.cms.searchInFilter(archivedCourseStudyPlan.name);
                    }
                );
                break;
            }
            case 'grades': {
                await this.cms.instruction(
                    `School admin filters study plan by ${filter} ${convertGradesToString(
                        archivedCourseStudyPlan.gradesList
                    )}`,
                    async () => {
                        await schoolAdminOpenFilterAdvanced(this.cms);
                        await schoolAdminFilterAdvancedStudyPlan(this.cms, {
                            grades: archivedCourseStudyPlan.gradesList,
                        });
                        await schoolAdminApplyFilterAdvanced(this.cms);
                        await this.cms.page?.keyboard.press('Escape');
                    }
                );
                break;
            }
            case 'book': {
                await this.cms.instruction(
                    `School admin filters study plan by ${filter} ${archivedCourseStudyPlan.bookName}`,
                    async () => {
                        await schoolAdminOpenFilterAdvanced(this.cms);
                        await schoolAdminFilterAdvancedStudyPlan(this.cms, {
                            books: [
                                {
                                    bookId: archivedCourseStudyPlan.bookId,
                                    name: archivedCourseStudyPlan.bookName,
                                },
                            ],
                        });
                        await schoolAdminApplyFilterAdvanced(this.cms);
                        await this.cms.page?.keyboard.press('Escape');
                    }
                );
                break;
            }
            default:
                break;
        }

        await this.cms.waitForSkeletonLoading();
    }
);
