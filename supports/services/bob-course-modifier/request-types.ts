import { LearningObjective, ContentBasicInfo } from 'manabuf/common/v1/contents_pb';

declare namespace NsBobCourseModifierServiceRequest {
    export interface UpsertLearningObjectives
        extends Omit<
            LearningObjective.AsObject,
            'info' | 'approveGrading' | 'gradeCapping' | 'reviewOption'
        > {
        info: Pick<ContentBasicInfo.AsObject, 'displayOrder' | 'name' | 'schoolId' | 'id'>;
    }
}

export default NsBobCourseModifierServiceRequest;
