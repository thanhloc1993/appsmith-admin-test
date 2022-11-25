import { WithOrWithout } from '@legacy-step-definitions/types/common';
import { genId } from '@legacy-step-definitions/utils';

import { Given, When, Then } from '@cucumber/cucumber';

import {
    CMSInterface,
    IMasterWorld,
    LearnerInterface,
    TeacherInterface,
} from '@supports/app-types';

import {
    aliasChapterName,
    aliasCourseName,
    aliasTopicFormData,
    aliasTopicName,
} from './alias-keys/syllabus';
import { dialogWithHeaderFooter } from './cms-selectors/cms-keys';
import {
    schoolAdminIsOnBookDetailsPage,
    schoolAdminCreateATopic,
} from './syllabus-content-book-create-definitions';
import {
    studentDoesNotSeeNewTopic,
    schoolAdminSeeTopic,
    schoolAdminSeeTopicByName,
} from './syllabus-create-topic-definitions';
import {
    schoolAdminSeesErrorMessageField,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
} from './syllabus-utils';
import { TopicForm } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

Given(`school admin is at book detail page`, async function (this: IMasterWorld): Promise<void> {
    const context = this.scenario;

    await this.cms.instruction(
        `go to book details just created`,
        async function (this: CMSInterface) {
            await schoolAdminIsOnBookDetailsPage(this, context);
        }
    );
});

When(
    'school admin creates a topic {string} avatar in a chapter',
    async function (this: IMasterWorld, action: WithOrWithout) {
        const chapterName = this.scenario.get(aliasChapterName);

        const name = `Topic name ${genId()}`;
        const withIcon = action === 'with' ? true : false;

        const topic: TopicForm = {
            name,
            icon: withIcon,
        };
        await this.cms.instruction(
            `school admin will create a topic with name ${name} and ${action} upload icon`,
            async () => {
                await schoolAdminCreateATopic(this.cms, chapterName, topic);
            }
        );

        this.scenario.set(aliasTopicFormData, topic);
    }
);

Then('school admin sees a new topic in chapter', async function (this: IMasterWorld) {
    const topic = this.scenario.get<TopicForm>(aliasTopicFormData);
    await this.cms.instruction(
        `school see topic ${topic.name} with ${topic.icon ? 'image icon' : 'default icon'}`,
        async () => {
            await schoolAdminSeeTopic(this.cms, topic);
        }
    );
});

When(`school admin creates a new topic in an exist chapter`, async function (this: IMasterWorld) {
    const chapterName = this.scenario.get<string>(aliasChapterName);

    await this.cms.instruction(`school admin creates a new topic in chapter`, async () => {
        const name = `Topic name ${genId()}`;
        await schoolAdminCreateATopic(this.cms, chapterName, {
            name,
        });

        this.scenario.set(aliasTopicName, name);
    });
});

Then(`school admin sees the new topic on CMS`, async function (this: IMasterWorld): Promise<void> {
    const topicName = this.scenario.get(aliasTopicName);

    await this.cms.instruction(`school admin sees the new topic on CMS`, async () => {
        await schoolAdminSeeTopicByName(this.cms, topicName);
    });
});

When(
    'school admin creates a topic with missing {string} in a chapter',
    async function (this: IMasterWorld, missingField: string) {
        const chapterName = this.scenario.get<string>(aliasChapterName);
        await this.cms.instruction(
            `school admin creates a new topic missing ${missingField}`,
            async () => {
                await schoolAdminCreateATopic(this.cms, chapterName, {
                    name: '',
                });
            }
        );
    }
);

Then('user cannot create any topic', async function (this: IMasterWorld) {
    await this.cms.instruction(
        'school admin still see dialog add topic form with error message',
        async () => {
            await schoolAdminSeesErrorMessageField(this.cms, {
                wrapper: dialogWithHeaderFooter,
            });
        }
    );
});

Then(
    `student does not see the new topic on Learner App`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;

        await this.learner.instruction(
            `student refresh course list and go to course details page`,
            async function (this: LearnerInterface) {
                const courseName = context.get<string>(aliasCourseName);
                await studentRefreshHomeScreen(this);
                await studentGoToCourseDetail(this, courseName);
            }
        );

        await this.learner.instruction(
            `student does not see the new topic on Learner App`,
            async function (this: LearnerInterface) {
                await studentDoesNotSeeNewTopic(this, context);
            }
        );
    }
);

Then(
    `teacher does not see the new topic on Teacher App`,
    async function (this: IMasterWorld): Promise<void> {
        await this.teacher.instruction(
            `teacher does not see the new topic on Teacher App`,
            async function (this: TeacherInterface) {
                console.log(`There is no book flow on teacher`);
            }
        );
    }
);
