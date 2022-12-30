import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    aliasCourseName,
    aliasGradeBookAttemptByLearningMaterialId,
    aliasGradeBookCompletedRate,
    aliasGradeBookLatestScoreByLearningMaterialId,
    aliasGradeBookPassedRate,
    aliasRandomStudyPlanItems,
    aliasStudyPlanName,
} from './alias-keys/syllabus';
import { StudyPlanItem } from './cms-models/content';
import {
    gradeBookNoDataMessage,
    gradeBookSearchInput,
    gradeBookTableCompleted,
    gradeBookTablePassed,
    gradeBookTableScore,
} from './cms-selectors/grade-book';
import { ByValueKey } from 'flutter-driver-x';

export const schoolAdminSearchStudentByName = async (cms: CMSInterface, studentName: string) => {
    // search by exact student name to check grade book
    await cms.instruction('school admin search student by name', async () => {
        // test uses email as name
        const inputField = await cms.page?.waitForSelector(gradeBookSearchInput);

        if (!inputField) {
            const errMsg = `Can't get search input selector`;
            throw Error(errMsg);
        }

        await inputField.type(studentName);
        await inputField.press('Enter');

        await cms.waitForSkeletonLoading();
    });
};

export const schoolAdminSeesEmptyGradeBook = async (cms: CMSInterface) => {
    const noDataMessage = await cms.page?.waitForSelector(gradeBookNoDataMessage);
    const message = await noDataMessage?.textContent();

    weExpect(message).toBe('No Information');
};

/**
 * schoolAdminSeesGradeBookHasCorrectFormats
 * this feature check how data visible in UI, use selector to match equal result
 */
export const schoolAdminSeesGradeBookHasCorrectFormats = async (cms: CMSInterface) => {
    await cms.instruction('school admin sees data have correct formats', async () => {
        const completedRate = await cms.page?.waitForSelector(gradeBookTableCompleted);
        const completedRateContent = await completedRate?.textContent();
        weExpect(completedRateContent).toBe('3/4');

        const passedRate = await cms.page?.waitForSelector(gradeBookTablePassed);
        const passedRateContent = await passedRate?.textContent();
        weExpect(passedRateContent).toBe('1/4');

        const scoreRates = await cms.page?.$$(gradeBookTableScore);

        if (!scoreRates) throw new Error('No score rate found');

        const firstScore = await scoreRates[0].textContent();
        weExpect(firstScore).toBe('3/3 (2)');

        const secondScore = await scoreRates[1].textContent();
        weExpect(secondScore).toBe('1/3');

        const thirdScore = await scoreRates[2].textContent();
        weExpect(thirdScore).toBe('2/3');

        const fourthScore = await scoreRates[3].textContent();
        weExpect(fourthScore).toBe('--');
    });
};

export const studentSeesGradeBookHasCorrectFormats = async (
    learner: LearnerInterface,
    scenarioContext: ScenarioContext
) => {
    await learner.instruction('student sees data have correct formats', async () => {
        const driver = learner.flutterDriver!;

        const studyPlanName = scenarioContext.get<string>(aliasStudyPlanName);
        await driver.waitFor(
            new ByValueKey(SyllabusLearnerKeys.gradeBookStudyPlanName(studyPlanName))
        );

        const courseName = scenarioContext.get<string>(aliasCourseName);
        await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.gradeBookCourseName(courseName)));

        const completedExams = scenarioContext.get<string>(aliasGradeBookCompletedRate);
        const passedExams = scenarioContext.get<string>(aliasGradeBookPassedRate);

        const LOExams = scenarioContext.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);

        await driver.waitFor(
            new ByValueKey(
                SyllabusLearnerKeys.gradeBookPassedRateByStudyPlanName(
                    studyPlanName,
                    `${passedExams}/${LOExams.length}`
                )
            )
        );

        await driver.waitFor(
            new ByValueKey(
                SyllabusLearnerKeys.gradeBookCompletedRateByStudyplanName(
                    studyPlanName,
                    `${completedExams}/${LOExams.length}`
                )
            )
        );

        for (let i = 0; i < LOExams.length - 1; i++) {
            const exam = LOExams[i];
            const examId = exam.learningMaterialId;

            const scoreByLearningMaterialId = scenarioContext.get<string>(
                aliasGradeBookLatestScoreByLearningMaterialId(examId)
            );

            const attemptsByLearningMaterialId =
                scenarioContext.get<number>(aliasGradeBookAttemptByLearningMaterialId(examId)) ?? 0;

            if (attemptsByLearningMaterialId > 0) {
                await driver.waitFor(
                    new ByValueKey(
                        SyllabusLearnerKeys.gradeBookScoreAndAttemptByLearningMaterialId(
                            examId,
                            scoreByLearningMaterialId,
                            `(${attemptsByLearningMaterialId})`
                        )
                    )
                );
            } else {
                await driver.waitFor(
                    new ByValueKey(
                        SyllabusLearnerKeys.gradeBookEmptyScoreByLearningMaterialId(examId)
                    )
                );
            }
        }
    });
};
