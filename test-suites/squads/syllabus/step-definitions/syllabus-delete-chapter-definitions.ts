import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasChapterNames } from './alias-keys/syllabus';
import { chapterItem, deleteOption } from './cms-selectors/cms-keys';
import { studentSeeAllChaptersInCourse } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

export async function schoolAdminConfirmsDeleteChapter(cms: CMSInterface): Promise<void> {
    await cms.selectAButtonByAriaLabel('Confirm');
}

export async function schoolAdminChoosesDeleteChapter(cms: CMSInterface): Promise<void> {
    await cms.page!.waitForSelector(deleteOption);
    await cms.selectAButtonByAriaLabel('Delete');
}

export async function schoolAdminDoesNotSeeChapter(cms: CMSInterface, chapterName: string) {
    await cms.page!.waitForSelector(chapterItem(chapterName), {
        state: 'detached',
    });
}

export async function studentDoesNotSeeDeletedChapterOnCourse(
    learner: LearnerInterface,
    context: ScenarioContext,
    deletedChapterName: string
) {
    const chapterNames = context.get<string[]>(aliasChapterNames);

    await studentSeeAllChaptersInCourse(learner, chapterNames);

    const deletedChapterKey = new ByValueKey(SyllabusLearnerKeys.chapter(deletedChapterName));

    await learner.flutterDriver?.waitForAbsent(deletedChapterKey);
}
