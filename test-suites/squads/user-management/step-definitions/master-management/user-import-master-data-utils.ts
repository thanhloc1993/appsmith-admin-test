import { KeyUserTagType } from '@user-common/types/student';

import { CMSInterface } from '@supports/app-types';
import {
    User_Eibanam_GetListSchoolLevelQuery,
    User_Eibanam_CountSchoolLevelBySequenceQuery,
    User_Eibanam_GetListSchoolInfoQuery,
    User_Eibanam_GetListSchoolCourseQuery,
    User_Eibanam_GetListGradeQuery,
    User_Eibanam_GetListUserTagQuery,
    User_Eibanam_GetTagsByUserTagTypesQuery,
} from '@supports/graphql/bob/bob-types';
import gradeBobQuery from '@supports/graphql/bob/grade.query';
import schoolCourseBobQuery from '@supports/graphql/bob/school-course.query';
import schoolInfoBobQuery from '@supports/graphql/bob/school-info.query';
import schoolLevelBobQuery from '@supports/graphql/bob/school-level.query';
import userTagBobQuery from '@supports/graphql/bob/user-tag.query';
import bankBranchBobQuery from '@supports/graphql/invoicemgmt/bank-branch.query';
import bankBobQuery from '@supports/graphql/invoicemgmt/bank.query';
import {
    Invoice_Eibanam_GetListBankQuery,
    Invoice_Eibanam_GetListBankBranchQuery,
} from '@supports/graphql/invoicemgmt/invoicemgmt-types';

import { UserMasterInvalidCondition } from '../common/types/bdd';
import {
    SchoolLevelGradePropsTypes,
    UserTagReferences,
} from './user-import-master-data-definitions';
import shuffle from 'lodash/shuffle';
import { UserTagType } from 'node_modules/manabuf/usermgmt/v2/enums_pb';
import {
    randomInteger,
    getRandomNumber,
    getRandomElement,
    randomString,
    arrayHasItem,
    genId,
    randomEnumKey,
} from 'step-definitions/utils';
import { UserTagTypeNames } from 'test-suites/squads/user-management/step-definitions/student-info/user-tag/type';

export interface SchoolLevelCSV {
    school_level_id: string;
    school_level_name: string;
    sequence: string;
    is_archived: string;
}

export interface SchoolInfoCSV {
    school_id: string;
    school_name: string;
    school_partner_id: string;
    school_level_id: string;
    school_name_phonetic: string;
    address: string;
    is_archived: string;
}

export interface SchoolCourseCSV {
    school_course_id: string;
    school_course_partner_id: string;
    school_course_name: string;
    school_course_name_phonetic: string;
    school_partner_id: string;
    is_archived: string;
}

export interface SchoolLevelGradeCSV {
    school_level_id: string;
    grade_id: string;
}

export interface UserTagCSV {
    tag_id: string;
    tag_partner_id: string;
    tag_name: string;
    type: string;
    is_archived: string;
}

export interface BankCSV {
    bank_id: string;
    bank_code: string;
    bank_name: string;
    bank_phonetic_name: string;
    is_archived: string;
}

export interface BankBranchCSV {
    bank_branch_id: string;
    bank_branch_code: string;
    bank_branch_name: string;
    bank_branch_phonetic_name: string;
    bank_code: string;
    is_archived: string;
}

export interface TimesheetConfigCSV {
    timesheet_config_id: string;
    config_type: string;
    config_value: string;
    is_archived: string;
}

type SchoolLevelGrade = {
    school_level_id: string;
    grade_id: string;
};

type DuplicateType = 'EXISTED IN DATABASE' | 'DUPLICATE ROW';

async function randomDuplicate(cms: CMSInterface): Promise<DuplicateType> {
    const randomNumber = randomInteger(0, 1);
    const duplicateType = randomNumber ? 'EXISTED IN DATABASE' : 'DUPLICATE ROW';
    await cms.attach(
        `Duplicated type: ${
            duplicateType === 'EXISTED IN DATABASE' ? 'existed in our database' : 'duplicate row'
        }`
    );

    return duplicateType;
}

