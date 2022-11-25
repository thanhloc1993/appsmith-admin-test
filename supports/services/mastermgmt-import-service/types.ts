import { ImportGradeRequest, ImportGradeResponse } from 'manabuf/bob/v1/grades_pb';
import { ImportClassRequest, ImportClassResponse } from 'manabuf/mastermgmt/v1/class_pb';

export interface ImportGradeData {
    partner_internal_id: string;
    name: string;
    sequence: number;
    is_archived: boolean;
}

export interface ImportClassData {
    course_id: string;
    location_id: string;
    course_name: string;
    location_name: string;
    class_name: string;
}

export type ImportBobDataPayload = ImportGradeData | ImportClassData;

export type ImportBobDataRequest = ImportGradeRequest | ImportClassRequest | null;

export type ImportBobDataResponse = ImportGradeResponse | ImportClassResponse;
