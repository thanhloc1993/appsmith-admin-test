import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasChapterName } from './alias-keys/syllabus';
import { chapterItem } from './cms-selectors/cms-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function schoolAdminSeeChapter(cms: CMSInterface, chapterName: string) {
    await cms.page!.waitForSelector(chapterItem(chapterName));
}

export async function studentDoesNotSeeNewChapter(
    learner: LearnerInterface,
    context: ScenarioContext
) {
    const chapterName = context.get<string>(aliasChapterName);

    try {
        await learner.flutterDriver!.waitForAbsent(
            new ByValueKey(SyllabusLearnerKeys.chapter(chapterName))
        );
    } catch (e) {
        throw Error(`New chapter can be seen on Learner App`);
    }
}