export function getRandomKey() {
    const randomKey = `${getRandomNumber()}-${randomString(5)}`;
    return randomKey;
}

export async function getRandomSchoolLevelSequence(cms: CMSInterface, tempSequenceList: number[]) {
    let randomSequence;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        randomSequence = randomInteger(10000, 999999);
        if (tempSequenceList.includes(randomSequence)) continue;
        const countSchoolLevelResponse =
            await cms.graphqlClient?.callGqlBob<User_Eibanam_CountSchoolLevelBySequenceQuery>({
                body: schoolLevelBobQuery.countBySequence({
                    sequence: randomSequence,
                }),
            });

        if (!countSchoolLevelResponse?.data.school_level_aggregate.aggregate?.count) break;
    }

    return randomSequence;
}

export async function getSchoolLevelList(cms: CMSInterface) {
    const schoolLevelResponse =
        await cms.graphqlClient?.callGqlBob<User_Eibanam_GetListSchoolLevelQuery>({
            body: schoolLevelBobQuery.getList(),
        });

    const schoolLevelList = schoolLevelResponse?.data.school_level || [];

    if (!arrayHasItem(schoolLevelList)) {
        throw Error('Error: Can not get School-Level. Please re-import and try again!');
    }

    return schoolLevelList;
}

export async function getSchoolInfoList(cms: CMSInterface) {
    const schoolInfoResponse =
        await cms.graphqlClient?.callGqlBob<User_Eibanam_GetListSchoolInfoQuery>({
            body: schoolInfoBobQuery.getList(),
        });

    const schoolInfoList = schoolInfoResponse?.data.school_info || [];

    if (!arrayHasItem(schoolInfoList)) {
        throw Error('Error: Can not get School-Info. Please re-import and try again!');
    }

    return schoolInfoList;
}

export async function getSchoolCourseList(cms: CMSInterface) {
    const schoolCourseResponse =
        await cms.graphqlClient?.callGqlBob<User_Eibanam_GetListSchoolCourseQuery>({
            body: schoolCourseBobQuery.getList(),
        });

    const schoolCourseList = schoolCourseResponse?.data.school_course || [];

    if (!arrayHasItem(schoolCourseList)) {
        throw Error('Error: Can not get School-Course. Please re-import and try again!');
    }

    return schoolCourseList;
}

export async function getGradeList(cms: CMSInterface, limit?: number) {
    const gradeResponse = await cms.graphqlClient?.callGqlBob<User_Eibanam_GetListGradeQuery>({
        body: gradeBobQuery.getList({ limit }),
    });

    const gradeList = gradeResponse?.data.grade || [];

    return gradeList;
}

export async function getUserTagList(cms: CMSInterface) {
    const userTagResponse = await cms.graphqlClient?.callGqlBob<User_Eibanam_GetListUserTagQuery>({
        body: userTagBobQuery.getList(),
    });

    const userTagList = userTagResponse?.data.user_tag || [];

    if (!arrayHasItem(userTagList)) {
        throw Error('Error: Can not get User Tag. Please re-import and try again!');
    }

    return userTagList;
}

export async function getUserTagListByType(
    cms: CMSInterface,
    limit?: number,
    userTagType?: KeyUserTagType[]
) {
    const userTagResponse =
        await cms.graphqlClient?.callGqlBob<User_Eibanam_GetTagsByUserTagTypesQuery>({
            body: userTagBobQuery.getListByType({ user_tag_types: userTagType, limit }),
        });

    const userTagList = userTagResponse?.data.user_tag || [];
    return userTagList;
}

