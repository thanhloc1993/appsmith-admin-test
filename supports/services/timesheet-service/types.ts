import ServiceBase from '../base';
import {
    DeleteTimesheetRequest,
    DeleteTimesheetResponse,
} from 'manabuf/timesheet/v1/timesheet_state_machine_pb';

export interface ITimesheetModifierService extends ServiceBase {
    /**
     * Delete timesheet using gRPC endpoint.
     * @param {string} token The user's token
     * @param {DeleteTimesheetRequest.AsObject}  payload The timesheet to be deleted
     * @returns {Promise<{ request: DeleteTimesheetRequest.AsObject, response?: DeleteTimesheetResponse.AsObject }>} A Promise that will be fulfilled with the request and a response indicating whether the operation was successful
     */
    deleteTimesheet(
        token: string,
        payload: DeleteTimesheetRequest.AsObject
    ): Promise<{
        request: DeleteTimesheetRequest.AsObject;
        response?: DeleteTimesheetResponse.AsObject;
    }>;
}
