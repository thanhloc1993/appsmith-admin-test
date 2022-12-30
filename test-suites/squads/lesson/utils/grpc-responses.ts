import { CMSInterface } from '@supports/app-types';

import {
    deleteLessonBob,
    retrieveLessonsLessonMgmt,
    retrieveLocationsMaster,
    saveDraftGroupLessonReportLessonMgmt,
    studentSubscriptionRetrieveBob,
    submitGroupLessonReportLessonMgmt,
} from 'test-suites/squads/lesson/common/endpoints';

export async function waitRetrieveLessonsResponse(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(retrieveLessonsLessonMgmt, { timeout: 30000 });
}

export async function waitRetrieveLocationsResponse(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(retrieveLocationsMaster, { timeout: 30000 });
}

export async function waitSubmitGroupReportResponse(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(submitGroupLessonReportLessonMgmt, { timeout: 30000 });
}

export async function waitSaveDraftGroupReportResponse(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(saveDraftGroupLessonReportLessonMgmt, { timeout: 30000 });
}

export async function waitDeleteLessonResponse(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(deleteLessonBob, { timeout: 30000 });
}

export async function waitRetrieveStudentSubscriptionResponse(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(studentSubscriptionRetrieveBob, { timeout: 60000 });
}
