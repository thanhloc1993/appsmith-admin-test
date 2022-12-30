import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';

import { studentSubmitAssignment } from './syllabus-assignment-submit-definitions';
import { studentGoToStudyPlanItemDetail, studentTapButtonOnScreen } from './syllabus-utils';

export async function studentResubmitAssignmentByTimes(
    learner: LearnerInterface,
    {
        topicName,
        assignmentName,
        resubmittedTimes = 1,
    }: { topicName: string; assignmentName: string; resubmittedTimes?: number }
) {
    const assignmentCompletedPage = SyllabusLearnerKeys.assignment_completed_screen;
    const learningFinishedTopicScreen =
        SyllabusLearnerKeys.learning_finished_topic_screen(topicName);
    const nextButton = SyllabusLearnerKeys.next_button;
    const backToListButton = SyllabusLearnerKeys.back_to_list_text;

    for (let i = 0; i <= resubmittedTimes; i++) {
        await studentGoToStudyPlanItemDetail(learner, topicName, assignmentName);

        await studentSubmitAssignment(learner);

        await studentTapButtonOnScreen(learner, assignmentCompletedPage, nextButton);
        await studentTapButtonOnScreen(learner, learningFinishedTopicScreen, backToListButton);
    }
}
