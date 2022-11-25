import {
    createLearningMaterialBaseForInsert,
    createLearningMaterialBaseForUpdate,
} from '@supports/services/common/learning-material';

import NsAssignmentModifierServiceRequest from './request-types';
import { UpsertAssignmentsRequest } from 'manabuf/eureka/v1/assignment_writer_pb';
import { Assignment, AssignmentContent, AssignmentSetting } from 'manabuf/eureka/v1/assignments_pb';
import { AssignmentStatus } from 'manabuf/eureka/v1/enums_pb';
import {
    AssignmentBase,
    InsertAssignmentRequest,
    UpdateAssignmentRequest,
} from 'manabuf/syllabus/v1/assignment_service_pb';
import { genId } from 'step-definitions/utils';

export const createUpsertAssignmentsRequest = (
    assignments: NsAssignmentModifierServiceRequest.UpsertAssignments[]
) => {
    const request = new UpsertAssignmentsRequest();
    const requestAssignments = assignments.map(createAssignment);

    request.setAssignmentsList(requestAssignments);

    return request;
};

function createAssignment({
    assignmentId,
    name,
    content,
    setting,
    instruction,
    maxGrade,
    displayOrder,
    attachmentsList,
    assignmentType,
}: NsAssignmentModifierServiceRequest.UpsertAssignments) {
    const assignment = new Assignment();
    const assignmentSetting = new AssignmentSetting();

    assignment.setAssignmentId(assignmentId || genId());
    assignment.setName(name);
    assignment.setSetting(assignmentSetting);
    assignment.setInstruction(instruction);
    assignment.setMaxGrade(maxGrade);
    assignment.setRequiredGrade(!!maxGrade);
    assignment.setAssignmentType(assignmentType);
    assignment.setAssignmentStatus(AssignmentStatus.ASSIGNMENT_STATUS_ACTIVE);
    assignment.setDisplayOrder(displayOrder);
    assignment.setAttachmentsList(attachmentsList || []);
    if (content) {
        const assignmentContent = new AssignmentContent();
        const { topicId, loIdList } = content;

        assignmentContent.setTopicId(topicId);
        assignmentContent.setLoIdList(loIdList);
        assignment.setContent(assignmentContent);
    }

    if (setting) {
        const {
            allowLateSubmission,
            allowResubmission,
            requireAssignmentNote,
            requireAttachment,
            requireVideoSubmission,
            requireCorrectness,
            requireDuration,
            requireUnderstandingLevel,
            requireCompleteDate,
        } = setting;

        assignmentSetting.setAllowLateSubmission(allowLateSubmission);
        assignmentSetting.setAllowResubmission(allowResubmission);
        assignmentSetting.setRequireAssignmentNote(requireAssignmentNote);
        assignmentSetting.setRequireAttachment(requireAttachment);
        assignmentSetting.setRequireVideoSubmission(requireVideoSubmission);
        assignmentSetting.setRequireCompleteDate(requireCompleteDate);
        assignmentSetting.setRequireDuration(requireDuration);
        assignmentSetting.setRequireCorrectness(requireCorrectness);
        assignmentSetting.setRequireUnderstandingLevel(requireUnderstandingLevel);
    } else {
        assignmentSetting.setAllowLateSubmission(false);
        assignmentSetting.setAllowResubmission(false);
        assignmentSetting.setRequireAssignmentNote(false);
        assignmentSetting.setRequireAttachment(false);
        assignmentSetting.setRequireVideoSubmission(false);
        assignmentSetting.setRequireCompleteDate(false);
        assignmentSetting.setRequireDuration(false);
        assignmentSetting.setRequireCorrectness(false);
        assignmentSetting.setRequireUnderstandingLevel(false);
    }

    return assignment;
}

export const createAssignmentWithoutBase = (
    payload: Omit<AssignmentBase.AsObject, 'base' | 'status'>
) => {
    const { instruction, isRequiredGrade, maxGrade, attachmentsList } = payload;

    const assignment = new AssignmentBase();
    assignment.setAttachmentsList(attachmentsList);
    assignment.setIsRequiredGrade(isRequiredGrade);
    assignment.setInstruction(instruction);

    if (isRequiredGrade) assignment.setMaxGrade(maxGrade);

    // Settings
    const {
        allowLateSubmission,
        allowResubmission,
        requireAssignmentNote,
        requireAttachment,
        requireVideoSubmission,
    } = payload;
    assignment.setAllowLateSubmission(allowLateSubmission);
    assignment.setAllowResubmission(allowResubmission);
    assignment.setRequireAssignmentNote(requireAssignmentNote);
    assignment.setRequireAttachment(requireAttachment);
    assignment.setRequireVideoSubmission(requireVideoSubmission);
    return assignment;
};

export const createInsertAssignmentRequest = (
    payload: NsAssignmentModifierServiceRequest.InsertAssignment
) => {
    const { name, topicId } = payload;

    const request = new InsertAssignmentRequest();

    const assignment = createAssignmentWithoutBase(payload);

    assignment.setBase(
        createLearningMaterialBaseForInsert({
            name,
            topicId,
        })
    );

    request.setAssignment(assignment);

    return request;
};

export const createUpdateAssignmentRequest = (
    payload: NsAssignmentModifierServiceRequest.UpdateAssignment
) => {
    const { name, learningMaterialId } = payload;

    const request = new UpdateAssignmentRequest();

    const assignment = createAssignmentWithoutBase(payload);

    assignment.setBase(
        createLearningMaterialBaseForUpdate({
            name,
            learningMaterialId,
        })
    );

    request.setAssignment(assignment);

    return request;
};
