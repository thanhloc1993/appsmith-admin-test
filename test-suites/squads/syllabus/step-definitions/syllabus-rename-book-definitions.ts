import { CMSInterface } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

export async function schoolAdminRenameBook(cms: CMSInterface, bookName: string): Promise<string> {
    const renamedBookName = `Renamed ${bookName}`;

    await cms.selectActionButton(ActionOptions.EDIT, {
        target: 'actionPanelTrigger',
    });

    await cms.page!.fill('#name', renamedBookName);
    await cms.selectActionButton(ActionOptions.SAVE);

    return renamedBookName;
}
