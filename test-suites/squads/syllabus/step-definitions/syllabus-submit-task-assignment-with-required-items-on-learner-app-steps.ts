import { genId } from '@legacy-step-definitions/utils';

import { Given, Then } from '@cucumber/cucumber';

import { emojiList } from '@supports/constants';

import {
    aliasCourseId,
    aliasCourseName,
    aliasCurrentLearnerToDoTab,
    aliasTaskAssignmentCompleteDate,
    aliasTaskAssignmentName,
    aliasTaskAssignmentPreviousSelectedEmoji,
    aliasTaskAssignmentSetting,
    aliasTaskAssignmentTextNote,
    aliasTaskAssignmentUnderstandingLevel,
} from './alias-keys/syllabus';
import { studentSeesSubmittedUnderstandingLevel } from './edit-task-assignment-submission-on-teacher-app-definitions';
import { schoolAdminIsOnBookDetailsPage } from './syllabus-content-book-create-definitions';
import {
    schoolAdminSelectTaskAssignmentSetting,
    TaskAssignmentSettingInfo,
} from './syllabus-create-task-assignment-definitions';
import { schoolAdminSelectEditAssignment } from './syllabus-edit-assignment-definitions';
import { schoolAdminSaveChangesTaskAssignment } from './syllabus-edit-task-assignment-definitions';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import { teacherSeesSubmittedTextNote } from './syllabus-submit-task-assignment-on-learner-app-definitions';
import { teacherGoesToTaskAssignmentDetailScreen } from './syllabus-submit-task-assignment-on-teacher-web-definitions';
import {
    schoolAdminGoesToLODetailPage,
    studentFillsCompleteDate,
    studentFillsTextNote,
    studentGoesToTabInToDoScreen,
    studentSeesPreviousSelectedEmojiDeselected,
    studentSelectsUnderstandingLevel,
} from './syllabus-submit-task-assignment-with-required-items-on-learner-app-definitions';
import { studentGoesToTodosScreen, studentSeeStudyPlanItemInToDoTab } from './syllabus-utils';

Given(
    `school admin edits required items in task assignment to include {string}`,
    async function (setting: TaskAssignmentSettingInfo) {
        const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);

        await this.cms.instruction(`school admin goes to task assignment detail page`, async () => {
            await schoolAdminIsOnBookDetailsPage(this.cms, this.scenario);
            await schoolAdminGoesToLODetailPage(this.cms, taskAssignmentName);
        });

        await this.cms.instruction(`school admin selects to edit task assignment`, async () => {
            await schoolAdminSelectEditAssignment(this.cms);
        });

        await this.cms.instruction(
            `school admin edits required items to include ${setting}`,
            async () => {
                await schoolAdminSelectTaskAssignmentSetting(this.cms, [setting]);
                await schoolAdminSaveChangesTaskAssignment(this.cms);
            }
        );

        this.scenario.set(aliasTaskAssignmentSetting, setting);
    }
);

Then(`student fills the task assignment with text note`, async function () {
    const textNote = `Text note ${genId()}`;

    await this.learner.instruction(`student fills complete date`, async () => {
        const completeDate = await studentFillsCompleteDate(this.learner);
        this.scenario.set(aliasTaskAssignmentCompleteDate, completeDate);
    });

    await this.learner.instruction(`student fills text note`, async () => {
        await studentFillsTextNote(this.learner, textNote);
        this.scenario.set(aliasTaskAssignmentTextNote, textNote);
    });
});

Then(`teacher goes to task assignment detail screen`, async function () {
    const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);
    const courseName = this.scenario.get(aliasCourseName);
    const courseId = this.scenario.get(aliasCourseId);
    const studentId = await this.learner.getUserId();

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

Then(`teacher sees the submission with text note`, async function () {
    const textNote = this.scenario.get(aliasTaskAssignmentTextNote);

    await this.teacher.instruction(`teacher sees data ${textNote} on text note`, async () => {
        await teacherSeesSubmittedTextNote(this.teacher, textNote);
    });
});

Then(`student fills the task assignment without text note`, async function () {
    const textNote = '';

    await this.learner.instruction(`student fills complete date`, async () => {
        const completeDate = await studentFillsCompleteDate(this.learner);
        this.scenario.set(aliasTaskAssignmentCompleteDate, completeDate);
    });

    await this.learner.instruction(`student fills text note with empty string`, async () => {
        await studentFillsTextNote(this.learner, textNote);
    });
});

Then(`student selects one of three emoticons`, async function () {
    await this.learner.instruction(`student selects one of three emoticons`, async () => {
        await studentSelectsUnderstandingLevel(this.learner);
    });
});

Then(`student sees emoticon is selected`, async function () {
    const understandingLevel = this.scenario.get(aliasTaskAssignmentUnderstandingLevel);

    await this.learner.instruction(`student sees emoticon is selected`, async () => {
        await studentSeesSubmittedUnderstandingLevel(this.learner, understandingLevel);
    });
});

Then(`student has selected one of three emoticons`, async function () {
    await this.learner.instruction(`student has selected one of three emoticons`, async () => {
        const selectedEmoji = await studentSelectsUnderstandingLevel(this.learner);
        this.scenario.set(aliasTaskAssignmentPreviousSelectedEmoji, selectedEmoji);
    });
});

Then(`student selects another emoticon`, async function () {
    const previousSelectedEmoji = this.scenario.get(aliasTaskAssignmentPreviousSelectedEmoji);

    await this.learner.instruction(`student selects another emoticon`, async () => {
        const selectedEmoji = await studentSelectsUnderstandingLevel(
            this.learner,
            emojiList.filter((emoji) => emoji !== previousSelectedEmoji)
        );
        this.scenario.set(aliasTaskAssignmentUnderstandingLevel, selectedEmoji);
    });
});

Then(`student sees previous emoticon is deselected`, async function () {
    const previousEmoji = this.scenario.get(aliasTaskAssignmentPreviousSelectedEmoji);

    await this.learner.instruction(`student sees emoticon is deselected`, async () => {
        await studentSeesPreviousSelectedEmojiDeselected(this.learner, previousEmoji);
    });
});

Then(`student sees task assignment submitted`, async function () {
    const studyPlanItemName = this.scenario.get(aliasTaskAssignmentName);

    await this.learner.instruction('student goes to todo screen', async () => {
        await studentGoesToTodosScreen(this.learner);
    });

    await this.learner.instruction(`student goes to completed tab in todo screen`, async () => {
        await studentGoesToTabInToDoScreen(this.learner, 'completed');
        this.scenario.set(aliasCurrentLearnerToDoTab, 'completed');
    });

    await studentSeeStudyPlanItemInToDoTab(this.learner, studyPlanItemName, 'completed');
});
