import { DeleteTimesheetRequest } from 'manabuf/timesheet/v1/timesheet_state_machine_pb';

declare namespace NsTimesheetModifierService {
    export interface deleteTimesheetReq extends DeleteTimesheetRequest.AsObject {}
}

export default NsTimesheetModifierService;
