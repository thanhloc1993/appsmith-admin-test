import { genId } from '@legacy-step-definitions/utils';

import { Given, Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { emojiList } from '@supports/constants';

import {
    studentSeesSubmittedCorrectness,
    studentSeesSubmittedTextNote,
    studentSeesSubmittedUnderstandingLevel,
    studentSeesTaskAssignmentAttachments,
    teacherCannotEditCompleteDateOrDuration,
    teacherEditsCorrectnessOnTaskAssignment,
    teacherEditsTextNoteOnTaskAssignment,
    teacherRemovesAttachmentFilesOnTaskAssignment,
    teacherSelectsUnderstandingLevelOnTaskAssignment,
    teacherTapsCompleteDateOnTaskAssignment,
    teacherTapsDurationOnTaskAssignment,
} from './edit-task-assignment-submission-on-teacher-app-definitions';
import { schoolAdminIsOnBookDetailsPage } from './syllabus-content-book-create-definitions';
import { studentGoesToLODetailsPage } from './syllabus-create-question-definitions';
import {
    schoolAdminSelectTaskAssignmentSetting,
    TaskAssignmentSettingInfo,
} from './syllabus-create-task-assignment-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { schoolAdminSelectEditAssignment } from './syllabus-edit-assignment-definitions';
import { schoolAdminSaveChangesTaskAssignment } from './syllabus-edit-task-assignment-definitions';
import { studentSeeStudyPlanItem } from './syllabus-study-plan-upsert-definitions';
import {
    studentIsOnTaskAssignmentDetailScreen,
    teacherSeesCompleteStatusOnTaskAssignmentDetailScreen,
    teacherSeesSubmittedCorrectness,
    teacherSeesSubmittedTextNote,
    teacherSeesSubmittedUnderstandingLevel,
    teacherSeesTaskAssignmentAttachments,
} from './syllabus-submit-task-assignment-on-learner-app-definitions';
import {
    schoolAdminGoesToTaskAssignmentDetails,
    teacherAttachesFilesOnTaskAssignment,
    teacherCannotSubmitTaskAssignment,
    teacherGetsAttachmentNamesOnTaskAssignment,
    teacherGoesToTaskAssignmentDetailScreen,
    teacherSeesDashboard,
    teacherSubmitsTaskAssignment,
} from './syllabus-submit-task-assignment-on-teacher-web-definitions';
import {
    getRandomTaskAssignmentSettings,
    studentGoesToHomeTab,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
} from './syllabus-utils';
import {
    aliasAssignmentFiles,
    aliasCourseName,
    aliasTaskAssignmentCorrectness,
    aliasTaskAssignmentName,
    aliasTaskAssignmentSetting,
    aliasTaskAssignmentTextNote,
    aliasTaskAssignmentUnderstandingLevel,
    aliasTopicName,
} from 'step-definitions/alias-keys/syllabus';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

Then(
    `school admin edits required items in task assignment to include duration and n of remaining required items`,
    async function (this: IMasterWorld) {
        const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);

        await this.cms.instruction(`school admin goes to task assignment detail page`, async () => {
            await schoolAdminIsOnBookDetailsPage(this.cms, this.scenario);
            await schoolAdminGoesToTaskAssignmentDetails(
                this.cms,
                this.scenario,
                taskAssignmentName
            );
        });

        await this.cms.instruction(`school admin selects to edit the assignment`, async () => {
            await schoolAdminSelectEditAssignment(this.cms);
        });

        const setting = getRandomTaskAssignmentSettings();

        if (!setting.includes('Duration')) {
            setting.push('Duration');
        }

        await this.cms.instruction(
            `school admin edits required items to include duration and n random remaining required items`,
            async () => {
                await schoolAdminSelectTaskAssignmentSetting(this.cms, setting);
                await schoolAdminSaveChangesTaskAssignment(this.cms);
            }
        );

        this.scenario.set(aliasTaskAssignmentSetting, setting);
    }
);

