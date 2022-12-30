import { canMoveItem } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { MoveDirection } from '@supports/types/cms-types';

import { aliasRandomChapters, aliasRandomTopics, aliasTopicName } from './alias-keys/syllabus';
import {
    topicItem,
    topicItemMoveDownButton,
    topicItemMoveUpButton,
    topicItemName,
} from './cms-selectors/cms-keys';
import { ByValueKey } from 'flutter-driver-x';
import { Chapter, Topic } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export const getOnScreenTopicNames = async (cms: CMSInterface) => {
    await cms.page!.waitForSelector(topicItemName);

    const topicListItems = await cms.page!.$$(topicItemName);
    const topicNames = await Promise.all(topicListItems.map((item) => item.textContent()));

    return topicNames.map((topicName) => topicName!);
};

export const schoolAdminGetTopicWillBeMove = async (
    cms: CMSInterface,
    direction: MoveDirection
) => {
    const list = await getOnScreenTopicNames(cms);

    if (!list) throw Error('Topic list is not found');

    const size = list.length;
    let moveIndex: number | null = null;

    for (let i = 0; i < size; i++) {
        if (canMoveItem(direction, i, size)) {
            moveIndex = i;
            break;
        }
    }

    if (moveIndex === null) throw new Error(`Topic index is invalid to move`);

    const name = list[moveIndex];

    return { moveIndex, name };
};

export const schoolAdminSeeTopicAtIndexInBookDetail = async (
    cms: CMSInterface,
    topicName: string,
    index: number
) => {
    const topicList = await cms.page!.$$(topicItemName);

    const topicNameAtIndex = await topicList[index].textContent();

    weExpect(topicNameAtIndex, `The topic at index ${index}`).toEqual(topicName);
};

export const schoolAdminMovesTopic = async (
    cms: CMSInterface,
    topicName: string,
    direction: MoveDirection
) => {
    const moveButtonSelector = direction === 'up' ? topicItemMoveUpButton : topicItemMoveDownButton;
    const topicToBeMoved = await cms.page!.waitForSelector(topicItem(topicName));
    const moveButton = await topicToBeMoved.waitForSelector(moveButtonSelector);

    await moveButton.click();
    await cms.waitForHasuraResponse('TopicsMany');
};

export const studentAssertsTopicPositionAfterMove = async (
    learner: LearnerInterface,
    context: ScenarioContext,
    direction: MoveDirection
) => {
    const { info: chapterInfo } = context.get<Chapter[]>(aliasRandomChapters)[0];

    const createdChapterId = chapterInfo!.id;

    const createdTopics = context
        .get<Topic[]>(aliasRandomTopics)
        .filter((topic) => topic.chapterId === createdChapterId);

    const numOfCreatedTopics = createdTopics.length;
    let topicPosition = 0;
    if (direction === 'down') {
        topicPosition = numOfCreatedTopics - 1;
    }
    const movedTopicName = context.get<string>(aliasTopicName);
    const topicWithPositionFinder = new ByValueKey(
        SyllabusLearnerKeys.topicWithPosition(topicPosition, movedTopicName)
    );

    await learner.flutterDriver?.waitFor(topicWithPositionFinder);
};