export async function getBankList(cms: CMSInterface) {
    const bankResponse = await cms.graphqlClient?.callGqlBob<Invoice_Eibanam_GetListBankQuery>({
        body: bankBobQuery.getList(),
    });

    const bankList = bankResponse?.data.bank || [];

    if (!arrayHasItem(bankList)) {
        throw Error('Error: Can not get Bank. Please re-import and try again!');
    }

    return bankList;
}

export async function getBankBranchList(cms: CMSInterface) {
    const bankBranchResponse =
        await cms.graphqlClient?.callGqlBob<Invoice_Eibanam_GetListBankBranchQuery>({
            body: bankBranchBobQuery.getList(),
        });

    const bankBranchList = bankBranchResponse?.data.bank_branch || [];

    if (!arrayHasItem(bankBranchList)) {
        throw Error('Error: Can not get Bank Branch. Please re-import and try again!');
    }

    return bankBranchList;
}

export async function createSchoolLevelCSVData(
    cms: CMSInterface,
    invalidCondition?: UserMasterInvalidCondition
) {
    const schoolLevels: SchoolLevelCSV[] = [];
    const randomLength = randomInteger(2, 10);
    const randomSequenceList: number[] = [];

    const randomFailedRow = randomInteger(1, randomLength - 1);

    for (let index = 0; index < randomLength; index++) {
        const randomSequence = await getRandomSchoolLevelSequence(cms, randomSequenceList);
        randomSequenceList.push(randomSequence);
        const schoolLevel: SchoolLevelCSV = {
            school_level_id: '',
            school_level_name: `E2E - School Level ${getRandomNumber()}`,
            sequence: `${randomInteger(10000, 999999)}`,
            is_archived: '0',
        };

        if (invalidCondition && index === randomFailedRow) {
            switch (invalidCondition) {
                case 'invalid header':
                    Object.assign(schoolLevel, { invalid_header: 'invalid_header' });
                    break;
                case 'invalid is_archived field':
                    Object.assign(schoolLevel, { is_archived: 'invalid' });
                    break;
                case 'missing required field':
                    Object.assign(schoolLevel, {
                        school_level_name: '',
                        sequence: '',
                        is_archived: '',
                    });
                    break;
                case 'entity_id field does not existed': {
                    const invalidId = genId();
                    Object.assign(schoolLevel, { school_level_id: invalidId });
                    break;
                }
                case 'sequence field is duplicated': {
                    const duplicateType = await randomDuplicate(cms);

                    let duplicatedSequence = '';
                    if (duplicateType === 'EXISTED IN DATABASE') {
                        const schoolLevelList = await getSchoolLevelList(cms);
                        const randomSchoolLevel = getRandomElement(schoolLevelList);
                        duplicatedSequence = randomSchoolLevel.sequence.toString();
                    } else {
                        const prevSchoolLevel = schoolLevels[index - 1];
                        duplicatedSequence = prevSchoolLevel.sequence;
                    }
                    Object.assign(schoolLevel, {
                        school_level_id: duplicatedSequence,
                    });
                    break;
                }
                default:
                    break;
            }
        }

        schoolLevels.push(schoolLevel);
    }
    return schoolLevels;
}

