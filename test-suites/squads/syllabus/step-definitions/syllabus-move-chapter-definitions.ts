import { canMoveItem } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { MoveDirection } from '@supports/types/cms-types';

import {
    chapterItem,
    chapterItemMoveDownButton,
    chapterItemMoveUpButton,
    chapterItemName,
} from './cms-selectors/cms-keys';
import { schoolAdminEnableRemoveBookChapter } from './syllabus-migration-temp';
import { ByValueKey } from 'flutter-driver-x';

export const schoolAdminMovesChapter = async (
    cms: CMSInterface,
    chapterName: string,
    direction: MoveDirection
) => {
    const moveButtonSelector =
        direction === 'up' ? chapterItemMoveUpButton : chapterItemMoveDownButton;
    const chapterToBeMoved = await cms.page!.waitForSelector(chapterItem(chapterName));
    const moveButton = await chapterToBeMoved.waitForSelector(moveButtonSelector);

    await moveButton.click();

    const shouldQueryWithoutBookChapter = await schoolAdminEnableRemoveBookChapter();
    await cms.waitForHasuraResponse(
        shouldQueryWithoutBookChapter ? 'Syllabus_ChapterGetManyByBookId' : 'ChaptersMany'
    );
};

const getOnScreenChapterNames = async (cms: CMSInterface) => {
    await cms.page!.waitForSelector(chapterItemName);

    const chapterListItems = await cms.page!.$$(chapterItemName);
    const chapterNames = await Promise.all(chapterListItems.map((item) => item.textContent()));

    return chapterNames.map((chapterName) => chapterName!);
};

export const schoolAdminSeeChapterAtIndexInBookDetail = async (
    cms: CMSInterface,
    chapter: { name: string; index: number }
) => {
    const { name, index } = chapter;
    const onScreenChapterNames = await getOnScreenChapterNames(cms);
    const chapterNameAtIndex = onScreenChapterNames[index];

    weExpect(chapterNameAtIndex, `the chapter is at index ${index}`).toEqual(name);
};

export const studentSeeChapterAtIndexInCourseDetail = async (
    learner: LearnerInterface,
    chapter: { name: string; index: number }
) => {
    const { name, index } = chapter;
    const chapterWithPositionFinder = new ByValueKey(
        SyllabusLearnerKeys.chapterWithPosition(index, name)
    );

    await learner.flutterDriver?.waitFor(chapterWithPositionFinder);
};

export const getChapterWillBeMove = async (cms: CMSInterface, direction: MoveDirection) => {
    const list = await getOnScreenChapterNames(cms);

    if (!list) throw Error('Chapter list is not found');

    const size = list.length;
    let moveIndex: number | null = null;

    for (let i = 0; i < size; i++) {
        if (canMoveItem(direction, i, size)) {
            moveIndex = i;
            break;
        }
    }

    if (moveIndex === null) throw new Error(`Chapter index is invalid to move`);

    const name = list[moveIndex];

    return { moveIndex, name };
};
