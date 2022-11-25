import {
    ImportLocationRequest,
    ImportLocationResponse,
    ImportLocationTypeRequest,
    ImportLocationTypeResponse,
} from 'manabuf/bob/v1/masterdata_pb';

export interface ImportLocationData {
    partner_internal_id: string;
    name: string;
    location_type: string;
    partner_internal_parent_id: string;
    is_archived: boolean;
}

export interface ImportLocationTypeData {
    name: string;
    display_name: string;
    parent_name: string;
    is_archived: boolean;
}

export type ImportBobDataPayload = ImportLocationData | ImportLocationTypeData;

export type ImportBobDataRequest = ImportLocationRequest | ImportLocationTypeRequest | null;

export type ImportBobDataResponse = ImportLocationResponse | ImportLocationTypeResponse;
