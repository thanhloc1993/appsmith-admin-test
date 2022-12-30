import { Given } from '@cucumber/cucumber';

import { aliasCourseName, aliasTopicName } from './alias-keys/syllabus';
import { studentWaitingSelectChapterWithBookScreenLoaded } from './syllabus-add-book-to-course-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { studentGoToCourseDetail, studentRefreshHomeScreen } from './syllabus-utils';

Given(`student goes to Topic Detail screen`, async function (): Promise<void> {
    const context = this.scenario;
    const courseName = context.get<string>(aliasCourseName);
    const topicName = context.get<string>(aliasTopicName);

    await this.learner.instruction('Refresh learner app', async () => {
        await studentRefreshHomeScreen(this.learner);
    });

    await this.learner.instruction(`Student go to the course: ${courseName}`, async () => {
        await studentGoToCourseDetail(this.learner, courseName);
        await studentWaitingSelectChapterWithBookScreenLoaded(this.learner);
    });

    await this.learner.instruction(`Student go to the topic: ${topicName}`, async () => {
        await studentGoToTopicDetail(this.learner, topicName);
    });
});
