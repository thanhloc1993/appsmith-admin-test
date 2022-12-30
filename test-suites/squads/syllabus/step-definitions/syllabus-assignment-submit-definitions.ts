import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    aliasAssignmentFiles,
    aliasAssignmentTextNoteSubmission,
    aliasTaskAssignmentTextNote,
} from './alias-keys/syllabus';
import { AttachmentType } from './syllabus-assignment-submit-steps';
import { waitForLoadingAbsent } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

export async function studentGoToAssignmentInBook(
    learner: LearnerInterface,
    topicName: string,
    assignmentName: string
) {
    const listKey = new ByValueKey(SyllabusLearnerKeys.lo_list_screen(topicName));
    const itemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(assignmentName));
    await learner.flutterDriver!.waitFor(listKey);
    await learner.flutterDriver!.scrollUntilVisible(listKey, itemKey, 0.0, 0.0, -100, 20000);
    await learner.flutterDriver!.tap(itemKey);
}

export async function studentGoToAssignmentInTodo(
    learner: LearnerInterface,
    assignmentName: string
) {
    const listKey = new ByValueKey(SyllabusLearnerKeys.completed_page);
    const itemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(assignmentName));
    await learner.flutterDriver!.waitFor(listKey, 10000);
    await learner.flutterDriver!.scrollUntilVisible(listKey, itemKey, 0.0, 0.0, -100, 20000);
    await learner.flutterDriver!.tap(itemKey);
}

export async function studentSubmitAssignment(learner: LearnerInterface) {
    const submitButton = new ByValueKey(SyllabusLearnerKeys.submit_button);
    const confirmButton = new ByValueKey(SyllabusLearnerKeys.confirm_button);
    await learner.flutterDriver!.waitFor(submitButton);
    await learner.flutterDriver!.tap(submitButton);
    await learner.flutterDriver!.waitFor(confirmButton);
    await learner.flutterDriver!.tap(confirmButton);
}

export async function studentBackToHomeAfterSubmit(learner: LearnerInterface, topicName: string) {
    const assignmentCompletedPage = new ByValueKey(SyllabusLearnerKeys.assignment_completed_screen);
    const learningFinishedTopicScreen = new ByValueKey(
        SyllabusLearnerKeys.learning_finished_topic_screen(topicName)
    );
    const loListScreen = new ByValueKey(SyllabusLearnerKeys.lo_list_screen(topicName));
    const bookDetailScreen = new ByValueKey(SyllabusLearnerKeys.book_detail_screen);
    const homeScreen = new ByValueKey(SyllabusLearnerKeys.homeScreen);
    const nextButton = new ByValueKey(SyllabusLearnerKeys.next_button);
    const backToListButton = new ByValueKey(SyllabusLearnerKeys.back_to_list_text);
    const backButton = new ByValueKey(SyllabusLearnerKeys.back_button);

    await learner.instruction(
        `At Assignment Completed screen, tap next button`,
        async function (this: LearnerInterface) {
            await waitForLoadingAbsent(learner.flutterDriver!, 20000);
            await learner.flutterDriver!.waitFor(assignmentCompletedPage);
            await learner.flutterDriver!.waitFor(nextButton);
            await learner.flutterDriver!.tap(nextButton);
        }
    );

    await learner.instruction(
        `At Learning Finished Topic Screen, tap back to list button`,
        async function (this: LearnerInterface) {
            await learner.flutterDriver!.waitFor(learningFinishedTopicScreen);
            await learner.flutterDriver!.waitFor(backToListButton);
            await learner.flutterDriver!.tap(backToListButton);
        }
    );

    await learner.instruction(
        `At Lo List Screen, tap back button`,
        async function (this: LearnerInterface) {
            await learner.flutterDriver!.waitFor(loListScreen);
            await learner.flutterDriver!.waitFor(backButton);
            await learner.flutterDriver!.tap(backButton);
        }
    );

    await learner.instruction(
        `At Book Detail Screen, tap back button, go to home screen`,
        async function (this: LearnerInterface) {
            await learner.flutterDriver!.waitFor(bookDetailScreen);
            await learner.flutterDriver!.waitFor(backButton);
            await learner.flutterDriver!.tap(backButton);
            await learner.flutterDriver!.waitFor(homeScreen);
        }
    );
}

