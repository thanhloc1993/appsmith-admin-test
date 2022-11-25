import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { formatDate } from '@supports/utils/time/time';

import { aliasAssignmentName, aliasCourseName, aliasTopicName } from './alias-keys/syllabus';
import {
    studentBackToHomeAfterSubmit,
    studentGoToAssignmentInBook,
    studentSubmitAssignment,
} from './syllabus-assignment-submit-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
    studentTapButtonOnScreen,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

export async function studentSeeChangedTopDueDateOnAssignmentScreen(
    learner: LearnerInterface,
    endDate: string,
    timeline: string
) {
    await learner.instruction(`Student sees assignment top due date`, async function (learner) {
        const parsedEndDate = new Date(endDate);
        const currentYear = new Date().getFullYear();

        if (parsedEndDate.getFullYear() == currentYear) {
            endDate = formatDate(parsedEndDate, 'MM/DD, HH:mm');
        }

        const assignmentTopDate = new ByValueKey(SyllabusLearnerKeys.assignmentTopDate(endDate));
        const assignmentIsClosed = new ByValueKey(SyllabusLearnerKeys.assignmentIsClosed);

        await learner.flutterDriver?.waitFor(
            timeline == 'future' ? assignmentTopDate : assignmentIsClosed
        );
    });
}

export async function studentGoesBackToTodoPageFromAssignmentScreen(
    learner: LearnerInterface,
    assignmentName: string
) {
    await learner.instruction(`Student goes back to Todo Screen`, async function (learner) {
        const assignmentScreen = SyllabusLearnerKeys.assignment_screen([assignmentName]);
        const backButton = SyllabusLearnerKeys.back_button;
        await studentTapButtonOnScreen(learner, assignmentScreen, backButton);

        const todoScreen = new ByValueKey(SyllabusLearnerKeys.todos_page);
        await learner.flutterDriver?.waitFor(todoScreen);
    });
}

export async function studentGoesToAssignmentScreenFromHome(
    learner: LearnerInterface,
    assignmentName: string,
    courseName: string,
    topicName: string
) {
    await learner.instruction(
        `Student goes to Assignment Screen from Home`,
        async function (learner) {
            await studentRefreshHomeScreen(learner);
            await studentGoToCourseDetail(learner, courseName);
            await studentGoToTopicDetail(learner, topicName);
            await studentGoToAssignmentInBook(learner, topicName, assignmentName);
        }
    );
}

export async function studentSubmitsAssignmentAndGoesBackHome(
    learner: LearnerInterface,
    topicName: string
) {
    await learner.instruction(`Student submits assignment`, async function (learner) {
        await studentSubmitAssignment(learner);
    });

    await learner.instruction(
        `Student goes back to home after submitting`,
        async function (learner) {
            await studentBackToHomeAfterSubmit(learner, topicName);
        }
    );
}

export async function studentSubmitsAssignment(
    learner: LearnerInterface,
    context: ScenarioContext
) {
    const topicName = context.get<string>(aliasTopicName);
    const assignmentName = context.get<string>(aliasAssignmentName);
    const courseName = context.get<string>(aliasCourseName);

    await studentGoesToAssignmentScreenFromHome(learner, assignmentName, courseName, topicName);

    await studentSubmitsAssignmentAndGoesBackHome(learner, topicName);
}
