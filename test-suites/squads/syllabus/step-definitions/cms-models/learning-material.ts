import { ILearningMaterialBase } from '@services/common/learning-material';

import {
    ContentBasicInfo,
    LearningObjective as LearningObjectiveProto,
} from 'manabuf/common/v1/contents_pb';
import { Assignment as AssignmentProto } from 'manabuf/eureka/v1/assignments_pb';
import { Int32Value } from 'manabuf/google/protobuf/wrappers_pb';
import { AssignmentBase } from 'manabuf/syllabus/v1/assignment_service_pb';
import { ExamLOBase } from 'manabuf/syllabus/v1/exam_lo_service_pb';
import { TaskAssignmentBase } from 'manabuf/syllabus/v1/task_assignment_service_pb';

// TODO: Fixed type when migrate to new endpoints
export type LearningObjective = Omit<LearningObjectiveProto.AsObject, 'info'> & {
    info: Pick<ContentBasicInfo.AsObject, 'name' | 'id'>;
} & ILearningMaterialBase;

// TODO: In the future we will remove LearningObjective out of LearningObjective_V2, FlashCard, ExamLO
export interface LearningObjective_V2 extends ILearningMaterialBase, LearningObjective {
    learningObjectiveId: ILearningMaterialBase['learningMaterialId'];
}

export type Assignment = Omit<
    AssignmentProto.AsObject,
    'displayOrder' | 'checkList' | 'assignmentStatus'
> &
    ILearningMaterialBase;

export interface Assignment_V2
    extends ILearningMaterialBase,
        Assignment,
        Omit<AssignmentBase.AsObject, 'base' | 'status'> {
    assignmentId: ILearningMaterialBase['learningMaterialId'];
}

export interface ExamLO
    extends ILearningMaterialBase,
        LearningObjective,
        Omit<ExamLOBase.AsObject, 'base'> {
    examLOId: ILearningMaterialBase['learningMaterialId'];
    gradeToPass: Int32Value.AsObject['value'] | undefined;
    timeLimit: Int32Value.AsObject['value'] | undefined;
}

export interface TaskAssignment
    extends ILearningMaterialBase,
        Assignment,
        Omit<TaskAssignmentBase.AsObject, 'base'> {
    taskAssignmentId: ILearningMaterialBase['learningMaterialId'];
}

export interface FlashCard extends ILearningMaterialBase, LearningObjective {
    flashcardId: ILearningMaterialBase['learningMaterialId'];
}
