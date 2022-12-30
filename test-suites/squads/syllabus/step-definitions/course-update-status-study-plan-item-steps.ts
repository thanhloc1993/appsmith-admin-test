import {
    asyncForEach,
    createNumberArrayWithLength,
    getRandomElement,
    randomUniqueIntegersByType,
} from '@legacy-step-definitions/utils';
import { learnersProfileAlias } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    aliasCourseId,
    aliasRandomBooks,
    aliasRandomLearnerIdEditStudyPlanItems,
    aliasRandomStudyPlanItems,
    aliasStudyPlanItems,
    aliasStudyPlanItemsModify,
    aliasStudyPlanName,
} from './alias-keys/syllabus';
import { schoolAdminToggleStudyPlanItemStatus } from './course-update-status-study-plan-item-definitions';
import {
    schoolAdminAddMultipleStudentToCourse,
    schoolAdminGotoCourseDetail,
} from './create-course-studyplan-definitions';
import { generateStudyplanTime } from './syllabus-book-csv';
import {
    schoolAdminHasCreatedStudyPlanV2,
    schoolAdminSeeStudyPlanItemShouldDisableOrNot,
    schoolAdminSelectCourseStudyPlan,
    schoolAdminSelectEditStudyPlanItems,
    schoolAdminSelectStudyPlanOfStudent,
    schoolAdminSelectStudyPlanTabByType,
    schoolAdminWaitingStudyPlanDetailLoading,
} from './syllabus-study-plan-common-definitions';
import {
    mapStudyPlanItemWithInfo,
    schoolAdminBulkActionStudyPlanItems,
    schoolAdminWaitingUpdateStudyPlanItems,
} from './syllabus-study-plan-item-common-definitions';
import { StudyPlanItemStatus } from 'manabuf/eureka/v1/assignments_pb';
import { schoolAdminChooseTabInCourseDetail } from 'test-suites/common/step-definitions/course-definitions';
import {
    Book,
    StudyPlanItem as StudyPlanItemData,
    StudyPlanItemStructure,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { createARandomStudentGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

Given('school admin has added {int} students to the course', async function (totalStudent: number) {
    const courseId = this.scenario.get(aliasCourseId);

    const createMultipleStudentPromise = createNumberArrayWithLength(totalStudent).map(() =>
        createARandomStudentGRPC(this.cms, {})
    );

    const students = await Promise.all(createMultipleStudentPromise);

    const studentProfiles = students.map((student) => student.student);

    await schoolAdminAddMultipleStudentToCourse(this.cms, studentProfiles, courseId);

    this.scenario.set(learnersProfileAlias, studentProfiles);
});

When(
    'school admin has created a matched studyplan with {string} study plan items',
    {
        timeout: 100000,
    },
    async function (studyPlanItemStatus: 'active' | 'archived') {
        const courseId = this.scenario.get(aliasCourseId);
        const bookList = this.scenario.get<Book[]>(aliasRandomBooks);
        const studyPlanItemRandoms =
            this.scenario.get<StudyPlanItemData[]>(aliasRandomStudyPlanItems);

        const studyPlanItemList =
            this.scenario.get<StudyPlanItemData[]>(aliasRandomStudyPlanItems) || [];

        const { availableFrom, availableTo, startDate, endDate } =
            generateStudyplanTime('available');
        const { studyPlanName, studyPlanItemRaws } = await schoolAdminHasCreatedStudyPlanV2(
            this.cms,
            courseId,
            bookList,
            {
                studyPlanItems: studyPlanItemList,
                generatorStudyPlanItems: (items) => {
                    return items.map((item) => ({
                        ...item,
                        status:
                            studyPlanItemStatus === 'active'
                                ? StudyPlanItemStatus.STUDY_PLAN_ITEM_STATUS_ACTIVE
                                : StudyPlanItemStatus.STUDY_PLAN_ITEM_STATUS_ARCHIVED,
                        availableFrom,
                        availableTo,
                        startDate,
                        endDate,
                    }));
                },
            }
        );

        const studyPlanItems: StudyPlanItemStructure[] = mapStudyPlanItemWithInfo(
            studyPlanItemRaws,
            studyPlanItemRandoms
        );

        this.scenario.set(aliasStudyPlanItems, studyPlanItems);
        this.scenario.set(aliasStudyPlanName, studyPlanName);
    }
);

Given(
    'school admin goes to the {string} study plan detail',
    async function (type: 'random student' | 'course') {
        const studyPlanName = this.scenario.get(aliasStudyPlanName);

        if (type === 'course') {
            await this.cms.instruction(`User click into study plan ${studyPlanName}`, async () => {
                await schoolAdminSelectCourseStudyPlan(this.cms, studyPlanName);
            });
        }

        if (type === 'random student') {
            const studentsInCourse = this.scenario.get<UserProfileEntity[]>(learnersProfileAlias);
            const { name, id } = getRandomElement(studentsInCourse);
            this.scenario.set(aliasRandomLearnerIdEditStudyPlanItems, id);
            await this.cms.instruction(
                `User click into study plan ${studyPlanName} of student ${name}`,
                async () => {
                    await schoolAdminSelectStudyPlanOfStudent(this.cms, name, studyPlanName);
                }
            );
        }

        await schoolAdminWaitingStudyPlanDetailLoading(this.cms);

        await this.cms.instruction(`User at the study plan ${studyPlanName}`, async () => {
            console.log('Only avoid empty block');
        });
    }
);

Then('school admin does {string} some study plan items', async function (action: 'show' | 'hide') {
    const studyPlanItemsModify: StudyPlanItemStructure[] = [];

    await schoolAdminSelectEditStudyPlanItems(this.cms);

    const studyPlanItemList =
        this.scenario.get<StudyPlanItemStructure[]>(aliasStudyPlanItems) || [];

    const randomIndexToEdit = randomUniqueIntegersByType('multiple', studyPlanItemList.length - 1);

    await asyncForEach<number, void>(randomIndexToEdit, async (modifyIndex) => {
        const { name } = studyPlanItemList[modifyIndex];
        await this.cms.instruction(`User click ${action} study plan item ${name}`, async () => {
            await schoolAdminToggleStudyPlanItemStatus(this.cms, name);

            studyPlanItemsModify.push({
                ...studyPlanItemList[modifyIndex],
                status:
                    action == 'hide'
                        ? StudyPlanItemStatus.STUDY_PLAN_ITEM_STATUS_ARCHIVED
                        : StudyPlanItemStatus.STUDY_PLAN_ITEM_STATUS_ACTIVE,
            });
        });
    });

    await this.cms.instruction(`User saving study plan items after edited`, async () => {
        await schoolAdminBulkActionStudyPlanItems(this.cms, 'save');
        await schoolAdminWaitingUpdateStudyPlanItems(this.cms);
    });

    this.scenario.set(aliasStudyPlanItemsModify, studyPlanItemsModify);
});

Then('school admin sees status study plan items updated', async function () {
    const studyPlanItemsModify =
        this.scenario.get<StudyPlanItemStructure[]>(aliasStudyPlanItemsModify);

    await asyncForEach(studyPlanItemsModify, async (studyPlanItem) => {
        const { status, name } = studyPlanItem;
        const shouldDisable = status === StudyPlanItemStatus.STUDY_PLAN_ITEM_STATUS_ARCHIVED;

        await this.cms.instruction(
            `User sees study plan item ${name} will be ${shouldDisable ? 'archived' : 'archive'}`,
            async () => {
                await schoolAdminSeeStudyPlanItemShouldDisableOrNot(this.cms, name, shouldDisable);
            }
        );
    });
});

Then('school admin sees all student study plan items updated', async function () {
    const courseId = this.scenario.get(aliasCourseId);
    const studentsInCourse = this.scenario.get<UserProfileEntity[]>(learnersProfileAlias);
    const studyPlanName = this.scenario.get(aliasStudyPlanName);

    await asyncForEach(studentsInCourse, async (student) => {
        await schoolAdminGotoCourseDetail(this.cms, courseId);
        await schoolAdminChooseTabInCourseDetail(this.cms, 'studyPlan');
        await schoolAdminSelectStudyPlanTabByType(this.cms, 'student');
        await this.cms.waitForSkeletonLoading();

        await this.cms.instruction(
            `User click to study plan ${studyPlanName} of student ${student.name}`,
            async () => {
                await schoolAdminSelectStudyPlanOfStudent(this.cms, student.name, studyPlanName);
            }
        );

        await schoolAdminWaitingStudyPlanDetailLoading(this.cms);

        const studyPlanItemsModify =
            this.scenario.get<StudyPlanItemStructure[]>(aliasStudyPlanItemsModify);

        await asyncForEach(studyPlanItemsModify, async (studyPlanItem) => {
            const { status, name } = studyPlanItem;
            const shouldDisable = status === StudyPlanItemStatus.STUDY_PLAN_ITEM_STATUS_ARCHIVED;

            await this.cms.instruction(
                `User sees study plan item ${name} will be ${
                    shouldDisable ? 'archived' : 'archive'
                }`,
                async () => {
                    await schoolAdminSeeStudyPlanItemShouldDisableOrNot(
                        this.cms,
                        name,
                        shouldDisable
                    );
                }
            );
        });
    });
});
