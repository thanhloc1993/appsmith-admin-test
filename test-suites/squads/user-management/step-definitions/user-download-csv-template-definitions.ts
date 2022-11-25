import { templateFileDownloadButton } from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { ActionOptions, FileTypes } from '@supports/types/cms-types';

import path from 'path';
import { readDownloadFileSync } from 'step-definitions/utils';
import { convertCSVStringToBase64, downloadPath } from 'step-definitions/utils';

export async function selectImportParents(cms: CMSInterface) {
    await cms.instruction(`School admin selects import parents button`, async function () {
        await cms.selectActionButton(ActionOptions.IMPORT_PARENTS, {
            target: 'actionPanelTrigger',
        });
    });
}

export async function schoolAdminDownloadsCsvTemplate(cms: CMSInterface, fileName: string) {
    const filePath = path.join(downloadPath, fileName);

    const [download] = await Promise.all([
        cms.page?.waitForEvent('download'),
        cms.page?.locator(templateFileDownloadButton).click(),
    ]);

    await download?.saveAs(filePath);
}

export async function schoolAdminVerifiesDownload(cms: CMSInterface, fileName: string) {
    const csv = readDownloadFileSync(fileName);
    await cms.attach(convertCSVStringToBase64(csv.toString()), FileTypes.CSV);
}
