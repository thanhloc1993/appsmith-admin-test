import { Given } from '@cucumber/cucumber';

import { LOType } from '@supports/app-types';

import { aliasLOName, aliasLONameSelected, aliasLOTypeSelected } from './alias-keys/syllabus';
import {
    schoolAdminChooseAddQuestionButtonByLOType,
    schoolAdminWaitingQuizTableInTheLODetail,
    schoolAdminWaitingUpsertQuestionDialog,
} from './syllabus-question-utils';
import { getConvertedStringType, mappedLOTypeWithAliasStringName } from './syllabus-utils';
import { schoolAdminClickLOByName } from './syllabus-view-task-assignment-definitions';
import { cmsExamDetail } from 'test-suites/squads/syllabus/cms-locators/exam-detail';

Given('school admin goes to create question page in {string}', async function (loTypeCase: string) {
    const loType = getConvertedStringType<LOType>(loTypeCase);

    const selectedLOName = this.scenario.get<string>(mappedLOTypeWithAliasStringName[loType]);

    await this.cms.instruction(
        `school admin goes to ${loType} ${selectedLOName} detail page`,
        async () => {
            await schoolAdminClickLOByName(this.cms, selectedLOName);

            // Wait loading the LO detail page
            await this.cms.waitingForLoadingIcon();
            // Wait loading the breadcrumb
            await this.cms.waitForSkeletonLoading();

            if (loType === 'exam LO') {
                await cmsExamDetail.selectQuestionTab(this.cms.page!);
            }

            await schoolAdminWaitingQuizTableInTheLODetail(this.cms);
        }
    );

    await this.cms.instruction(`school admin clicks on add new question in ${loType}`, async () => {
        await schoolAdminChooseAddQuestionButtonByLOType(this.cms, loType);
    });

    await this.cms.instruction('school admin sees create question page', async () => {
        await schoolAdminWaitingUpsertQuestionDialog(this.cms);
    });

    this.scenario.set(aliasLONameSelected, selectedLOName);
    this.scenario.set(aliasLOName, selectedLOName); //TODO: Remove to set selected LO in aliasLOName
    this.scenario.set(aliasLOTypeSelected, loType);
});