export async function createSchoolInfoCSVData(
    cms: CMSInterface,
    invalidCondition?: UserMasterInvalidCondition,
    schoolLevelIdReferences?: string
) {
    const schoolLevelList = await getSchoolLevelList(cms);

    const schoolInfos: SchoolInfoCSV[] = [];
    const randomLength = randomInteger(2, 10);
    const randomFailedRow = randomInteger(1, randomLength - 1);

    for (let index = 0; index < randomLength; index++) {
        const randomKey = getRandomKey();
        const randomSchoolLevel = getRandomElement(schoolLevelList);

        const schoolInfo: SchoolInfoCSV = {
            school_id: '',
            school_name: `E2E - School ${randomKey}`,
            school_partner_id: `e2e-school-${randomKey}`,
            school_name_phonetic: `E2E - School ${randomKey}`,
            school_level_id: schoolLevelIdReferences || randomSchoolLevel.school_level_id,
            address: `E2E - Address ${randomKey}`,
            is_archived: '0',
        };

        if (invalidCondition && index === randomFailedRow) {
            switch (invalidCondition) {
                case 'invalid header':
                    Object.assign(schoolInfo, { invalid_header: 'invalid_header' });
                    break;
                case 'invalid is_archived field':
                    Object.assign(schoolInfo, { is_archived: 'invalid' });
                    break;
                case 'missing required field':
                    Object.assign(schoolInfo, {
                        school_name: '',
                        school_partner_id: '',
                        school_level_id: '',
                        is_archived: '',
                    });
                    break;
                case 'entity_id field does not existed': {
                    const invalidId = genId();
                    Object.assign(schoolInfo, { school_id: invalidId });
                    break;
                }
                case 'entity_partner_id is duplicated': {
                    const duplicateType = await randomDuplicate(cms);

                    let duplicatedPartnerId = '';
                    if (duplicateType === 'EXISTED IN DATABASE') {
                        const schoolInfoList = await getSchoolInfoList(cms);
                        const randomSchoolInfo = getRandomElement(schoolInfoList);
                        duplicatedPartnerId = randomSchoolInfo.school_partner_id;
                    } else {
                        const prevSchoolInfo = schoolInfos[index - 1];
                        duplicatedPartnerId = prevSchoolInfo.school_partner_id;
                    }
                    Object.assign(schoolInfo, {
                        school_partner_id: duplicatedPartnerId,
                    });
                    break;
                }
                case 'invalid foreign_key': {
                    const invalidId = genId();
                    Object.assign(schoolInfo, {
                        school_level_id: invalidId,
                    });
                    break;
                }
                default:
                    break;
            }
        }

        schoolInfos.push(schoolInfo);
    }

    return schoolInfos;
}

export async function createSchoolCourseCSVData(
    cms: CMSInterface,
    invalidCondition?: UserMasterInvalidCondition,
    schoolPartnerIdReferences?: string
) {
    const schoolInfoList = await getSchoolInfoList(cms);
    const schoolCourses: SchoolCourseCSV[] = [];
    const randomLength = randomInteger(2, 10);
    const randomFailedRow = randomInteger(1, randomLength - 1);

    for (let index = 0; index < randomLength; index++) {
        const randomKey = getRandomKey();
        const randomSchoolInfo = getRandomElement(schoolInfoList);
        const schoolCourse: SchoolCourseCSV = {
            school_course_id: '',
            school_course_name: `E2E - School Course ${randomKey}`,
            school_course_partner_id: `e2e-school-course-${randomKey}`,
            school_course_name_phonetic: `E2E - School Course ${randomKey}`,
            school_partner_id: schoolPartnerIdReferences || randomSchoolInfo.school_partner_id,
            is_archived: '0',
        };

        if (invalidCondition && index === randomFailedRow) {
            switch (invalidCondition) {
                case 'invalid header':
                    Object.assign(schoolCourse, { invalid_header: 'invalid_header' });
                    break;
                case 'invalid is_archived field':
                    Object.assign(schoolCourse, { is_archived: 'invalid' });
                    break;
                case 'missing required field':
                    Object.assign(schoolCourse, {
                        school_course_name: '',
                        school_course_partner_id: '',
                        school_partner_id: '',
                        is_archived: '',
                    });
                    break;
                case 'entity_id field does not existed': {
                    const invalidId = genId();
                    Object.assign(schoolCourse, { school_id: invalidId });
                    break;
                }
                case 'entity_partner_id is duplicated': {
                    const duplicateType = await randomDuplicate(cms);

                    let duplicatedPartnerId = '';
                    if (duplicateType === 'EXISTED IN DATABASE') {
                        const schoolCourseList = await getSchoolCourseList(cms);
                        const randomSchoolCourse = getRandomElement(schoolCourseList);
                        duplicatedPartnerId = randomSchoolCourse.school_course_partner_id;
                    } else {
                        const prevSchoolCourse = schoolCourses[index - 1];
                        duplicatedPartnerId = prevSchoolCourse.school_course_partner_id;
                    }

                    Object.assign(schoolCourse, {
                        school_course_partner_id: duplicatedPartnerId,
                    });
                    break;
                }
                case 'invalid foreign_key': {
                    const invalidId = genId();
                    Object.assign(schoolCourse, {
                        school_partner_id: invalidId,
                    });
                    break;
                }
                default:
                    break;
            }
        }

        schoolCourses.push(schoolCourse);
    }

    return schoolCourses;
}

