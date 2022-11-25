import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasTopicName } from './alias-keys/syllabus';
import { topicItem } from './cms-selectors/cms-keys';
import { studentSeeChapterList } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import { TopicForm } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export async function schoolAdminSeeTopicByName(cms: CMSInterface, topicName: string) {
    await cms.page!.waitForSelector(topicItem(topicName));
}

export const schoolAdminGetTopicIcon = async (cms: CMSInterface, topicName: string) => {
    const element = await cms.page?.waitForSelector(`img:left-of(:has-text("${topicName}"))`);

    return element;
};

export const schoolAdminSeeTopic = async (cms: CMSInterface, topic: TopicForm) => {
    const { name, icon } = topic;
    await schoolAdminSeeTopicByName(cms, name);
    if (icon) {
        const iconElement = await schoolAdminGetTopicIcon(cms, name);
        if (!iconElement) throw new Error('Cannot find icon of topic');

        const src = await iconElement.getAttribute('src');

        weExpect(
            src,
            `Topic ${name} should have the image and image url to match (http/s)`
        ).toMatch(new RegExp(/https?:/, 'g'));
    }
};

export async function studentDoesNotSeeNewTopic(
    learner: LearnerInterface,
    context: ScenarioContext
) {
    const topicName = context.get<string>(aliasTopicName);

    try {
        await learner.flutterDriver!.waitForAbsent(
            new ByValueKey(SyllabusLearnerKeys.topic(topicName))
        );
    } catch (e) {
        throw Error(`New topic can be seen on Learner App`);
    }
}

export async function studentGoToTopicDetail(learner: LearnerInterface, topicName: string) {
    const listKey = new ByValueKey(SyllabusLearnerKeys.chapter_with_topic_list);
    const itemKey = new ByValueKey(SyllabusLearnerKeys.topic(topicName));
    await studentSeeChapterList(learner);
    await learner.flutterDriver!.scrollUntilTap(listKey, itemKey, 0.0, -300, 10000);
}
