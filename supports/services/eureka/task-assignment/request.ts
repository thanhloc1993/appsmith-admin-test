import { createLearningMaterialBaseForInsert } from '@supports/services/common/learning-material';

import { NsTaskAssignmentModifierService } from './request-types';
import {
    TaskAssignmentBase,
    InsertTaskAssignmentRequest,
} from 'manabuf/syllabus/v1/task_assignment_service_pb';

export const createTaskAssignmentWithoutBase = (
    payload: Omit<TaskAssignmentBase.AsObject, 'requireCompleteDate' | 'base'>
) => {
    const {
        attachmentsList,
        instruction,
        requireAssignmentNote,
        requireCorrectness,
        requireUnderstandingLevel,
        requireDuration,
        requireAttachment,
    } = payload;

    const taskAssignment = new TaskAssignmentBase();

    taskAssignment.setAttachmentsList(attachmentsList);
    taskAssignment.setInstruction(instruction);

    taskAssignment.setRequireAssignmentNote(requireAssignmentNote);
    taskAssignment.setRequireDuration(requireDuration);
    taskAssignment.setRequireCorrectness(requireCorrectness);
    taskAssignment.setRequireAttachment(requireAttachment);
    taskAssignment.setRequireUnderstandingLevel(requireUnderstandingLevel);
    // Auto is true (Can check BE to remove if BE set default is true)
    taskAssignment.setRequireCompleteDate(true);

    return taskAssignment;
};

export const createInsertTaskAssignmentRequest = (
    payload: NsTaskAssignmentModifierService.InsertTaskAssignment
) => {
    const { name, topicId } = payload;

    const request = new InsertTaskAssignmentRequest();
    const taskAssignment = createTaskAssignmentWithoutBase(payload);

    taskAssignment.setBase(
        createLearningMaterialBaseForInsert({
            name,
            topicId,
        })
    );

    request.setTaskAssignment(taskAssignment);

    return request;
};