export async function createSchoolLevelGradeCSVData(
    cms: CMSInterface,
    invalidCondition?: UserMasterInvalidCondition,
    schoolLevelGradeReferences?: SchoolLevelGradePropsTypes
) {
    const schoolLevelList = await getSchoolLevelList(cms);
    const gradeList = await getGradeList(cms);
    const schoolLevelGradeList: SchoolLevelGrade[] = [];

    schoolLevelList.forEach((schoolLevel) => {
        gradeList.forEach((grade) => {
            schoolLevelGradeList.push({
                school_level_id: schoolLevel.school_level_id,
                grade_id: grade.grade_id,
            });
        });
    });

    const maxLength = schoolLevelGradeList.length < 10 ? schoolLevelGradeList.length : 10;
    const schoolLevelGrades: SchoolLevelGradeCSV[] = [];
    const randomLength = schoolLevelGradeReferences ? 1 : randomInteger(1, maxLength);
    const schoolLevelGradeListShuffled = shuffle(schoolLevelGradeList);
    const randomFailedRow = randomInteger(1, randomLength - 1);

    for (let index = 0; index < randomLength; index++) {
        const schoolLevelGradeItem = schoolLevelGradeListShuffled[index];
        const schoolLevelGrade: SchoolLevelGradeCSV = {
            school_level_id:
                schoolLevelGradeReferences?.schoolLevel || schoolLevelGradeItem.school_level_id,
            grade_id: schoolLevelGradeReferences?.gradeId || schoolLevelGradeItem.grade_id,
        };

        if (invalidCondition && index === randomFailedRow) {
            switch (invalidCondition) {
                case 'invalid header':
                    Object.assign(schoolLevelGrade, { invalid_header: 'invalid_header' });
                    break;
                case 'missing required field':
                    Object.assign(schoolLevelGrade, {
                        school_level_id: '',
                        grade_id: '',
                    });
                    break;
                case 'invalid foreign_key': {
                    const invalidId = genId();
                    Object.assign(schoolLevelGrade, {
                        school_level_id: invalidId,
                        grade_id: invalidId,
                    });
                    break;
                }
                default:
                    break;
            }
        }

        schoolLevelGrades.push(schoolLevelGrade);
    }

    return schoolLevelGrades;
}

