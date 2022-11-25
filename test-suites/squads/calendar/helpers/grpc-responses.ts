import { CMSInterface } from '@supports/app-types';

import {
    retrieveLessonsLessonMgmt,
    retrieveLocationsMaster,
    submitGroupLessonReportLessonMgmt,
} from 'test-suites/squads/calendar/common/endpoints';

export async function waitRetrieveLessonsResponse(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(retrieveLessonsLessonMgmt, { timeout: 30000 });
}

export async function waitRetrieveLocationsResponse(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(retrieveLocationsMaster, { timeout: 30000 });
}

export async function waitSubmitGroupReportResponse(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(submitGroupLessonReportLessonMgmt, { timeout: 30000 });
}
