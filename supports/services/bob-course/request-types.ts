import { Topic } from 'manabie-bob/courses_pb';

declare namespace NsBobCourseServiceRequest {
    export interface UpsertTopics
        extends Pick<
            Topic.AsObject,
            'id' | 'name' | 'displayOrder' | 'iconUrl' | 'chapterId' | 'schoolId'
        > {}
}

export default NsBobCourseServiceRequest;
