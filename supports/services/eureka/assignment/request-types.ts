import {
    InsertLearningMaterialBase,
    UpdateLearningMaterialBase,
} from '@supports/services/common/learning-material';

import NsEurekaAssignmentModifierServiceRequest from '../../eureka-assignment-modifier/request-types';
import { AssignmentBase } from 'manabuf/syllabus/v1/assignment_service_pb';

declare namespace NsAssignmentModifierServiceRequest {
    interface UpsertAssignments
        extends NsEurekaAssignmentModifierServiceRequest.UpsertAssignments {}

    interface InsertAssignment
        extends InsertLearningMaterialBase,
            Omit<AssignmentBase.AsObject, 'base' | 'status'> {}

    interface UpdateAssignment
        extends UpdateLearningMaterialBase,
            Omit<AssignmentBase.AsObject, 'base' | 'status'> {}
}

export default NsAssignmentModifierServiceRequest;
