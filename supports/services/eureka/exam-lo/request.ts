import { createLearningMaterialBaseForInsert } from '@supports/services/common/learning-material';

import NsExamLOModifierServiceRequest from './request-types';
import { Int32Value } from 'manabuf/google/protobuf/wrappers_pb';
import { InsertExamLORequest, ExamLOBase } from 'manabuf/syllabus/v1/exam_lo_service_pb';

export const createInsertExamLORequest = (payload: NsExamLOModifierServiceRequest.InsertExamLO) => {
    const request = new InsertExamLORequest();
    const examLO = new ExamLOBase();

    const { name, topicId, instruction, manualGrading, gradeToPass, timeLimit } = payload;

    examLO.setBase(
        createLearningMaterialBaseForInsert({
            name,
            topicId,
        })
    );

    if (gradeToPass) {
        const gradeToPassIns = new Int32Value();
        gradeToPassIns.setValue(gradeToPass);
        examLO.setGradeToPass(gradeToPassIns);
    }

    if (timeLimit) {
        const timeLimitIns = new Int32Value();
        timeLimitIns.setValue(timeLimit);
        examLO.setTimeLimit(timeLimitIns);
    }

    examLO.setInstruction(instruction);
    examLO.setManualGrading(manualGrading);

    request.setExamLo(examLO);

    return request;
};
