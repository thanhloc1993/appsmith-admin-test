import { asyncForEach } from '@legacy-step-definitions/utils';
import { learnersProfileAlias } from '@user-common/alias-keys/user';

import { Then } from '@cucumber/cucumber';

import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    aliasCourseId,
    aliasRandomLearnerIdEditStudyPlanItems,
    aliasStudyPlanItems,
    aliasStudyPlanName,
} from './alias-keys/syllabus';
import { schoolAdminGotoCourseDetail } from './create-course-studyplan-definitions';
import {
    schoolAdminSeeStudyPlanItemShouldDisableOrNot,
    schoolAdminSelectCourseStudyPlan,
    schoolAdminSelectStudyPlanOfStudent,
    schoolAdminSelectStudyPlanTabByType,
    schoolAdminWaitingStudyPlanDetailLoading,
} from './syllabus-study-plan-common-definitions';
import { StudyPlanItemStatus } from 'manabuf/eureka/v1/assignments_pb';
import { schoolAdminChooseTabInCourseDetail } from 'test-suites/common/step-definitions/course-definitions';
import { StudyPlanItemStructure } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

Then('school admin sees study plan items of the other students not effect', async function () {
    const courseId = this.scenario.get(aliasCourseId);
    const studyPlanName = this.scenario.get(aliasStudyPlanName);
    const learnerIdEditedStudyPlanItems = this.scenario.get(aliasRandomLearnerIdEditStudyPlanItems);

    const studentsInCourseNotAffect = this.scenario
        .get<UserProfileEntity[]>(learnersProfileAlias)
        .filter((learner) => learner.id !== learnerIdEditedStudyPlanItems);

    const studyPlanItemOriginals = this.scenario.get<StudyPlanItemStructure[]>(aliasStudyPlanItems);

    await asyncForEach(studentsInCourseNotAffect, async (student) => {
        await schoolAdminGotoCourseDetail(this.cms, courseId);
        await schoolAdminChooseTabInCourseDetail(this.cms, 'studyPlan');
        await schoolAdminSelectStudyPlanTabByType(this.cms, 'student');
        await this.cms.waitForSkeletonLoading();

        await this.cms.instruction(
            `User select study plan ${studyPlanName} of student ${student.name}`,
            async () => {
                await schoolAdminSelectStudyPlanOfStudent(this.cms, student.name, studyPlanName);
            }
        );

        await schoolAdminWaitingStudyPlanDetailLoading(this.cms);

        await asyncForEach(studyPlanItemOriginals, async (studyPlanItem) => {
            const { status, name } = studyPlanItem;
            const shouldDisable = status === StudyPlanItemStatus.STUDY_PLAN_ITEM_STATUS_ARCHIVED;

            await this.cms.instruction(
                `User sees study plan item ${name}} still ${
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

Then('school admin sees course study plan not effect', async function () {
    const courseId = this.scenario.get(aliasCourseId);
    const studyPlanItemOriginals = this.scenario.get<StudyPlanItemStructure[]>(aliasStudyPlanItems);
    const studyPlanName = this.scenario.get(aliasStudyPlanName);

    await schoolAdminGotoCourseDetail(this.cms, courseId);
    await schoolAdminChooseTabInCourseDetail(this.cms, 'studyPlan');
    await this.cms.waitForSkeletonLoading();

    await this.cms.instruction(`User click into study plan ${studyPlanName}`, async () => {
        await schoolAdminSelectCourseStudyPlan(this.cms, studyPlanName);
    });

    await schoolAdminWaitingStudyPlanDetailLoading(this.cms);

    await asyncForEach(studyPlanItemOriginals, async (studyPlanItem) => {
        const { status, name } = studyPlanItem;
        const shouldDisable = status === StudyPlanItemStatus.STUDY_PLAN_ITEM_STATUS_ARCHIVED;

        await this.cms.instruction(
            `User sees study plan item ${name}} still ${shouldDisable ? 'archived' : 'archive'}`,
            async () => {
                await schoolAdminSeeStudyPlanItemShouldDisableOrNot(this.cms, name, shouldDisable);
            }
        );
    });
});
