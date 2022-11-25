import { callGRPC } from '../grpc/grpc';
import { deleteTimesheetReq } from './request';
import NsTimesheetModifierService from './request-types';
import { ITimesheetModifierService } from './types';
import {
    DeleteTimesheetRequest,
    DeleteTimesheetResponse,
} from 'manabuf/timesheet/v1/timesheet_state_machine_pb';

export class TimesheetModifierService implements ITimesheetModifierService {
    readonly serviceName = 'timesheet.v1.TimesheetStateMachineService';

    async deleteTimesheet(token: string, payload: NsTimesheetModifierService.deleteTimesheetReq) {
        const request = deleteTimesheetReq(payload);

        const response = await callGRPC<DeleteTimesheetRequest, DeleteTimesheetResponse>({
            serviceName: this.serviceName,
            methodName: 'DeleteTimesheet',
            request,
            token,
            requestType: DeleteTimesheetRequest,
            responseType: DeleteTimesheetResponse,
        });

        return { request: request.toObject(), response: response.message?.toObject() };
    }
}
