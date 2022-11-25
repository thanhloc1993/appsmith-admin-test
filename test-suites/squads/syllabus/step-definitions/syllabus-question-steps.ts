import { Given } from '@cucumber/cucumber';

import { LOType } from '@supports/app-types';

import { aliasLONameSelected, aliasLOTypeSelected } from './alias-keys/syllabus';
import { examLOQuestionsTab } from './cms-selectors/exam-lo';
import {
    schoolAdminChooseAddQuestionButtonByLOType,
    schoolAdminWaitingQuizTableInTheLODetail,
    schoolAdminWaitingUpsertQuestionDialog,
} from './syllabus-question-utils';
import { getConvertedStringType, mappedLOTypeWithAliasStringName } from './syllabus-utils';
import { schoolAdminClickLOByName } from './syllabus-view-task-assignment-definitions';

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

            if (loType === 'exam LO') await this.cms.page?.click(examLOQuestionsTab);

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
    this.scenario.set(aliasLOTypeSelected, loType);
});
