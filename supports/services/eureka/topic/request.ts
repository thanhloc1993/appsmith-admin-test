import NsTopicModifierServiceRequest from './request-types';
import { UpsertTopicsRequest } from 'manabuf/eureka/v1/topic_modifier_pb';
import { Topic } from 'manabuf/eureka/v1/topic_reader_pb';

export const createUpsertTopicRequest = (topics: NsTopicModifierServiceRequest.UpsertTopics[]) => {
    const request = new UpsertTopicsRequest();

    topics.forEach((item) => {
        const { id, schoolId, iconUrl, chapterId, displayOrder, name } = item;
        const topicIns = new Topic();

        if (id) topicIns.setId(id);

        topicIns.setName(name);
        topicIns.setSchoolId(schoolId);
        topicIns.setChapterId(chapterId);
        topicIns.setDisplayOrder(displayOrder);

        if (iconUrl) topicIns.setIconUrl(iconUrl);

        request.addTopics(topicIns);
    });

    return request;
};
