import NsYasuoCourseServiceRequest from '../../yasuo-course/request-types';

declare namespace NsBookModifierServiceRequest {
    interface UpsertBooks extends NsYasuoCourseServiceRequest.UpsertBooks {}
}

export default NsBookModifierServiceRequest;
