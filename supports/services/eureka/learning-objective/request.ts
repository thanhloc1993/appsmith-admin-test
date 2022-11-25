import { createLearningMaterialBaseForInsert } from '@supports/services/common/learning-material';

import { genId } from '../../../../step-definitions/utils';
import NsLearningObjectiveModifierServiceRequest from './request-types';
import { ContentBasicInfo, LearningObjective } from 'manabuf/common/v1/contents_pb';
import { UpsertLOsRequest } from 'manabuf/eureka/v1/learning_objective_modifier_pb';
import {
    InsertLearningObjectiveRequest,
    LearningObjectiveBase,
} from 'manabuf/syllabus/v1/learning_objective_service_pb';

export const createUpsertLearningObjectiveRequest = (
    learningObjectives: NsLearningObjectiveModifierServiceRequest.UpsertLearningObjectives[]
) => {
    const request = new UpsertLOsRequest();

    const requestLearningObjectives = learningObjectives.map(
        ({ video, studyGuide, topicId, type, info, timeLimit }) => {
            const { id, name, schoolId, displayOrder } = info;

            const requestLearningObjective = new LearningObjective();
            const basicInfo = new ContentBasicInfo();

            basicInfo.setId(id || genId());
            basicInfo.setName(name);
            basicInfo.setDisplayOrder(displayOrder);
            basicInfo.setSchoolId(schoolId);

            requestLearningObjective.setVideo(video);
            requestLearningObjective.setStudyGuide(studyGuide);
            requestLearningObjective.setTopicId(topicId);
            requestLearningObjective.setType(type);
            requestLearningObjective.setInfo(basicInfo);
            requestLearningObjective.setTimeLimit(timeLimit);

            return requestLearningObjective;
        }
    );

    request.setLearningObjectivesList(requestLearningObjectives);

    return request;
};

export const createInsertLORequest = (
    payload: NsLearningObjectiveModifierServiceRequest.InsertLearningObjective
) => {
    const request = new InsertLearningObjectiveRequest();
    const learningObjective = new LearningObjectiveBase();

    const { name, topicId, studyGuide, videoId } = payload;

    learningObjective.setBase(
        createLearningMaterialBaseForInsert({
            name,
            topicId,
        })
    );

    learningObjective.setVideoId(videoId);
    learningObjective.setStudyGuide(studyGuide);

    request.setLearningObjective(learningObjective);

    return request;
};