export async function createUserTagCSVData(
    cms: CMSInterface,
    invalidCondition?: UserMasterInvalidCondition,
    userTagReferences?: UserTagReferences
) {
    const userTags: UserTagCSV[] = [];
    const randomLength = randomInteger(2, 10);
    const _tagLength = userTagReferences?.tagLength ? userTagReferences.tagLength : randomLength;
    const randomFailedRow = randomInteger(1, _tagLength - 1);

    for (let index = 0; index < _tagLength; index++) {
        const randomUserTagType = UserTagType[randomEnumKey(UserTagType, ['USER_TAG_TYPE_NONE'])];
        const _userTagType = userTagReferences?.userTagType
            ? userTagReferences.userTagType
            : randomUserTagType;

        const randomKey = getRandomKey();

        const userTag: UserTagCSV = {
            tag_id: '',
            tag_name: `E2E - ${UserTagTypeNames[_userTagType - 1]} ${randomKey}`,
            tag_partner_id: `e2e-user-tag-${randomKey}`,
            type: _userTagType.toString(),
            is_archived: '0',
        };

        if (invalidCondition && index === randomFailedRow) {
            switch (invalidCondition) {
                case 'invalid header':
                    Object.assign(userTag, { invalid_header: 'invalid_header' });
                    break;
                case 'invalid is_archived field':
                    Object.assign(userTag, { is_archived: 'invalid' });
                    break;
                case 'missing required field':
                    Object.assign(userTag, {
                        tag_name: '',
                        tag_partner_id: '',
                        type: '',
                        is_archived: '',
                    });
                    break;
                case 'entity_id field does not existed': {
                    const invalidId = genId();
                    Object.assign(userTag, { tag_id: invalidId });
                    break;
                }
                case 'entity_partner_id is duplicated': {
                    const duplicateType = await randomDuplicate(cms);

                    let duplicatedPartnerId = '';
                    if (duplicateType === 'EXISTED IN DATABASE') {
                        const userTagList = await getUserTagList(cms);
                        const randomUserTag = getRandomElement(userTagList);
                        duplicatedPartnerId = randomUserTag.user_tag_partner_id;
                    } else {
                        const prevUserTag = userTags[index - 1];
                        duplicatedPartnerId = prevUserTag.tag_partner_id;
                    }

                    Object.assign(userTag, {
                        tag_partner_id: duplicatedPartnerId,
                    });
                    break;
                }
                case 'invalid user_tag_type field':
                    Object.assign(userTag, { type: 'invalid' });
                    break;
                default:
                    break;
            }
        }

        userTags.push(userTag);
    }

    return userTags;
}

export async function createBankCSVData(
    cms: CMSInterface,
    invalidCondition?: UserMasterInvalidCondition
) {
    const banks: BankCSV[] = [];
    const randomLength = randomInteger(2, 10);
    const randomFailedRow = randomInteger(1, randomLength - 1);

    for (let index = 0; index < randomLength; index++) {
        const randomKey = getRandomKey();

        const bank: BankCSV = {
            bank_id: '',
            bank_code: `e2e-bank-${randomKey}`,
            bank_name: `E2E - Bank ${randomKey}`,
            bank_phonetic_name: `E2E - BANK ${randomKey.toUpperCase()}`,
            is_archived: '0',
        };

        if (invalidCondition && index === randomFailedRow) {
            switch (invalidCondition) {
                case 'invalid header':
                    Object.assign(bank, { invalid_header: 'invalid_header' });
                    break;
                case 'invalid is_archived field':
                    Object.assign(bank, { is_archived: 'invalid' });
                    break;
                case 'missing required field':
                    Object.assign(bank, {
                        bank_code: '',
                        bank_name: '',
                        bank_phonetic_name: '',
                        is_archived: '',
                    });
                    break;
                case 'entity_id field does not existed': {
                    const invalidId = genId();
                    Object.assign(bank, { bank_id: invalidId });
                    break;
                }
                case 'bank_code is duplicated': {
                    const duplicateType = await randomDuplicate(cms);

                    let duplicatedBankCode = '';
                    if (duplicateType === 'EXISTED IN DATABASE') {
                        const bankList = await getBankList(cms);
                        const randomBank = getRandomElement(bankList);
                        duplicatedBankCode = randomBank.bank_code;
                    } else {
                        const prevBank = banks[index - 1];
                        duplicatedBankCode = prevBank.bank_code;
                    }

                    Object.assign(bank, {
                        bank_code: duplicatedBankCode,
                    });
                    break;
                }
                case 'invalid bank_phonetic_name':
                    Object.assign(bank, { bank_phonetic_name: 'invalid' });
                    break;
                default:
                    break;
            }
        }

        banks.push(bank);
    }

    return banks;
}

