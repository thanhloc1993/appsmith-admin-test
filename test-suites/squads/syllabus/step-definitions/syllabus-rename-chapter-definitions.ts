import { genId } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { ActionOptions } from '@supports/types/cms-types';

import { aliasChapterName, aliasChapterNames } from './alias-keys/syllabus';
import { chapterItem } from './cms-selectors/cms-keys';
import { chapterFormSubmit } from './cms-selectors/syllabus';
import { schoolAdminFillChapterData } from './syllabus-content-book-create-definitions';
import { ByValueKey } from 'flutter-driver-x';

export async function schoolAdminEditsChapterName(
    cms: CMSInterface,
    context: ScenarioContext
): Promise<void> {
    if (!context.has(aliasChapterNames)) {
        return;
    }

    const chapters = context.get<string[]>(aliasChapterNames);
    const chapterName = context.get<string>(aliasChapterName);

    const newChapterName = `Chapter ${genId()}`;
    await schoolAdminFillChapterData(cms, newChapterName);
    await cms.page!.click(chapterFormSubmit);

    for (let i = 0; i < chapters.length; i++) {
        if (chapters[i] == chapterName) {
            chapters[i] = newChapterName as string;
        }
    }
    context.set(aliasChapterNames, chapters);
    context.set(aliasChapterName, newChapterName);

    await cms.page!.waitForSelector(chapterItem(newChapterName));
}

export async function schoolAdminClickChapterOption(
    cms: CMSInterface,
    chapterName: string,
    action: ActionOptions
) {
    await cms.selectActionButton(action, {
        target: 'actionPanelTrigger',
        wrapperSelector: chapterItem(chapterName),
    });
}

export async function schoolAdminSeesRenamedChapter(
    cms: CMSInterface,
    context: ScenarioContext
): Promise<void> {
    const chapterName = context.get<string>(aliasChapterName);
    if (!chapterName) {
        throw Error('Can not find the renamed chapter');
    }

    await cms.page!.waitForSelector(chapterItem(chapterName));
}

export async function studentSeesRenamedChapter(
    learner: LearnerInterface,
    context: ScenarioContext
) {
    const chapterName = context.get<string>(aliasChapterName);

    try {
        await learner.flutterDriver!.waitFor(
            new ByValueKey(SyllabusLearnerKeys.chapter(chapterName))
        );
    } catch (e) {
        throw Error(`Renamed chapter cannot be seen on Learner App`);
    }
}
