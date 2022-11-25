import { toTimestampNewProto } from '../common/request';
import { callGRPC } from '../grpc/grpc';
import {
    CreateEntryExitRequest,
    CreateEntryExitResponse,
    EntryExitPayload,
} from 'manabuf/entryexitmgmt/v1/entry_exit_pb';

export interface EntryExitRecordData {
    studentId: string;
    entryDateTime: Date;
    exitDateTime?: Date;
    notifyParents: boolean;
}

export class EntryExitService {
    readonly serviceName = 'entryexitmgmt.v1.EntryExitService';

    async createEntryExitRecord(
        token: string,
        entryExitRecord: EntryExitRecordData
    ): Promise<{
        request: CreateEntryExitRequest.AsObject;
        response: CreateEntryExitResponse.AsObject | undefined;
    }> {
        const req = new CreateEntryExitRequest();
        const payload = new EntryExitPayload();

        payload.setStudentId(entryExitRecord.studentId);

        payload.setEntryDateTime(toTimestampNewProto(entryExitRecord.entryDateTime));

        if (entryExitRecord.exitDateTime) {
            payload.setExitDateTime(toTimestampNewProto(entryExitRecord.exitDateTime));
        }
        req.setEntryExitPayload(payload);

        const response = await callGRPC<CreateEntryExitRequest, CreateEntryExitResponse>({
            serviceName: this.serviceName,
            methodName: 'CreateEntryExit',
            request: req,
            token,
            requestType: CreateEntryExitRequest,
            responseType: CreateEntryExitResponse,
        });
        return {
            request: req.toObject(),
            response: response.message?.toObject(),
        };
    }
}
