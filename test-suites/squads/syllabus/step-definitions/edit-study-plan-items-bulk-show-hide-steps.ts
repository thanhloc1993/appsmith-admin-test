import { Given, Then, When } from '@cucumber/cucumber';

import {
    aliasBulkEditAction,
    aliasCourseId,
    aliasCourseName,
    aliasRandomBooks,
    aliasRandomStudyPlanItems,
    aliasStudyPlanId,
    aliasStudyPlanItemsStyles,
    aliasStudyPlanName,
    aliasStudyPlanSelectedItemIds,
    aliasStudyPlanType,
} from './alias-keys/syllabus';
import { schoolAdminAddMultipleStudentToCourse } from './create-course-studyplan-definitions';
import {
    BulkShowHideOption,
    schoolAdminCreatesStudyPlanItems,
    schoolAdminGetStyleOfSelectedRows,
    schoolAdminSeesStudyPlanItemStatus,
    schoolAdminSeesStyleOfSelectedStudyPlanItemsChanged,
    schoolAdminSeeStatusStudyPlanItemChanged,
    schoolAdminSelectBulkShowHideAction,
    StudyPlanCreatedType,
    VisibilityType,
} from './edit-study-plan-items-bulk-show-hide-definitions';
import {
    schoolAdminSelectsStudyPlanTopics,
    StudyPlanType,
    TopicSelectionSet,
} from './study-plan-items-edit-definitions';
import {
    schoolAdminGoesToIndividualStudyPlan,
    schoolAdminWaitingStudyPlanDetailLoading,
} from './syllabus-study-plan-common-definitions';
import { convertOneOfStringTypeToArray, delay, getRandomElement } from 'step-definitions/utils';
import {
    Book,
    StudyPlanItem,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { createARandomStudentGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

Given(
    'school admin has created a matched study plan with {string}',
    async function (type: StudyPlanCreatedType) {
        const courseId = this.scenario.get(aliasCourseId);
        const courseName = this.scenario.get(aliasCourseName);
        const books = this.scenario.get<Book[]>(aliasRandomBooks);
        const studyPlanItems = this.scenario.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);

        await this.cms.instruction(
            `school admin creates a study plan from ${books[0].name} for ${courseName}`,
            async () => {
                const { student } = await createARandomStudentGRPC(this.cms, {
                    parentLength: 0,
                    studentPackageProfileLength: 0,
                });

                await schoolAdminAddMultipleStudentToCourse(this.cms, [student], courseId);
                await delay(2500); // ensure student is added to course

                const { studyPlanId, studyPlanName } = await schoolAdminCreatesStudyPlanItems(
                    this.cms,
                    type,
                    courseId,
                    books,
                    studyPlanItems
                );

                this.scenario.set(aliasStudyPlanName, studyPlanName);
                this.scenario.set(aliasStudyPlanId, studyPlanId);
            }
        );
    }
);

When(
    'school admin selects {string} in bulk action menu',
    async function (action: BulkShowHideOption) {
        await this.cms.instruction(
            `school admin sees ${action} in bulk edit menu and selects it`,
            async () => {
                await schoolAdminSelectBulkShowHideAction(this.cms, action);
            }
        );

        this.scenario.set(aliasBulkEditAction, action);
    }
);

Then(
    'school admin selects {string} topics in {string} study plan table',
    async function (selections: string, studyPlanType: StudyPlanType) {
        const selection = getRandomElement(
            convertOneOfStringTypeToArray(selections)
        ) as TopicSelectionSet;

        await schoolAdminWaitingStudyPlanDetailLoading(this.cms);

        await this.cms.instruction(
            `school admin selects ${selection} topics in ${studyPlanType} study plan table`,
            async () => {
                await schoolAdminSelectsStudyPlanTopics(this.cms, this.scenario, selection);
            }
        );

        this.scenario.set(aliasStudyPlanType, studyPlanType);
    }
);

Then(
    'school admin sees visibility icon is changed to {string}',
    async function (status: VisibilityType) {
        await this.cms.instruction(`school admin sees visibility icon is changed`, async () => {
            await schoolAdminSeeStatusStudyPlanItemChanged(this.cms, status);
        });
    }
);

Then(
    `school admin sees selected study plan items in {string} study plan are {string}`,
    async function (studyPlanType: StudyPlanType, status: VisibilityType) {
        const selectedItemIds = this.scenario.get<string[]>(aliasStudyPlanSelectedItemIds);

        await schoolAdminWaitingStudyPlanDetailLoading(this.cms);

        await this.cms.instruction(
            `school admin sees bulk study plan items values changed in ${studyPlanType} study plan`,
            async () => {
                await schoolAdminSeesStyleOfSelectedStudyPlanItemsChanged(
                    this.cms,
                    status,
                    selectedItemIds
                );
                const currentStyles = await schoolAdminGetStyleOfSelectedRows(
                    this.cms,
                    selectedItemIds
                );
                this.scenario.set(aliasStudyPlanItemsStyles, currentStyles);
            }
        );
    }
);

Then(
    `school admin sees the status of study plan items in individual study plan of {string} changed to {string}`,
    async function (student: 'student S1' | 'student S2', status: VisibilityType) {
        const studyPlanType = this.scenario.get<StudyPlanType>(aliasStudyPlanType);
        const selectedItemIds = this.scenario.get<string[]>(aliasStudyPlanSelectedItemIds);
        const studyPlanItemsStyles =
            this.scenario.get<CSSStyleDeclaration[]>(aliasStudyPlanItemsStyles);

        await this.cms.instruction(
            `school admin goes to individual study plan page of ${student}`,
            async () => {
                await schoolAdminGoesToIndividualStudyPlan(this.cms, this.scenario, student);
            }
        );

        await schoolAdminWaitingStudyPlanDetailLoading(this.cms);

        await this.cms.instruction(
            `school admin sees status of study plan items changed in individual study plan of ${student}`,
            async () => {
                switch (studyPlanType) {
                    case 'master': {
                        await schoolAdminSeesStudyPlanItemStatus(
                            this.cms,
                            studyPlanItemsStyles,
                            true
                        );
                        break;
                    }

                    case 'individual': {
                        await schoolAdminSeesStyleOfSelectedStudyPlanItemsChanged(
                            this.cms,
                            status,
                            selectedItemIds
                        );
                        const currentStyles = await schoolAdminGetStyleOfSelectedRows(
                            this.cms,
                            selectedItemIds
                        );
                        this.scenario.set(aliasStudyPlanItemsStyles, currentStyles);
                        break;
                    }
                }
            }
        );
    }
);

Then(
    `school admin sees the status of study plan items in individual study plan of {string} unchanged`,
    async function (student: 'student S1' | 'student S2') {
        const studentStudyPlanItemsStyles =
            this.scenario.get<CSSStyleDeclaration[]>(aliasStudyPlanItemsStyles);

        await this.cms.instruction(
            `school admin goes to individual study plan page of ${student}`,
            async () => {
                await schoolAdminGoesToIndividualStudyPlan(this.cms, this.scenario, student);
            }
        );

        await schoolAdminWaitingStudyPlanDetailLoading(this.cms);

        await this.cms.instruction(
            `school admin sees status of study plan items unchanged in individual study plan of ${student}`,
            async () => {
                await schoolAdminSeesStudyPlanItemStatus(
                    this.cms,
                    studentStudyPlanItemsStyles,
                    false
                );
            }
        );
    }
);
