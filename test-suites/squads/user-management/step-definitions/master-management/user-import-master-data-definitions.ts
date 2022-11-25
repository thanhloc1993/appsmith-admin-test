import {
    buttonActionDropdown,
    buttonActionDropdownItem,
    buttonActionDropdownRoleMenu,
    buttonSelectMasterDropdown,
    uploadInput,
} from '@user-common/cms-selectors/master-management';
import { chooseAutocompleteOptionByExactText } from '@user-common/utils/autocomplete-actions';
import { clickButtonInNotFullScreenDialogByText } from '@user-common/utils/click-actions';

import { CMSInterface } from '@supports/app-types';
import { FileTypes } from '@supports/types/cms-types';

import { FileCSV } from '../common/constants/csv-file';
import { UserMasterEntity, UserMasterInvalidCondition } from '../common/types/bdd';
import {
    createSchoolLevelCSVData,
    createSchoolInfoCSVData,
    createSchoolCourseCSVData,
    createSchoolLevelGradeCSVData,
    createUserTagCSVData,
    createBankCSVData,
    createBankBranchCSVData,
    createTimesheetConfigCSVData,
} from './user-import-master-data-utils';
import {
    writeDownloadFileSync,
    convertCSVStringToBase64,
    withDownloadPath,
    randomOneOfStringType,
    convertToCSVString,
} from 'step-definitions/utils';

export type SchoolLevelGradePropsTypes = {
    schoolLevel?: string;
    gradeId?: string;
};

export type UserTagReferences = {
    userTagType?: number;
    tagLength?: number;
};

export type CreateMasterCSVFileOptionsTypes = {
    invalidCondition?: UserMasterInvalidCondition;
    schoolLevelIdReferences?: string;
    schoolPartnerIdReferences?: string;
    schoolLevelGradeReferences?: SchoolLevelGradePropsTypes;
    userTagReferences?: UserTagReferences;
};

let masterCSVFileName = '';

export async function createMasterCSVFile(
    cms: CMSInterface,
    entity: UserMasterEntity,
    options?: CreateMasterCSVFileOptionsTypes
) {
    let csvData;
    let csvName = '';

    switch (entity) {
        case 'School Level':
            csvData = await createSchoolLevelCSVData(cms, options?.invalidCondition);
            csvName = 'school-level';
            break;
        case 'School':
            csvData = await createSchoolInfoCSVData(
                cms,
                options?.invalidCondition,
                options?.schoolLevelIdReferences
            );
            csvName = 'school-info';
            break;
        case 'School Course':
            csvData = await createSchoolCourseCSVData(
                cms,
                options?.invalidCondition,
                options?.schoolPartnerIdReferences
            );
            csvName = 'school-course';
            break;
        case 'School Level Grade':
            csvData = await createSchoolLevelGradeCSVData(
                cms,
                options?.invalidCondition,
                options?.schoolLevelGradeReferences
            );
            csvName = 'school-level-grade';
            break;
        case 'User Tag':
            csvData = await createUserTagCSVData(
                cms,
                options?.invalidCondition,
                options?.userTagReferences
            );
            csvName = 'user-tag';
            break;
        case 'Bank':
            csvData = await createBankCSVData(cms, options?.invalidCondition);
            csvName = 'bank';
            break;
        case 'Bank Branch':
            csvData = await createBankBranchCSVData(cms, options?.invalidCondition);
            csvName = 'bank-branch';
            break;
        case 'Timesheet Config':
            csvData = createTimesheetConfigCSVData(options?.invalidCondition);
            csvName = 'timesheet-config';
            break;
        default:
            break;
    }

    await cms.attach(`Master ${entity} raw data:${JSON.stringify(csvData)}`);

    const csvString = convertToCSVString(csvData || []);

    const uniqueKey = new Date().getTime().toString();
    masterCSVFileName = csvName + uniqueKey + FileCSV.EXT;

    writeDownloadFileSync(masterCSVFileName, csvString);

    await cms.attach(convertCSVStringToBase64(csvString), FileTypes.CSV);
}

export async function schoolAdminCreateValidMasterCSVFile(
    cms: CMSInterface,
    entity: UserMasterEntity
) {
    await cms.instruction(`Creating valid master ${entity} CSV file`, async function () {
        await createMasterCSVFile(cms, entity);
    });
}

export async function schoolAdminCreateInvalidMasterCSVFile(
    cms: CMSInterface,
    entity: UserMasterEntity,
    condition: UserMasterInvalidCondition
) {
    const invalidCondition = randomOneOfStringType<UserMasterInvalidCondition>(condition);

    await cms.instruction(
        `Creating invalid master ${entity} CSV file with condition: ${invalidCondition}`,
        async function () {
            await createMasterCSVFile(cms, entity, { invalidCondition });
        }
    );
}

export async function schoolAdminOpenMasterImportDialog(
    cms: CMSInterface,
    entity: UserMasterEntity
) {
    const page = cms.page!;
    const masterDropdownButton = page.locator(buttonSelectMasterDropdown);
    await cms.instruction(
        `Select ${entity} in Master Management dropdown options`,
        async function () {
            await masterDropdownButton.click();
            await chooseAutocompleteOptionByExactText(cms, entity);
        }
    );

    await cms.instruction('Select Import Data option', async function () {
        await page?.locator(buttonActionDropdown).click();
        const popover = page.locator(buttonActionDropdownRoleMenu);
        await popover?.locator(buttonActionDropdownItem('IMPORT')).click();
    });
}

export async function schoolAdminSelectMasterCSVFile(cms: CMSInterface) {
    const pathCSV = withDownloadPath(masterCSVFileName);

    await cms.page?.setInputFiles(uploadInput, pathCSV);
}

export async function schoolAdminImportsTheMasterFile(cms: CMSInterface, entity: UserMasterEntity) {
    await cms.instruction(`School admin open master ${entity} import dialog`, async function () {
        await schoolAdminOpenMasterImportDialog(cms, entity);
    });

    await cms.instruction(`School admin selects master ${entity} CSV file`, async function () {
        await schoolAdminSelectMasterCSVFile(cms);
    });

    await clickButtonInNotFullScreenDialogByText(cms, 'Upload file');
}
