import { Given, When } from '@cucumber/cucumber';

import { UserMasterEntity, UserMasterInvalidCondition } from '../common/types/bdd';
import {
    schoolAdminCreateValidMasterCSVFile,
    schoolAdminCreateInvalidMasterCSVFile,
    schoolAdminImportsTheMasterFile,
} from './user-import-master-data-definitions';

Given(
    'school admin has created a valid master {string} file',
    async function (entity: UserMasterEntity) {
        await schoolAdminCreateValidMasterCSVFile(this.cms, entity);
    }
);

Given(
    'school admin has created a invalid master {string} file with {string}',
    async function (entity: UserMasterEntity, condition: UserMasterInvalidCondition) {
        await schoolAdminCreateInvalidMasterCSVFile(this.cms, entity, condition);
    }
);

When('school admin imports the master {string} file', async function (entity: UserMasterEntity) {
    await schoolAdminImportsTheMasterFile(this.cms, entity);
});