Given(`teacher edits student's task submission`, async function (this: IMasterWorld) {
    const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);
    const settings = this.scenario.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);

    await this.teacher.instruction(`teacher goes to task assignment detail screen`, async () => {
        await teacherGoesToTaskAssignmentDetailScreen(this.teacher, taskAssignmentName);
    });

    await this.teacher.instruction(
        `teacher edits student's task submission on Teacher app`,
        async () => {
            for (let i = 0; i < settings.length; i++) {
                switch (settings[i]) {
                    case 'Text note': {
                        await this.teacher.instruction(`teacher edits text note`, async () => {
                            const textNote = await teacherEditsTextNoteOnTaskAssignment(
                                this.teacher,
                                `Edited text note ${genId()}`
                            );
                            this.scenario.set(aliasTaskAssignmentTextNote, textNote);
                        });
                        break;
                    }
                    case 'Correctness': {
                        await this.teacher.instruction(`teacher edits correctness`, async () => {
                            const { correctValue, totalValue } =
                                await teacherEditsCorrectnessOnTaskAssignment(
                                    this.teacher,
                                    '1',
                                    '2'
                                );
                            const correctness = `${correctValue}/${totalValue}`;
                            this.scenario.set(aliasTaskAssignmentCorrectness, correctness);
                        });
                        break;
                    }
                    case 'File attachment': {
                        await this.teacher.instruction(
                            `teacher edits file attachment`,
                            async () => {
                                await teacherAttachesFilesOnTaskAssignment(this.teacher);
                                await teacherGetsAttachmentNamesOnTaskAssignment(
                                    this.teacher,
                                    this.scenario
                                );
                            }
                        );
                        break;
                    }
                    case 'Understanding level': {
                        await this.teacher.instruction(
                            `teacher edits understanding level`,
                            async () => {
                                const randomIndex = randomInteger(0, emojiList.length - 1);
                                const selectedEmoji = emojiList[randomIndex];

                                await teacherSelectsUnderstandingLevelOnTaskAssignment(
                                    this.teacher,
                                    selectedEmoji
                                );
                                this.scenario.set(
                                    aliasTaskAssignmentUnderstandingLevel,
                                    selectedEmoji
                                );
                            }
                        );
                        break;
                    }
                }
            }
        }
    );

    await this.teacher.instruction(`teacher submits task assignment on Teacher App`, async () => {
        await teacherSubmitsTaskAssignment(this.teacher);
    });

    await this.teacher.instruction(
        `teacher sees dashboard after submit task assignment`,
        async () => {
            await teacherSeesDashboard(this.teacher);
        }
    );
});

Then(
    `teacher sees values in student's task submission edited`,
    async function (this: IMasterWorld) {
        const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);
        const setting = this.scenario.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);

        await this.teacher.instruction(
            `teacher goes to task assignment detail screen`,
            async () => {
                await teacherGoesToTaskAssignmentDetailScreen(this.teacher, taskAssignmentName);
            }
        );

        for (let i = 0; i < setting.length; i++) {
            switch (setting[i]) {
                case 'Text note': {
                    const textNote = this.scenario.get(aliasTaskAssignmentTextNote);
                    await this.teacher.instruction(
                        `teacher sees data ${textNote} on text note`,
                        async () => {
                            await teacherSeesSubmittedTextNote(this.teacher, textNote);
                        }
                    );
                    break;
                }
                case 'Correctness': {
                    const correctness = this.scenario.get(aliasTaskAssignmentCorrectness);
                    await this.teacher.instruction(
                        `teacher sees data ${correctness} on correctness`,
                        async () => {
                            await teacherSeesSubmittedCorrectness(this.teacher, correctness);
                        }
                    );
                    break;
                }
                case 'File attachment': {
                    const attachmentFileNames = this.scenario.get<string[]>(aliasAssignmentFiles);
                    await this.teacher.instruction(
                        `teacher sees data ${attachmentFileNames[0]} on attachment`,
                        async () => {
                            await teacherSeesTaskAssignmentAttachments(
                                this.teacher,
                                attachmentFileNames[0]
                            );
                        }
                    );
                    break;
                }
                case 'Understanding level': {
                    const understandingLevel = this.scenario.get(
                        aliasTaskAssignmentUnderstandingLevel
                    );
                    await this.teacher.instruction(
                        `teacher sees data ${understandingLevel} on understanding level`,
                        async () => {
                            await teacherSeesSubmittedUnderstandingLevel(
                                this.teacher,
                                understandingLevel
                            );
                        }
                    );
                    break;
                }
            }
        }
    }
);

Then(`teacher sees task assignment's status is unchanged`, async function (this: IMasterWorld) {
    await this.teacher.instruction(
        `teacher sees task assignment's status is unchanged`,
        async () => {
            await teacherSeesCompleteStatusOnTaskAssignmentDetailScreen(this.teacher);
        }
    );
});

