import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export const syllabusExamLOInstruction = 'Syllabus_ExamLO_ExamLOInstruction';

export async function studentStartExamLOFromInstructionScreen(
    learner: LearnerInterface
): Promise<void> {
    const isEnableExamLOInstruction = await featureFlagsHelper.isEnabled(syllabusExamLOInstruction);

    if (isEnableExamLOInstruction) {
        const driver = learner.flutterDriver!;

        await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.examLOInstructionScreen));
        await driver.tap(new ByValueKey(SyllabusLearnerKeys.startExamLOButton));
    }
}
