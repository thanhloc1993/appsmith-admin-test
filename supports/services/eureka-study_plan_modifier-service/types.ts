import {
    ContentStructure,
    StudyPlanItem as StudyPlanItemAssignmentPb,
} from 'manabuf/eureka/v1/assignments_pb';
import {
    MasterStudyPlan,
    MasterStudyPlanIdentify,
    StudyPlanItem,
} from 'manabuf/syllabus/v1/study_plan_pb';

export interface ContentStructureObject extends ContentStructure.AsObject {
    assignmentId?: string;
    loId?: string;
}

export interface StudyPlanItemObject
    extends Omit<StudyPlanItemAssignmentPb.AsObject, 'displayOrder'> {
    contentStructure?: ContentStructureObject;
    startDate?: string;
    endDate?: string;
    availableFrom?: string;
    availableTo?: string;
}

export interface StudyPlanItemAsObject extends Omit<StudyPlanItem.AsObject, 'displayOrder'> {
    startDate?: string;
    endDate?: string;
    availableFrom?: string;
    availableTo?: string;
}

export declare namespace NsSyllabus_StudyPlanItemModifierService {
    export interface UpsertMasterStudyPlanItem
        extends Omit<MasterStudyPlan.AsObject, 'masterStudyPlanIdentify'>,
            MasterStudyPlanIdentify.AsObject {}

    export interface UpsertMasterStudyPlanItems extends Array<UpsertMasterStudyPlanItem> {}
}
