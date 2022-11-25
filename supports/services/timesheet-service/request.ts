import NsTimesheetModifierService from '@supports/services/timesheet-service/request-types';

import { DeleteTimesheetRequest } from 'manabuf/timesheet/v1/timesheet_state_machine_pb';

export function deleteTimesheetReq(data: NsTimesheetModifierService.deleteTimesheetReq) {
    const request = new DeleteTimesheetRequest();
    request.setTimesheetId(data.timesheetId);
    return request;
}
