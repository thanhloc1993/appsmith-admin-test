import { Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    aliasCourseId,
    aliasCourseName,
    aliasStudyPlanId,
    aliasStudyPlanName,
    aliasTaskAssignmentName,
    aliasTaskAssignmentSetting,
} from './alias-keys/syllabus';
import {
    teacherSeesTaskAssignmentCompleteDate,
    teacherSeesTaskAssignmentRequiredField,
} from './create-task-assignment-with-required-items-definitions';
import {
    schoolAdminEditsStudyPlanItems,
    schoolAdminGoToStudyPlanDetail,
    schoolAdminGoToStudyPlanDetailViaUrl,
    schoolAdminModifiesStudyPlanItemsForAvailable,
    schoolAdminSavesStudyPlanItems,
} from './study-plan-items-edit-definitions';
import { TaskAssignmentSettingInfo } from './syllabus-create-task-assignment-definitions';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import { teacherGoesToTaskAssignmentDetailScreen } from './syllabus-submit-task-assignment-on-teacher-web-definitions';
import { asyncForEach } from 'step-definitions/utils';

Then(
    'school admin modifies that task assignment available for studying',
    async function (this: IMasterWorld) {
        try {
            const courseName = this.scenario.get(aliasCourseName);
            const studyPlanName = this.scenario.get(aliasStudyPlanName);

            await this.cms.instruction(
                'school admin goes to course study plan detail page',
                async () => {
                    await schoolAdminGoToStudyPlanDetail(
                        this.cms,
                        'master',
                        courseName,
                        studyPlanName
                    );
                }
            );
        } catch {
            const studyPlanId = this.scenario.get(aliasStudyPlanId);
            const courseId = this.scenario.get(aliasCourseId);

            await this.cms.instruction(
                `school admin navigates to study plan detail page via url`,
                async () => {
                    await schoolAdminGoToStudyPlanDetailViaUrl(this.cms, studyPlanId, courseId);
                }
            );
        }

        await this.cms.instruction(
            'school admin clicks the edit button',
            schoolAdminEditsStudyPlanItems
        );

        await this.cms.instruction(
            'school admin updates created study plan item to make it available for studying',
            async () => {
                const name = this.scenario.get<string>(aliasTaskAssignmentName);
                await schoolAdminModifiesStudyPlanItemsForAvailable(this.cms, name);
            }
        );

        await this.cms.instruction(
            'school admin press save button and confirm dialog',
            async () => {
                await schoolAdminSavesStudyPlanItems(this.cms, this.scenario);
            }
        );
    }
);

Then('teacher is on task assignment detail screen', async function (this: IMasterWorld) {
    const courseName = this.scenario.get<string>(aliasCourseName);
    const courseId = this.scenario.get<string>(aliasCourseId);
    const studentId = await this.learner.getUserId();
    const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);

    await this.teacher.instruction(
        `teacher goes to course ${courseName} people tab from home page`,
        async () => {
            await teacherGoesToStudyPlanDetails(this.teacher, courseId, studentId);
        }
    );

    await this.teacher.instruction(`teacher goes to task assignment detail screen`, async () => {
        await teacherGoesToTaskAssignmentDetailScreen(this.teacher, taskAssignmentName);
    });
});

Then('teacher sees task assignment with required fields', async function (this: IMasterWorld) {
    const settings = this.scenario.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);

    await this.teacher.instruction('teacher sees complete date', async () => {
        await teacherSeesTaskAssignmentCompleteDate(this.teacher);
    });

    await asyncForEach(settings, async (setting) => {
        await this.teacher.instruction(`teacher sees ${setting}`, async () => {
            await teacherSeesTaskAssignmentRequiredField(this.teacher, setting);
        });
    });
});