export async function createBankBranchCSVData(
    cms: CMSInterface,
    invalidCondition?: UserMasterInvalidCondition
) {
    const bankList = await getBankList(cms);
    const bankBranches: BankBranchCSV[] = [];
    const randomLength = randomInteger(2, 10);
    const randomFailedRow = randomInteger(1, randomLength - 1);

    for (let index = 0; index < randomLength; index++) {
        const randomKey = getRandomKey();
        const randomBank = getRandomElement(bankList);

        const bankBranch: BankBranchCSV = {
            bank_branch_id: '',
            bank_branch_code: `e2e-bank-branch-${randomKey}`,
            bank_branch_name: `E2E - Bank Branch ${randomKey}`,
            bank_branch_phonetic_name: `E2E - BANK BRANCH ${randomKey.toUpperCase()}`,
            bank_code: randomBank.bank_code,
            is_archived: '0',
        };

        if (invalidCondition && index === randomFailedRow) {
            switch (invalidCondition) {
                case 'invalid header':
                    Object.assign(bankBranch, { invalid_header: 'invalid_header' });
                    break;
                case 'invalid is_archived field':
                    Object.assign(bankBranch, { is_archived: 'invalid' });
                    break;
                case 'missing required field':
                    Object.assign(bankBranch, {
                        bank_branch_code: '',
                        bank_branch_name: '',
                        bank_branch_phonetic_name: '',
                        bank_code: '',
                        is_archived: '',
                    });
                    break;
                case 'entity_id field does not existed': {
                    const invalidId = genId();
                    Object.assign(bankBranch, { bank_branch_id: invalidId });
                    break;
                }
                case 'bank_branch_code is duplicated': {
                    const prevBankBranch = bankBranches[index - 1];
                    const duplicatedBankBranchCode = prevBankBranch.bank_branch_code;
                    const duplicatedBankCode = prevBankBranch.bank_code;
                    Object.assign(bankBranch, {
                        bank_branch_code: duplicatedBankBranchCode,
                        bank_code: duplicatedBankCode,
                    });
                    break;
                }
                case 'invalid bank_branch_phonetic_name':
                    Object.assign(bankBranch, { bank_branch_phonetic_name: 'invalid' });
                    break;
                case 'invalid foreign_key': {
                    const invalidId = genId();
                    Object.assign(bankBranch, {
                        bank_code: invalidId,
                    });
                    break;
                }
                default:
                    break;
            }
        }

        bankBranches.push(bankBranch);
    }

    return bankBranches;
}

export function createTimesheetConfigCSVData(invalidCondition?: UserMasterInvalidCondition) {
    const timesheetConfigs: TimesheetConfigCSV[] = [];
    const randomLength = randomInteger(2, 10);
    const randomFailedRow = randomInteger(1, randomLength - 1);

    for (let index = 0; index < randomLength; index++) {
        const randomKey = getRandomKey();

        const timesheetConfig: TimesheetConfigCSV = {
            timesheet_config_id: '',
            config_type: '0', // OTHER_WORKING_HOURS
            config_value: `E2E - Timesheet Config ${randomKey}`,
            is_archived: '0',
        };

        if (invalidCondition && index === randomFailedRow) {
            switch (invalidCondition) {
                case 'invalid header':
                    Object.assign(timesheetConfig, { invalid_header: 'invalid_header' });
                    break;
                case 'invalid is_archived field':
                    Object.assign(timesheetConfig, { is_archived: 'invalid' });
                    break;
                case 'missing required field':
                    Object.assign(timesheetConfig, {
                        config_type: '',
                        config_value: '',
                        is_archived: '',
                    });
                    break;
                case 'entity_id field does not existed': {
                    const invalidId = genId();
                    Object.assign(timesheetConfig, { timesheet_config_id: invalidId });
                    break;
                }
                case 'invalid config_type field':
                    Object.assign(timesheetConfig, { config_type: 'invalid' });
                    break;
                default:
                    break;
            }
        }

        timesheetConfigs.push(timesheetConfig);
    }

    return timesheetConfigs;
}