Then(
    `student sees values in student's task submission {string}`,
    async function (this: IMasterWorld, _: string) {
        const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);
        const courseName = this.scenario.get(aliasCourseName);
        const topicName = this.scenario.get(aliasTopicName);
        const setting = this.scenario.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);

        await this.learner.instruction('student goes to topic screen', async () => {
            await studentGoesToHomeTab(this.learner);
            await studentRefreshHomeScreen(this.learner);
            await studentGoToCourseDetail(this.learner, courseName);
            await studentGoToTopicDetail(this.learner, topicName);
        });

        await this.learner.instruction(
            'student goes to task assignment detail screen',
            async () => {
                await studentSeeStudyPlanItem(this.learner, topicName, taskAssignmentName);
                await studentGoesToLODetailsPage(this.learner, topicName, taskAssignmentName);
                await studentIsOnTaskAssignmentDetailScreen(this.learner, taskAssignmentName);
            }
        );

        for (let i = 0; i < setting.length; i++) {
            switch (setting[i]) {
                case 'Text note': {
                    const textNote = this.scenario.get(aliasTaskAssignmentTextNote);
                    await this.learner.instruction(`student sees text note edited`, async () => {
                        await studentSeesSubmittedTextNote(this.learner, textNote);
                    });
                    break;
                }
                case 'Correctness': {
                    const correctness = this.scenario.get(aliasTaskAssignmentCorrectness);
                    await this.learner.instruction(`student sees correctness edited`, async () => {
                        await studentSeesSubmittedCorrectness(this.learner, correctness);
                    });
                    break;
                }
                case 'File attachment': {
                    const attachmentFileNames = this.scenario.get<string[]>(aliasAssignmentFiles);
                    await this.learner.instruction(`student sees attachment edited`, async () => {
                        await studentSeesTaskAssignmentAttachments(
                            this.learner,
                            attachmentFileNames[0]
                        );
                    });
                    break;
                }
                case 'Understanding level': {
                    const understandingLevel = this.scenario.get(
                        aliasTaskAssignmentUnderstandingLevel
                    );
                    await this.learner.instruction(
                        `student sees understanding level edited`,
                        async () => {
                            await studentSeesSubmittedUnderstandingLevel(
                                this.learner,
                                understandingLevel
                            );
                        }
                    );
                    break;
                }
            }
        }
    }
);

Given(
    `teacher edits {string} in student's task submission`,
    async function (this: IMasterWorld, type: 'complete date' | 'duration') {
        const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);

        await this.teacher.instruction(
            `teacher goes to task assignment detail screen`,
            async () => {
                await teacherGoesToTaskAssignmentDetailScreen(this.teacher, taskAssignmentName);
            }
        );

        switch (type) {
            case 'complete date': {
                await this.teacher.instruction(`teacher edits complete date`, async () => {
                    await teacherTapsCompleteDateOnTaskAssignment(this.teacher);
                });
                break;
            }

            case 'duration': {
                await this.teacher.instruction(`teacher edits duration`, async () => {
                    await teacherTapsDurationOnTaskAssignment(this.teacher);
                });
                break;
            }
        }
    }
);

Then(`teacher can't edit student's task submission`, async function (this: IMasterWorld) {
    await this.teacher.instruction(`teacher can't edit student's task submission`, async () => {
        await teacherCannotEditCompleteDateOrDuration(this.teacher);
    });
});

Given(
    `teacher edits value in student's task submission to empty data`,
    async function (this: IMasterWorld) {
        const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);
        const settings = this.scenario.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);

        await this.teacher.instruction(
            `teacher goes to task assignment detail screen`,
            async () => {
                await teacherGoesToTaskAssignmentDetailScreen(this.teacher, taskAssignmentName);
            }
        );

        await this.teacher.instruction(
            `teacher edits student's task submission on Teacher app`,
            async () => {
                for (let i = 0; i < settings.length; i++) {
                    switch (settings[i]) {
                        case 'Text note': {
                            await this.teacher.instruction(
                                `teacher edits text note to null`,
                                async () => {
                                    await teacherEditsTextNoteOnTaskAssignment(this.teacher, '');
                                }
                            );
                            break;
                        }
                        case 'Correctness': {
                            await this.teacher.instruction(
                                `teacher edits correctness to null`,
                                async () => {
                                    await teacherEditsCorrectnessOnTaskAssignment(
                                        this.teacher,
                                        '',
                                        ''
                                    );
                                }
                            );
                            break;
                        }
                        case 'File attachment': {
                            await this.teacher.instruction(
                                `teacher removes attachment`,
                                async () => {
                                    await teacherRemovesAttachmentFilesOnTaskAssignment(
                                        this.teacher
                                    );
                                }
                            );
                            break;
                        }
                        case 'Understanding level': {
                            await this.teacher.instruction(
                                `teacher selects selected understanding level again`,
                                async () => {
                                    const selectedEmoji = this.scenario.get(
                                        aliasTaskAssignmentUnderstandingLevel
                                    );
                                    await teacherSelectsUnderstandingLevelOnTaskAssignment(
                                        this.teacher,
                                        selectedEmoji
                                    );
                                }
                            );
                            break;
                        }
                    }
                }
            }
        );
    }
);

Then(`teacher can't edits student's task submission`, async function (this: IMasterWorld) {
    await this.teacher.instruction(`teacher can't edits student's task submission`, async () => {
        await teacherCannotSubmitTaskAssignment(this.teacher);
    });
});
