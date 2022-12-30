import { arrayHasItem } from '@legacy-step-definitions/utils';
import { UserMasterEntity } from '@user-common/types/bdd';
import { SchoolHistoriesTypes, StudentInformation } from '@user-common/types/student';
import { clickButtonInNotFullScreenDialogByText } from '@user-common/utils/click-actions';

import { CMSInterface } from '@supports/app-types';
import {
    User_GetManyReferenceSchoolLevelV2Query,
    User_GetManyReferenceSchoolLevelV2QueryVariables,
    User_Eibanam_GetManyReferenceSchoolInfoQuery,
    User_Eibanam_GetManyReferenceSchoolInfoQueryVariables,
    User_GetManyReferenceSchoolCourseQueryVariables,
    User_GetManyReferenceSchoolCourseQuery,
    User_Eibanam_GetSchoolLevelGradeByIdsQueryVariables,
    User_Eibanam_GetSchoolLevelGradeByIdsQuery,
} from '@supports/graphql/bob/bob-types';
import schoolCourseBobQuery from '@supports/graphql/bob/school-course.query';
import schoolInfoBobQuery from '@supports/graphql/bob/school-info.query';
import schoolLevelGradeBobQuery from '@supports/graphql/bob/school-level-grade.query';
import schoolLevelBobQuery from '@supports/graphql/bob/school-level.query';
import { getSearchString } from '@supports/utils/ulid';

import {
    createMasterCSVFile,
    CreateMasterCSVFileOptionsTypes,
    schoolAdminOpenMasterImportDialog,
    schoolAdminSelectMasterCSVFile,
} from '../../master-management/user-import-master-data-definitions';

export async function getSchoolLevel(
    cms: CMSInterface,
    variables: User_GetManyReferenceSchoolLevelV2QueryVariables
) {
    const schoolLevelResponse =
        await cms.graphqlClient?.callGqlBob<User_GetManyReferenceSchoolLevelV2Query>({
            body: schoolLevelBobQuery.getManyReferenceSchoolLevel(variables),
        });

    return schoolLevelResponse?.data.school_level || [];
}

export async function getSchoolLevelGradeByIds(
    cms: CMSInterface,
    variables: User_Eibanam_GetSchoolLevelGradeByIdsQueryVariables
) {
    const response =
        await cms.graphqlClient?.callGqlBob<User_Eibanam_GetSchoolLevelGradeByIdsQuery>({
            body: schoolLevelGradeBobQuery.getSchoolLevelGradeByIds(variables),
        });

    return response?.data.school_level_grade || [];
}

export async function getSchoolInfoBySchoolLevelId(
    cms: CMSInterface,
    options?: User_Eibanam_GetManyReferenceSchoolInfoQueryVariables
) {
    const schoolInfoResponse =
        await cms.graphqlClient?.callGqlBob<User_Eibanam_GetManyReferenceSchoolInfoQuery>({
            body: schoolInfoBobQuery.getManyReferenceSchoolInfo({
                limit: 50,
                ...options,
            }),
        });

    return schoolInfoResponse?.data.school_info || [];
}
export async function getSchoolCourseBySchoolId(
    cms: CMSInterface,
    options?: User_GetManyReferenceSchoolCourseQueryVariables
) {
    const schoolInfoResponse =
        await cms.graphqlClient?.callGqlBob<User_GetManyReferenceSchoolCourseQuery>({
            body: schoolCourseBobQuery.getManyReferenceSchoolCourse({
                limit: 50,
                ...options,
            }),
        });

    return schoolInfoResponse?.data.school_course || [];
}

export async function isCurrentSchool(
    cms: CMSInterface,
    variables: User_Eibanam_GetSchoolLevelGradeByIdsQueryVariables
) {
    const data = await getSchoolLevelGradeByIds(cms, variables);

    return { isCurrent: arrayHasItem(data), data };
}

export async function genSchoolLevel(cms: CMSInterface, count: number) {
    let schoolLevels = await getSchoolLevel(cms, {
        limit: 50,
        name: getSearchString('E2E - School Level'),
    });

    while (!arrayHasItem(schoolLevels) || schoolLevels.length < count) {
        await importLackOfDataMaster(cms, 'School Level');
        schoolLevels = await getSchoolLevel(cms, {
            limit: 50,
            name: getSearchString('E2E - School Level'),
        });
    }
    return schoolLevels;
}

export async function createSchoolHistoryData(
    cms: CMSInterface,
    count: number,
    gradeMaster?: StudentInformation['gradeMaster'],
    hasCurrentSchool?: boolean
): Promise<SchoolHistoriesTypes[]> {
    let schoolLevels = await genSchoolLevel(cms, count);
    const schoolHistories: SchoolHistoriesTypes[] = [];
    const { isCurrent, data: gradeLevelData } = await isCurrentSchool(cms, {
        grade_id: gradeMaster?.grade_id,
        school_level_id: schoolLevels[0].school_level_id,
    });

    if (gradeMaster && hasCurrentSchool && !isCurrent) {
        await importLackOfDataMaster(cms, 'School Level Grade', {
            schoolLevelGradeReferences: {
                schoolLevel: schoolLevels[0].school_level_id,
                gradeId: gradeMaster?.grade_id,
            },
        });
    }

    for (let i = 0; i < count; i++) {
        if (gradeMaster && !hasCurrentSchool && isCurrent) {
            const levelIdGrades = gradeLevelData.map((item) => item.school_level_id);
            const levelIdsSchoolHistory = schoolHistories.map(
                (item) => item.schoolLevel.school_level_id
            );
            schoolLevels = schoolLevels.filter((item) => {
                if (
                    levelIdGrades.includes(item.school_level_id) ||
                    levelIdsSchoolHistory.includes(item.school_level_id)
                )
                    return false;
                return true;
            });
        }
        let schoolInfos = await getSchoolInfoBySchoolLevelId(cms, {
            school_level_id: schoolLevels[i].school_level_id,
        });

        while (!arrayHasItem(schoolInfos)) {
            await importLackOfDataMaster(cms, 'School', {
                schoolLevelIdReferences: schoolLevels[i].school_level_id,
            });
            schoolInfos = await getSchoolInfoBySchoolLevelId(cms);
        }

        let schoolCourse = await getSchoolCourseBySchoolId(cms, {
            school_id: schoolInfos[0].school_id,
        });

        while (!arrayHasItem(schoolCourse)) {
            await importLackOfDataMaster(cms, 'School Course', {
                schoolPartnerIdReferences: schoolInfos[0].school_partner_id,
            });

            schoolCourse = await getSchoolCourseBySchoolId(cms, {
                school_id: schoolInfos[0].school_id,
            });
        }

        const schoolHistory: SchoolHistoriesTypes = {
            schoolLevel: schoolLevels[i],
            schoolInfo: schoolInfos[0],
            schoolCourse: schoolCourse[0],
            startDate: new Date(),
            endDate: new Date(),
        };
        schoolHistories.push(schoolHistory);
    }

    return schoolHistories;
}

export async function importLackOfDataMaster(
    cms: CMSInterface,
    entity: UserMasterEntity,
    options?: CreateMasterCSVFileOptionsTypes
) {
    await cms.selectMenuItemInSidebarByAriaLabel('Master Management');
    await createMasterCSVFile(cms, entity, options);
    await schoolAdminOpenMasterImportDialog(cms, entity);
    await schoolAdminSelectMasterCSVFile(cms);
    await clickButtonInNotFullScreenDialogByText(cms, 'Upload file');
}
