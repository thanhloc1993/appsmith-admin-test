import { toTimestampServerTimezone } from '../common/request';
import {
    ContentStructureObject,
    NsSyllabus_StudyPlanItemModifierService,
    StudyPlanItemObject,
} from './types';
import { ContentStructure, StudyPlanItem } from 'manabuf/eureka/v1/assignments_pb';
import {
    UpsertStudyPlanRequest,
    UpsertStudyPlanItemV2Request,
} from 'manabuf/eureka/v1/study_plan_modifier_pb';
import { StringValue } from 'manabuf/google/protobuf/wrappers_pb';
import { MasterStudyPlan, MasterStudyPlanIdentify } from 'manabuf/syllabus/v1/study_plan_pb';
import { UpsertMasterInfoRequest } from 'manabuf/syllabus/v1/study_plan_service_pb';

export const createUpsertStudyPlanRequest = (
    params: UpsertStudyPlanRequest.AsObject
): UpsertStudyPlanRequest => {
    const request = new UpsertStudyPlanRequest();

    const {
        bookId,
        courseId,
        gradesList,
        schoolId,
        name,
        status,
        trackSchoolProgress,
        studyPlanId,
    } = params;

    request.setStatus(status);
    request.setCourseId(courseId);
    request.setSchoolId(schoolId);
    request.setBookId(bookId);
    request.setName(name);
    request.setGradesList(gradesList);
    request.setTrackSchoolProgress(trackSchoolProgress);

    request.setStudyPlanId(studyPlanId);

    return request;
};

const createRequestContentStructure = ({
    bookId,
    chapterId,
    topicId,
    assignmentId,
    loId,
    courseId,
}: ContentStructureObject) => {
    const requestContentStructure = new ContentStructure();

    requestContentStructure.setBookId(bookId);
    requestContentStructure.setChapterId(chapterId);
    requestContentStructure.setTopicId(topicId);
    requestContentStructure.setCourseId(courseId);

    if (assignmentId) {
        const assignmentIdStringValue = new StringValue();

        assignmentIdStringValue.setValue(assignmentId);
        requestContentStructure.setAssignmentId(assignmentIdStringValue);
    }

    if (loId) {
        const loIdStringValue = new StringValue();

        loIdStringValue.setValue(loId);
        requestContentStructure.setLoId(loIdStringValue);
    }

    return requestContentStructure;
};

const studyPlanItemInfoSetting = (
    studyPlanItem: StudyPlanItem | MasterStudyPlan,
    timezone: string,
    {
        availableFrom,
        availableTo,
        startDate,
        endDate,
    }: {
        availableFrom?: string;
        availableTo?: string;
        startDate?: string;
        endDate?: string;
    }
) => {
    if (availableFrom) {
        studyPlanItem.setAvailableFrom(
            toTimestampServerTimezone({
                originDate: availableFrom,
                timezone,
                timeSlice: 'no-slice',
            })
        );
    }

    if (availableTo) {
        studyPlanItem.setAvailableTo(
            toTimestampServerTimezone({
                originDate: availableTo,
                timezone,
                timeSlice: 'no-slice',
            })
        );
    }

    if (startDate) {
        studyPlanItem.setStartDate(
            toTimestampServerTimezone({
                originDate: startDate,
                timezone,
                timeSlice: 'no-slice',
            })
        );
    }

    if (endDate) {
        studyPlanItem.setEndDate(
            toTimestampServerTimezone({
                originDate: endDate,
                timezone,
                timeSlice: 'no-slice',
            })
        );
    }
};

export const createUpsertStudyPlanItemsRequest = (
    data: StudyPlanItemObject[],
    timezone: string
) => {
    const request = new UpsertStudyPlanItemV2Request();
    const studyPlanItems = data.map(
        ({
            studyPlanId,
            studyPlanItemId,
            availableFrom,
            availableTo,
            startDate,
            endDate,
            contentStructure,
            status,
        }) => {
            const studyPlanItem = new StudyPlanItem();

            studyPlanItem.setStudyPlanId(studyPlanId);
            studyPlanItem.setStudyPlanItemId(studyPlanItemId);
            studyPlanItem.setStatus(status);

            if (contentStructure) {
                studyPlanItem.setContentStructure(createRequestContentStructure(contentStructure));
            }

            studyPlanItemInfoSetting(studyPlanItem, timezone, {
                availableFrom,
                availableTo,
                startDate,
                endDate,
            });

            return studyPlanItem;
        }
    );

    request.setStudyPlanItemsList(studyPlanItems);

    return request;
};

export const createUpsertMasterStudyPlanItemsRequest = (
    data: NsSyllabus_StudyPlanItemModifierService.UpsertMasterStudyPlanItems,
    timezone: string
) => {
    const request = new UpsertMasterInfoRequest();

    const studyPlanItems = data.map(
        ({
            studyPlanId,
            learningMaterialId,
            availableFrom,
            availableTo,
            startDate,
            endDate,
            status,
        }) => {
            const masterStudyPlanIdentity = new MasterStudyPlanIdentify();
            const studyPlanItem = new MasterStudyPlan();

            masterStudyPlanIdentity.setStudyPlanId(studyPlanId);
            masterStudyPlanIdentity.setLearningMaterialId(learningMaterialId);

            studyPlanItem.setMasterStudyPlanIdentify(masterStudyPlanIdentity);
            studyPlanItem.setStatus(status);

            studyPlanItemInfoSetting(studyPlanItem, timezone, {
                availableFrom,
                availableTo,
                startDate,
                endDate,
            });

            return studyPlanItem;
        }
    );

    request.setMasterItemsList(studyPlanItems);

    return request;
};