export async function studentHasNotSubmittedAssignmentBefore(learner: LearnerInterface) {
    try {
        await learner.flutterDriver!.waitForAbsent(
            new ByValueKey(SyllabusLearnerKeys.submitted_assignment)
        );
    } catch (e) {
        throw Error('Expect assignment has not been submitted yet');
    }
}

export async function studentCanNotSubmitAssignment(learner: LearnerInterface) {
    try {
        await learner.flutterDriver!.waitForAbsent(
            new ByValueKey(SyllabusLearnerKeys.submit_button)
        );
    } catch (e) {
        throw Error('Submit Button must can not submit');
    }
}

export async function studentCanSubmitAssignment(learner: LearnerInterface) {
    try {
        await learner.flutterDriver!.waitFor(new ByValueKey(SyllabusLearnerKeys.submit_button));
    } catch (e) {
        throw Error('Submit Button must can submit');
    }
}

export const teacherSeeAssignmentNotMarked = async (
    teacher: TeacherInterface,
    assignmentName: string
) => {
    const studentAssignmentNotMarked = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanItemStatusNotMarked(assignmentName)
    );

    try {
        await teacher.flutterDriver!.waitFor(studentAssignmentNotMarked);
    } catch (e) {
        throw Error('"Student Study Plan Item Status Not Marked" not displayed');
    }
};

export const teacherCheckAssignmentNotMarked = async (
    teacher: TeacherInterface,
    assignmentName: string
) => {
    const studentAssignmentNotMarked = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanItemStatusNotMarked(assignmentName)
    );
    const submissionDetailsScreen = new ByValueKey(SyllabusTeacherKeys.submissionDetailsScreen);

    const saveChangesButton = new ByValueKey(SyllabusTeacherKeys.saveChangesButton);

    const studyPlanListKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanScrollView);

    try {
        await teacher.flutterDriver!.waitFor(studyPlanListKey);

        await teacher.flutterDriver!.scrollUntilTap(
            studyPlanListKey,
            studentAssignmentNotMarked,
            0.0,
            -300,
            10000
        );
    } catch (error) {
        throw Error(`Expect can tap item ${assignmentName}`);
    }

    await teacher.flutterDriver!.waitFor(submissionDetailsScreen);

    try {
        await teacher.flutterDriver!.waitFor(saveChangesButton);
    } catch (e) {
        throw Error('"Save Changes Button" is not enable');
    }
};

export async function studentFillTextNoteAssignment(
    learner: LearnerInterface,
    context: ScenarioContext
) {
    const loadingDialog = new ByValueKey(SyllabusLearnerKeys.loading_dialog);
    await learner.flutterDriver!.waitForAbsent(loadingDialog);

    const assignmentNote = new ByValueKey(SyllabusLearnerKeys.assignment_note_field);
    const assignmentScrollview = new ByValueKey(SyllabusLearnerKeys.assignment_scrollview);
    await learner.flutterDriver!.scrollUntilVisible(
        assignmentScrollview,
        assignmentNote,
        0.0,
        0.0,
        -300.0
    );
    await learner.flutterDriver!.waitFor(assignmentNote);
    await learner.flutterDriver!.tap(assignmentNote);
    await learner.flutterDriver!.enterText(aliasAssignmentTextNoteSubmission);
    context.set(aliasTaskAssignmentTextNote, aliasAssignmentTextNoteSubmission);
}

export async function studentGoToRecordAssignment(learner: LearnerInterface) {
    const loadingDialog = new ByValueKey(SyllabusLearnerKeys.loading_dialog);
    await learner.flutterDriver!.waitForAbsent(loadingDialog);
    await learner.flutterDriver!.tap(
        new ByValueKey(SyllabusLearnerKeys.assignment_teacher_attachment_title(0))
    );
}

export const teacherCheckAssignmentTextNote = async (teacher: TeacherInterface) => {
    const assignmentNote = new ByValueKey(
        SyllabusTeacherKeys.assignmentStudentNoteTextField(aliasAssignmentTextNoteSubmission)
    );
    try {
        await teacher.flutterDriver!.waitFor(assignmentNote);
    } catch (e) {
        throw Error('"Assignment Note" is not visible');
    }
};

