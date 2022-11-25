import { Assignment } from 'manabuf/eureka/v1/assignments_pb';

declare namespace NsEurekaAssignmentModifierServiceRequest {
    export interface UpsertAssignments
        extends Pick<
            Assignment.AsObject,
            | 'assignmentId'
            | 'name'
            | 'content'
            | 'attachmentsList'
            | 'setting'
            | 'maxGrade'
            | 'instruction'
            | 'displayOrder'
            | 'assignmentType'
            | 'requiredGrade'
        > {}
}

export default NsEurekaAssignmentModifierServiceRequest;
