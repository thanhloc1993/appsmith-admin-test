import { WithOrWithout } from '@legacy-step-definitions/types/common';

import { When, Then, Given } from '@cucumber/cucumber';

import { genId } from '@drivers/message-formatter/utils';

import { IMasterWorld, TeacherInterface } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import {
    aliasCourseId,
    aliasCourseName,
    aliasTopicFormData,
    aliasTopicIconURL,
    aliasTopicName,
} from './alias-keys/syllabus';
import { topicFormRoot } from './cms-selectors/cms-keys';
import { teacherGoToCourseStudentDetail } from './create-course-studyplan-definitions';
import { schoolAdminFillTopicForm } from './syllabus-content-book-create-definitions';
import { schoolAdminSeeTopic } from './syllabus-create-topic-definitions';
import { schoolAdminSelectTopicOption } from './syllabus-delete-topic-definitions';
import {
    schoolAdminChoosesRenameTopic,
    schoolAdminClicksTopicOptions,
    schoolAdminEditsTopicIcon,
    schoolAdminEditsTopicName,
    schoolAdminSaveEditedTopicOption,
    schoolAdminSeesNewTopicIcon,
    schoolAdminSeesRenamedTopic,
    schoolAdminSeeTopicInStudyPlanDetail,
    schoolAdminSubmitTopicForm,
    schoolAdminWaitingTopicDialogHidden,
    studentSeesNewTopicIcon,
    studentSeesRenamedTopic,
} from './syllabus-edit-topic-definitions';
import {
    teacherScrollIntoTopic,
    teacherScrollIntoTopicAvatar,
} from './syllabus-expand-collapse-topic-definitions';
import {
    schoolAdminSeesErrorMessageField,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
} from './syllabus-utils';
import {
    TopicForm,
    TopicOptionInfo,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(
    `school admin edits topic {string}`,
    async function (this: IMasterWorld, topicEditOption: TopicOptionInfo): Promise<void> {
        const context = this.scenario;

        await this.cms.instruction(`school admin chooses topic edit options`, async function (cms) {
            await schoolAdminClicksTopicOptions(cms, context);
        });

        await this.cms.instruction(
            `school admin chooses rename topic option`,
            async function (cms) {
                await schoolAdminChoosesRenameTopic(cms, context);
            }
        );

        switch (topicEditOption) {
            case 'name': {
                await this.cms.instruction(`school admin edits topic name`, async function (cms) {
                    await schoolAdminEditsTopicName(cms, context);
                });
                break;
            }
            case 'icon': {
                await this.cms.instruction(`school admin edits topic name`, async function (cms) {
                    await schoolAdminEditsTopicIcon(cms, context);
                });
                break;
            }
        }

        await this.cms.instruction(`school admin save edited topic option`, async function (cms) {
            await schoolAdminSaveEditedTopicOption(cms, context);
        });
    }
);

Then(
    `school admin sees the edited topic {string} on CMS`,
    async function (this: IMasterWorld, topicEditOption: TopicOptionInfo): Promise<void> {
        const context = this.scenario;
        switch (topicEditOption) {
            case 'name': {
                await this.cms.instruction(
                    `school admin sees the edited topic name on CMS`,
                    async function (cms) {
                        await schoolAdminSeesRenamedTopic(cms, context);
                    }
                );
                break;
            }
            case 'icon': {
                await this.cms.instruction(
                    `school admin sees the edited topic icon on CMS`,
                    async function (cms) {
                        await schoolAdminSeesNewTopicIcon(cms, context);
                    }
                );
                break;
            }
        }
    }
);

Then(
    `student sees the edited topic {string} on Learner App`,
    async function (this: IMasterWorld, topicEditOption: TopicOptionInfo) {
        const context = this.scenario;
        const topicName = context.get<string>(aliasTopicName);
        const topicIconURL = context.get<string>(aliasTopicIconURL);

        await this.learner.instruction(
            `student refresh course list and go to course details page`,
            async function (learner) {
                const courseName = context.get<string>(aliasCourseName);
                await studentRefreshHomeScreen(learner);
                await studentGoToCourseDetail(learner, courseName);
            }
        );

        if (topicEditOption === 'name') {
            await this.learner.instruction(
                `student sees the edited topic name on Learner App`,
                async function (learner) {
                    await studentSeesRenamedTopic(learner, topicName);
                }
            );

            return;
        }

        await this.learner.instruction(
            `student sees the edited topic icon on Learner App`,
            async function (learner) {
                await studentSeesNewTopicIcon(learner, topicIconURL);
            }
        );
    }
);

Then('school admin sees the edited topic on master study plan CMS', async function () {
    const topicName = this.scenario.get(aliasTopicName);

    await this.cms.instruction(`User see edited topic ${topicName} in SP detail`, async () => {
        await schoolAdminSeeTopicInStudyPlanDetail(this.cms, topicName);
    });
});

Then('school admin sees the edited topic on individual study plan CMS', async function () {
    const topicName = this.scenario.get(aliasTopicName);

    await this.cms.instruction(`User see edited topic ${topicName} in SP detail`, async () => {
        await schoolAdminSeeTopicInStudyPlanDetail(this.cms, topicName);
    });
});

Then(
    `teacher does not see the edited topic {string} on Teacher App`,
    async function (this: IMasterWorld, topicEditOption: TopicOptionInfo): Promise<void> {
        await this.teacher.instruction(
            `teacher does not see the edited topic ${topicEditOption} on Teacher App`,
            async function () {
                console.log(`There is no book flow on teacher`);
            }
        );
    }
);

Then(
    'teacher sees the edited topic {string} on Teacher App',
    async function (this: IMasterWorld, topicEditOption: TopicOptionInfo) {
        const topicName = this.scenario.get<string>(aliasTopicName);
        const topicIconURL = this.scenario.get<string>(aliasTopicIconURL);

        const courseId = this.scenario.get(aliasCourseId);
        const studentProfile = await this.learner.getProfile();

        await this.teacher.instruction(
            `Teacher goes to studyplan detail of the student`,
            async function (this: TeacherInterface) {
                await teacherGoToCourseStudentDetail(this, courseId, studentProfile.id);
            }
        );

        if (topicEditOption === 'name') {
            await this.teacher.instruction(`Teacher sees the ${topicName}`, async () => {
                await teacherScrollIntoTopic(this.teacher, topicName);
            });

            return;
        }

        await this.teacher.instruction(
            `Teacher sees the edited topic icon ${topicIconURL} of ${topicName}`,
            async () => {
                await teacherScrollIntoTopicAvatar(this.teacher, topicName, topicIconURL);
            }
        );
    }
);

Given('school admin selects a topic in book to edit', async function (this: IMasterWorld) {
    const topicName = this.scenario.get(aliasTopicName);
    await this.cms.instruction(
        `school admin select rename in panel option of topic ${topicName}`,
        async () => {
            await schoolAdminSelectTopicOption(this.cms, topicName, ActionOptions.RENAME);
        }
    );
});

When(
    'school admin edits topic {string} avatar in a chapter',
    async function (this: IMasterWorld, uploadAvatar: WithOrWithout) {
        const name = `Topic edited ${genId()}`;
        const withIcon = uploadAvatar === 'with' ? true : false;

        const topic: TopicForm = {
            name,
            icon: withIcon,
        };

        await this.cms.instruction(
            `school admin will edit with name ${name} and ${uploadAvatar} upload icon`,
            async () => {
                await schoolAdminFillTopicForm(this.cms, topic);
                await schoolAdminSubmitTopicForm(this.cms);
            }
        );

        await schoolAdminWaitingTopicDialogHidden(this.cms);

        this.scenario.set(aliasTopicFormData, topic);
    }
);

Then('school admin sees the edited topic in book', async function (this: IMasterWorld) {
    const topic = this.scenario.get<TopicForm>(aliasTopicFormData);

    await this.cms.instruction(
        `school admin see topic name updated to ${topic.name} and ${
            topic.icon ? 'image' : 'default'
        } icon`,
        async () => {
            await schoolAdminSeeTopic(this.cms, topic);
        }
    );
});

When(
    'school admin edits topic with missing {string}',
    async function (this: IMasterWorld, _missingField: 'name') {
        await this.cms.instruction('school admin edit topic name to empty string', async () => {
            await schoolAdminFillTopicForm(this.cms, {
                name: '',
            });
        });

        await schoolAdminSubmitTopicForm(this.cms);
    }
);

Then('school admin cannot edit topic', async function (this: IMasterWorld) {
    await this.cms.instruction(
        'school admin still sees edit topic dialog with error message',
        async () => {
            await schoolAdminSeesErrorMessageField(this.cms, {
                wrapper: topicFormRoot,
            });
        }
    );
});
