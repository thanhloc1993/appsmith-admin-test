import { DataTable, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    assertSiblingsInfoOnCMS,
    createStudentsWithMultipleParents,
    mapStudentSiblings,
} from './user-view-siblings-info-with-multiple-parents-definitions';

When(
    'school admin creates new students with multiple parents info',
    async function (this: IMasterWorld, dataTable: DataTable) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        await createStudentsWithMultipleParents(cms, scenarioContext, dataTable);
    }
);

Then(
    'school admin sees siblings info of the student is displayed correctly',
    async function (this: IMasterWorld, dataTable: DataTable) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const studentSiblings = await mapStudentSiblings(dataTable, scenarioContext);
        for (const student of studentSiblings) {
            await assertSiblingsInfoOnCMS(cms, student);
        }
    }
);