export async function studentAddAttachmentToAssignment(
    learner: LearnerInterface,
    context: ScenarioContext,
    attachmentType: AttachmentType
) {
    const loadingDialog = new ByValueKey(SyllabusLearnerKeys.loading_dialog);
    await learner.flutterDriver!.waitForAbsent(loadingDialog);
    const attachAttachmentButton = new ByValueKey(SyllabusLearnerKeys.attach_attachment_button);
    await learner.flutterDriver!.waitFor(attachAttachmentButton);
    await learner.prepareUploadAttachmentType(attachmentType);
    await learner.flutterDriver!.tap(attachAttachmentButton);
    const attachmentLoading = new ByValueKey(SyllabusLearnerKeys.attachment_loading);
    try {
        await learner.flutterDriver!.waitFor(attachmentLoading, 2000);
    } catch {
        console.log('Not found attachmentLoading: continue running');
    }
    await learner.flutterDriver!.waitForAbsent(attachmentLoading, 60000);
    const uploadedAttachmentName = await learner.flutterDriver!.getText(
        new ByValueKey(SyllabusLearnerKeys.assignment_submitted_attachment_title(0))
    );
    context.set(aliasAssignmentFiles, [uploadedAttachmentName]);
}

export const teacherCheckAssignmentAttachments = async (
    teacher: TeacherInterface,
    attachmentFileName: string
) => {
    await teacher.flutterDriver!.waitFor(new ByValueKey(attachmentFileName));
};

export const teacherTapAssignmentAttachments = async (
    teacher: TeacherInterface,
    attachmentFileName: string
) => {
    await teacher.flutterDriver!.tap(new ByValueKey(attachmentFileName));
};

export const teacherSeeVideoAssignmentAttachments = async (teacher: TeacherInterface) => {
    await teacher.flutterDriver!.waitFor(new ByValueKey(SyllabusTeacherKeys.videoView));
};

export async function studentRecordVideoAssignment(
    learner: LearnerInterface,
    context: ScenarioContext
) {
    await learner.instruction(`Go to record screen`, async function (learner: LearnerInterface) {
        await studentGoToRecordAssignment(learner);
    });

    await learner.instruction(`Play record video`, async function (learner: LearnerInterface) {
        await learner.flutterDriver!.tap(new ByValueKey(SyllabusLearnerKeys.start_record_button));
        try {
            await learner.flutterDriver!.waitFor(
                new ByValueKey(SyllabusLearnerKeys.stop_record_button),
                2000
            );
        } catch {
            console.log('Stop Record Button already disappear');
        }
        try {
            await learner.flutterDriver!.waitForAbsent(
                new ByValueKey(SyllabusLearnerKeys.stop_record_button)
            );
        } catch {
            console.log('Stop Record Button reach limit 5 second not stopping');
            await learner.flutterDriver!.tap(
                new ByValueKey(SyllabusLearnerKeys.stop_record_button)
            );
        }
    });

    await learner.instruction(
        `Go to review screen, attach record to assignment`,
        async function (learner: LearnerInterface) {
            await learner.flutterDriver!.waitFor(
                new ByValueKey(SyllabusLearnerKeys.record_assignment_review_screen)
            );
            await learner.flutterDriver!.tap(
                new ByValueKey(SyllabusLearnerKeys.attach_answer_button)
            );
        }
    );

    await learner.instruction(
        `Back to assignment screen, waiting upload`,
        async function (learner: LearnerInterface) {
            const attachmentLoading = new ByValueKey(SyllabusLearnerKeys.attachment_loading);
            try {
                await learner.flutterDriver!.waitFor(attachmentLoading, 2000);
            } catch {
                console.log('Not found attachmentLoading: continue running');
            }
            await learner.flutterDriver!.waitForAbsent(attachmentLoading, 60000);
            const uploadedAttachmentName = await learner.flutterDriver!.getText(
                new ByValueKey(SyllabusLearnerKeys.assignment_submitted_attachment_title(0))
            );
            context.set(aliasAssignmentFiles, [uploadedAttachmentName]);
        }
    );
}
