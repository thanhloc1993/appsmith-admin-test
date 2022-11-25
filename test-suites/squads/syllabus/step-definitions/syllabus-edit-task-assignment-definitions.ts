import { asyncForEach, delay } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { CMSInterface, LearnerInterface, TeacherInterface } from '@supports/app-types';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder/grpc-message-decoder';
import { getBrightcoveVideoInfoEndpoint } from '@supports/services/grpc/constants';
import { ActionOptions, FileTypes } from '@supports/types/cms-types';

import { assignmentBrightcoveUploadInput } from './cms-selectors/cms-keys';
import {
    TaskAssignmentInfo,
    TaskAssignmentValue,
} from './syllabus-create-task-assignment-definitions';
import { schoolAdminGetABrightCoveVideo } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import { GetBrightCoveVideoInfoResponse } from 'manabuf/yasuo/v1/brightcove_pb';

export async function schoolAdminSelectEditTaskAssignment(cms: CMSInterface) {
    await cms.selectActionButton(ActionOptions.EDIT, { target: 'actionPanelTrigger' });
}

export async function schoolAdminUpdateTaskAssignmentValue(
    cms: CMSInterface,
    field: 'name' | 'instruction',
    newValue: string
) {
    await cms.instruction(
        `School admin input new task assignment ${field} ${newValue} and save to update`,
        async () => {
            await cms.page!.fill(`#${field}`, newValue);
            await schoolAdminSaveChangesTaskAssignment(cms);
        }
    );
}

export async function schoolAdminUploadTaskAssignmentAttachments(
    cms: CMSInterface,
    files: string[]
) {
    await cms.instruction('School admin upload task assignment attachments', async () => {
        const filePaths: string[] = files.map((file) => `./assets/${file}`);

        // Upload files
        await cms.page!.setInputFiles(`input[accept="${FileTypes.ALL}"]`, filePaths);

        // Upload brightcove link
        const videoBrightcoveName = await schoolAdminUploadTaskAssignmentBrighcoveLink(cms);

        files.push(videoBrightcoveName);

        await schoolAdminSaveChangesTaskAssignment(cms);
    });
}

export async function schoolAdminSaveChangesTaskAssignment(cms: CMSInterface) {
    await cms.selectAButtonByAriaLabel(`Save`);
    await cms.waitingForProgressBar();
}

export async function schoolAdminUploadTaskAssignmentBrighcoveLink(cms: CMSInterface) {
    let videoName = '';
    const { src } = schoolAdminGetABrightCoveVideo();
    await cms.instruction(
        `School admin upload task assignment video by brightcove link ${src}`,
        async () => {
            await cms.page!.fill(assignmentBrightcoveUploadInput, src);

            const [response] = await Promise.all([
                cms.waitForGRPCResponse(getBrightcoveVideoInfoEndpoint),
                cms.selectAButtonByAriaLabel('Upload'),
            ]);
            const decoder = createGrpcMessageDecoder(GetBrightCoveVideoInfoResponse);
            const encodedResponseText = await response?.text();
            const decodedResponse = decoder.decodeMessage(encodedResponseText);

            videoName = decodedResponse?.toObject()?.name ?? '';
        }
    );
    return videoName;
}

export async function studentSeesUpdatedTaskAssignmentInfo(
    learner: LearnerInterface,
    taskAssignmentName: string,
    taskAssignmentInfo: TaskAssignmentInfo,
    value: TaskAssignmentValue
) {
    const assignmentItemKey = new ByValueKey(
        SyllabusLearnerKeys.study_plan_item(taskAssignmentName)
    );
    const driver = learner.flutterDriver!;

    await driver.tap(assignmentItemKey);

    switch (taskAssignmentInfo) {
        case 'description': {
            if (value?.instruction) {
                await driver.waitFor(
                    new ByValueKey(
                        SyllabusLearnerKeys.assignment_instruction_field_text(value?.instruction)
                    )
                );
            }
            return;
        }

        case 'attachments': {
            if (value?.attachments) {
                await asyncForEach(value?.attachments, async (attachment) => {
                    await learner.instruction(
                        `${attachment} should be visible in task assignment details`,
                        async () => {
                            await driver.waitFor(new ByValueKey(attachment));
                        }
                    );
                });
            }
            return;
        }
    }
}

export async function teacherSeesUpdatedTaskAssignmentInfo(
    teacher: TeacherInterface,
    taskAssignmentInfo: TaskAssignmentInfo,
    value: TaskAssignmentValue
) {
    const driver = teacher.flutterDriver!;

    switch (taskAssignmentInfo) {
        case 'description': {
            if (value?.instruction) {
                await driver.waitFor(
                    new ByValueKey(
                        SyllabusTeacherKeys.assignmentInstructionTextField(value?.instruction)
                    )
                );
            }
            return;
        }

        case 'attachments': {
            if (value?.attachments) {
                await asyncForEach(value?.attachments, async (attachment) => {
                    await teacher.instruction(
                        `${attachment} should be visible in task assignment details`,
                        async () => {
                            await driver.waitFor(new ByValueKey(attachment));
                        }
                    );
                });
            }
            return;
        }
    }
}

export async function teacherSeesAndGoesToStudyPlanItemDetails(
    teacher: TeacherInterface,
    studyPlanItemName: string
) {
    const driver = teacher.flutterDriver!;

    const studyPlanListKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanScrollView);
    const studyPlanItemKey = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanItemRow(studyPlanItemName)
    );

    try {
        await driver.waitFor(studyPlanListKey);
        await delay(3000);
        await driver.scrollUntilTap(studyPlanListKey, studyPlanItemKey, 0.0, -300, 10000);
    } catch (error) {
        throw Error(`Expect can tap item ${studyPlanItemName}`);
    }
}
