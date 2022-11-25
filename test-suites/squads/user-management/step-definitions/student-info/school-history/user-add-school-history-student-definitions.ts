import { schoolHistoriesAlias, studentDetailDataGRPCAlias } from '@user-common/alias-keys/student';
import { FieldsConditionTypes } from '@user-common/types/bdd';
import { SchoolHistoriesTypes, StudentInformation } from '@user-common/types/student';
import { clickOnSaveFullScreenDialog } from '@user-common/utils/click-actions';
import { decodeResponse } from '@user-common/utils/decode-grpc';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { createSchoolHistoryData } from './school-history-student-detail-utils';
import { CreateStudentResponse } from 'manabuf/usermgmt/v2/users_pb';

export async function modifySchoolHistoryData(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    conditions: FieldsConditionTypes,
    gradeMaster?: StudentInformation['gradeMaster']
) {
    const schoolHistories = scenarioContext.get<SchoolHistoriesTypes[]>(schoolHistoriesAlias);
    switch (conditions) {
        case 'without optional fields':
            {
                const removedSchoolHistories = schoolHistories.map((schoolHistory) => ({
                    ...schoolHistory,
                    schoolCourse: null,
                    startDate: null,
                    endDate: null,
                }));
                scenarioContext.set(schoolHistoriesAlias, removedSchoolHistories);
            }
            break;
        case 'without required fields':
            {
                const removedSchoolHistories = schoolHistories.map((schoolHistory) => ({
                    ...schoolHistory,
                    schoolLevel: null,
                    schoolInfo: null,
                    schoolCourse: null,
                }));
                scenarioContext.set(schoolHistoriesAlias, removedSchoolHistories);
            }
            break;
        case 'with full fields having current school':
            {
                const result = await createSchoolHistoryData(cms, 1, gradeMaster, true);
                scenarioContext.set(schoolHistoriesAlias, result);
            }

            break;
        case 'with full fields no having current school':
            {
                const result = await createSchoolHistoryData(cms, 1, gradeMaster);
                scenarioContext.set(schoolHistoriesAlias, result);
            }
            break;
    }
}

export async function clickSaveToCreateAndSavingResp(cms: CMSInterface, context: ScenarioContext) {
    // without error
    const [studentResp] = await Promise.all([
        cms.waitForGRPCResponse('usermgmt.v2.UserModifierService/CreateStudent'),
        clickOnSaveFullScreenDialog(cms),
        cms.waitingForLoadingIcon(),
    ]);

    const decodeStudentResp = await decodeResponse(CreateStudentResponse, studentResp);

    context.set(studentDetailDataGRPCAlias, decodeStudentResp?.toObject());
}
