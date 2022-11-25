import NsBobCourseServiceRequest from '../../bob-course/request-types';

declare namespace NsTopicModifierServiceRequest {
    interface UpsertTopics extends NsBobCourseServiceRequest.UpsertTopics {}
}

export default NsTopicModifierServiceRequest;
