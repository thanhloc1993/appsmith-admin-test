import { schoolAdminSeeEmptyTableMsg } from '@legacy-step-definitions/cms-common-definitions';
import { asyncForEach, randomUniqueIntegers } from '@legacy-step-definitions/utils';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    learnersProfileAlias,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ActionOptions } from '@supports/types/cms-types';

import studyPlanModifierService from '@services/eureka-study_plan_modifier-service';

import {
    aliasCourseId,
    aliasCourseName,
    aliasCourseStudyPlan,
    aliasCourseStudyPlans,
    aliasDescCreatedCourseStudyPlans,
    aliasDescCreatedStudentProfiles,
    aliasRandomBooks,
    aliasRandomStudyPlanItems,
    aliasRandomTopics,
    aliasStudyPlanId,
    aliasStudyPlanName,
} from './alias-keys/syllabus';
import { actionPanelTriggerButton } from './cms-selectors/cms-keys';
import * as StudyPlanKeys from './cms-selectors/study-plan';
import { schoolAdminAddCourseForStudent } from './create-course-studyplan-definitions';
import { randomGradeList } from './search-course-study-plan-definitions';
import { addBooksToCourseByGRPC } from './syllabus-add-book-to-course-definitions';
import {
    createNStudyPlansPayLoadByInfo,
    getStudyPlanListByStatus,
    schoolAdminCannotClickActionButtonInStudyPlanDetailPage,
    schoolAdminGoesToCourseStudyPlanDetailPage,
    schoolAdminGoesToStudentStudyPlanDetailPage,
    schoolAdminHasCreatedStudyPlanV2,
    schoolAdminIsOnStudyPlanTab,
    schoolAdminSeeAllStudyPlansByStudent,
    schoolAdminSeeStudyPlanInfo,
    schoolAdminSeeStudyPlanItemsByTopicsBaseOnBook,
    schoolAdminSelectStudyPlanTabByType,
    StudyPlanInfoType,
    StudyPlanPageType,
    StudyPlanStatusType,
} from './syllabus-study-plan-common-definitions';
import { StudyPlanItemStatus as StudyPlanItemStatusEnumProto } from 'manabuf/eureka/v1/assignments_pb';
import { StudyPlanStatus } from 'manabuf/eureka/v1/enums_pb';
import { UpsertStudyPlanRequest } from 'manabuf/eureka/v1/study_plan_modifier_pb';
import {
    Book,
    StudyPlan,
    StudyPlanItem,
    Topic,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { createARandomStudentGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

Then('school admin is at individual study plan tab', async function (this: IMasterWorld) {
    const context = this.scenario;
    const courseId = context.get<string>(aliasCourseId);

    await this.cms.instruction(
        `School admin is on individual study plan tab in course ${courseId} detail page`,
        async () => {
            await schoolAdminIsOnStudyPlanTab(this.cms, courseId, 'individual');
        }
    );
});

Given(
    'school admin has created {int} {string} study plan with {string} info',
    async function (
        quantity: number,
        statusType: StudyPlanStatusType,
        infoType: StudyPlanInfoType
    ) {
        const context = this.scenario;
        const courseId = context.get<string>(aliasCourseId);
        const book = context.get<Book[]>(aliasRandomBooks)[0];
        const courseStudyPlanList = context.get<StudyPlan[]>(aliasCourseStudyPlans) || [];
        const descCreatedCourseStudyPlanList =
            context.get<StudyPlan[]>(aliasDescCreatedCourseStudyPlans) || [];
        const token = await this.cms.getToken();
        const { schoolId } = await this.cms.getContentBasic();
        let payload: UpsertStudyPlanRequest.AsObject[] = [];
        let studyPlanList: StudyPlan[] = [];

        const status =
            statusType === 'active'
                ? StudyPlanStatus.STUDY_PLAN_STATUS_ACTIVE
                : StudyPlanStatus.STUDY_PLAN_STATUS_ARCHIVED;
        const gradesList = randomGradeList(3, 1);

        switch (infoType) {
            case 'full': {
                const { studyPlansPayload, studyPlansWithBookName } =
                    createNStudyPlansPayLoadByInfo({
                        quantity,
                        info: {
                            schoolId,
                            courseId: courseId,
                            bookId: book.bookId,
                            bookName: book.name,
                            status,
                            gradesList,
                            trackSchoolProgress: true,
                        },
                    });
                payload = studyPlansPayload;
                studyPlanList = studyPlansWithBookName;
                break;
            }
            case 'empty grades, untracked school progress': {
                const { studyPlansPayload, studyPlansWithBookName } =
                    createNStudyPlansPayLoadByInfo({
                        quantity,
                        info: {
                            schoolId,
                            courseId: courseId,
                            bookId: book.bookId,
                            bookName: book.name,
                            status,
                        },
                    });
                payload = studyPlansPayload;
                studyPlanList = studyPlansWithBookName;
                break;
            }
            default:
                break;
        }

        await this.cms.instruction('Add a book to course by calling gRPC', async () => {
            await addBooksToCourseByGRPC(this.cms, courseId, [book.bookId]);
        });

        // https://manabie.atlassian.net/browse/LT-9237
        // BE: Data race when upsert CSV besides add student to course
        // await delay(2500);

        await this.cms.instruction(
            `Create ${quantity} study plan(s) in course by calling gRPC`,
            async () => {
                const insertMultipleStudyPlanPromises = payload.map((studyPlan) =>
                    studyPlanModifierService.upsertStudyPlan(token, studyPlan)
                );

                await Promise.all(insertMultipleStudyPlanPromises);
            }
        );

        this.scenario.set(aliasCourseStudyPlan, studyPlanList[0]);
        this.scenario.set(aliasCourseStudyPlans, [...courseStudyPlanList, ...studyPlanList]);
        this.scenario.set(aliasDescCreatedCourseStudyPlans, [
            ...studyPlanList.reverse(),
            ...descCreatedCourseStudyPlanList,
        ]);
    }
);

Then(
    'school admin sees {string} study plan matches master study plan in individual detail page',
    async function (this: IMasterWorld, studentRole: AccountRoles) {
        const context = this.scenario;
        const courseStudyPlan = context.get<StudyPlan>(aliasCourseStudyPlan);
        const courseStudyPlanList = context.get<StudyPlan[]>(aliasDescCreatedCourseStudyPlans);
        const topicList = context.get<Topic[]>(aliasRandomTopics);
        const studyPlanItemList = context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);
        const studentProfile = context.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );
        const studentProfileList = context.get<UserProfileEntity[]>(
            aliasDescCreatedStudentProfiles
        );

        const activeStudyPlanList = getStudyPlanListByStatus(
            courseStudyPlanList,
            StudyPlanStatus.STUDY_PLAN_STATUS_ACTIVE
        );

        await this.cms.instruction(
            `School admin goes to individual study plan tab on course ${courseStudyPlan.courseId} detail page`,
            async () => {
                await schoolAdminIsOnStudyPlanTab(this.cms, courseStudyPlan.courseId, 'individual');
            }
        );

        await this.cms.instruction(
            `School admin sees ${studentRole} has ${activeStudyPlanList.length} study plan(s) matches the master study plan(s)`,
            async (cms) => {
                await asyncForEach(studentProfileList, async (student, studentIndex) => {
                    if (student.id === studentProfile.id) {
                        await schoolAdminSeeAllStudyPlansByStudent(
                            cms,
                            context,
                            { name: student.name, index: studentIndex },
                            activeStudyPlanList
                        );
                    }
                });
            }
        );

        await this.cms.instruction(
            `School admin goes to study plan ${courseStudyPlan.name} detail page`,
            async (cms) => {
                await schoolAdminGoesToStudentStudyPlanDetailPage(cms, {
                    name: studentProfile.name,
                    studyPlanName: courseStudyPlan.name,
                });
            }
        );

        await this.cms.instruction(
            `School admin sees ${studentRole} study plan info matches the master study plan`,
            async (cms) => {
                await schoolAdminSeeStudyPlanInfo(cms, courseStudyPlan);
            }
        );

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

Given(
    'school admin has created a matched study plan with active and archived items',
    // TODO: slow query when upsert study plan issue
    // temporary add time out and try to remove after this ticket https://manabie.atlassian.net/browse/LT-26470
    { timeout: 130000 },
    async function () {
        const context = this.scenario;
        const courseId = context.get(aliasCourseId);
        const courseName = context.get(aliasCourseName);
        const books = context.get<Book[]>(aliasRandomBooks);

        const { student } = await createARandomStudentGRPC(this.cms, {
            parentLength: 0,
            studentPackageProfileLength: 0,
        });

        await this.cms.instruction(
            `School admin add a course ${courseName} for ${student.name} by calling gRPC`,
            async function (cms) {
                await schoolAdminAddCourseForStudent(cms, student, courseId);
            }
        );

        const studyPlanItems = context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);

        await this.cms.instruction(
            `School admin create a study plan from ${books[0].name} for ${courseName}`,
            async (cms) => {
                const { studyPlanId, studyPlanName } = await schoolAdminHasCreatedStudyPlanV2(
                    cms,
                    courseId,
                    books,
                    {
                        studyPlanItems,
                        generatorStudyPlanItems: (studyPlanItems) => {
                            const result = [...studyPlanItems];
                            const numArchivedStudyPlanItems = Math.round(result.length / 2);
                            const archivedStudyPlanItemIndices = randomUniqueIntegers(
                                result.length - 1,
                                numArchivedStudyPlanItems
                            );

                            for (const index of archivedStudyPlanItemIndices) {
                                result[index] = {
                                    ...result[index],
                                    status: StudyPlanItemStatusEnumProto.STUDY_PLAN_ITEM_STATUS_ARCHIVED,
                                };
                            }

                            return result;
                        },
                    }
                );

                context.set(aliasStudyPlanName, studyPlanName);
                context.set(aliasStudyPlanId, studyPlanId);
            }
        );
    }
);

Then(
    'school admin cannot {string} the individual study plan',
    async function (_action: 'archive' | 'unarchive') {
        await this.cms.page!.waitForSelector(actionPanelTriggerButton, {
            state: 'detached',
        });
    }
);

When(
    'school admin goes to the {string} study plan detail page',
    async function (studyPlanType: StudyPlanPageType) {
        const context = this.scenario;
        const courseId = context.get<string>(aliasCourseId);
        const courseStudyPlan = context.get<StudyPlan>(aliasCourseStudyPlan);
        const studentProfile = context.get<UserProfileEntity[]>(learnersProfileAlias)[0];

        await this.cms.instruction(
            `School admin goes to ${studyPlanType} study plan tab on course ${courseId} detail page`,
            async () => {
                await schoolAdminIsOnStudyPlanTab(this.cms, courseId, studyPlanType);
            }
        );

        await this.cms.instruction(
            `School admin goes to ${studyPlanType} ${courseStudyPlan.name} study plan detail page`,
            async () => {
                if (studyPlanType === 'master') {
                    return await schoolAdminGoesToCourseStudyPlanDetailPage(
                        this.cms,
                        courseStudyPlan.name
                    );
                }

                if (courseStudyPlan.status === StudyPlanStatus.STUDY_PLAN_STATUS_ARCHIVED)
                    throw Error('cannot go to the archived individual study plan detail page');

                await schoolAdminSelectStudyPlanTabByType(this.cms, 'student');
                await schoolAdminGoesToStudentStudyPlanDetailPage(this.cms, {
                    name: studentProfile.name,
                    studyPlanName: courseStudyPlan.name,
                });
            }
        );
    }
);

Then(
    'school admin cannot {string} the {string} master study plan',
    async function (action: 'archive' | 'unarchive', studyPlanStatus: StudyPlanStatusType) {
        await this.cms.instruction(
            `School admin cannot see the ${action} button in ${studyPlanStatus} master study plan detail page`,
            async () => {
                if (action === 'archive') {
                    return await schoolAdminCannotClickActionButtonInStudyPlanDetailPage(
                        this.cms,
                        ActionOptions.UNARCHIVE
                    );
                }

                await schoolAdminCannotClickActionButtonInStudyPlanDetailPage(
                    this.cms,
                    ActionOptions.ARCHIVE
                );
            }
        );
    }
);
