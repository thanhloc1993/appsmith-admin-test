import { InsertLearningMaterialBase } from '@supports/services/common/learning-material';

import { Int32Value } from 'manabuf/google/protobuf/wrappers_pb';
import { ExamLOBase } from 'manabuf/syllabus/v1/exam_lo_service_pb';

declare namespace NsExamLOModifierServiceRequest {
    interface InsertExamLO extends InsertLearningMaterialBase, Omit<ExamLOBase.AsObject, 'base'> {
        gradeToPass: Int32Value.AsObject['value'] | undefined;
        timeLimit: Int32Value.AsObject['value'] | undefined;
    }
}

export default NsExamLOModifierServiceRequest;
