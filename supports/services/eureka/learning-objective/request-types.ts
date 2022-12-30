import { InsertLearningMaterialBase } from '@supports/services/common/learning-material';

import NsBobCourseModifierServiceRequest from '../../bob-course-modifier/request-types';
import { LearningObjectiveBase } from 'manabuf/syllabus/v1/learning_objective_service_pb';

declare namespace NsLearningObjectiveModifierServiceRequest {
    interface UpsertLearningObjectives
        extends NsBobCourseModifierServiceRequest.UpsertLearningObjectives {}

    interface InsertLearningObjective
        extends InsertLearningMaterialBase,
            Omit<LearningObjectiveBase.AsObject, 'base' | 'videoScript' | 'totalQuestion'> {}
}

export default NsLearningObjectiveModifierServiceRequest;
