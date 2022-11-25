import { InsertLearningMaterialBase } from '@supports/services/common/learning-material';

import { TaskAssignmentBase } from 'manabuf/syllabus/v1/task_assignment_service_pb';

export declare namespace NsTaskAssignmentModifierService {
    interface InsertTaskAssignment
        extends InsertLearningMaterialBase,
            Omit<TaskAssignmentBase.AsObject, 'base' | 'displayOrder' | 'requireCompleteDate'> {}
}
