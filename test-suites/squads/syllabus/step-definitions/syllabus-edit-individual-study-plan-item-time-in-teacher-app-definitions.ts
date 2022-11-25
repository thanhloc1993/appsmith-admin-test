import { randomInteger } from '@legacy-step-definitions/utils';

import { LearnerInterface, LOType } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    aliasAssignmentName,
    aliasLOName,
    aliasStudyPlanItemName,
    aliasStudyPlanItemType,
} from './alias-keys/syllabus';
import { ByValueKey } from 'flutter-driver-x';

export async function studentSeesEditedDueDateOfLOOnTodoScreen(
    studyPlanItemDueDateKey: ByValueKey,
    learner: LearnerInterface
) {
    await learner.flutterDriver!.scrollIntoView(studyPlanItemDueDateKey, 0.0, 20000);
}
export async function aRandomStudyPlanItem(context: ScenarioContext): Promise<string> {
    const studyPlanItemTypesList: LOType[] = ['assignment', 'learning objective', 'flashcard'];
    const randomIndex = randomInteger(0, studyPlanItemTypesList.length - 1);
    const studyPlanItemType = studyPlanItemTypesList[randomIndex];
    await context.set(aliasStudyPlanItemType, studyPlanItemType);
    let studyPlanItemAlias: string;

    switch (studyPlanItemType) {
        case 'assignment':
            studyPlanItemAlias = aliasAssignmentName;
            break;
        case 'learning objective':
            studyPlanItemAlias = aliasLOName;
            break;
        default:
            studyPlanItemAlias = aliasLOName;
            break;
    }

    const studyPlanItemName = context.get<string>(studyPlanItemAlias);
    context.set(aliasStudyPlanItemName, studyPlanItemName);
    return studyPlanItemName;
}
