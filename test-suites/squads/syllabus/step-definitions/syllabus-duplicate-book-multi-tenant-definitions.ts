import { CMSInterface } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

export async function schoolAdminDuplicateBook(cms: CMSInterface) {
    await cms.selectActionButton(ActionOptions.DUPLICATE, {
        target: 'actionPanelTrigger',
    });

    await cms.assertThePageTitle('Book');
}

export async function schoolAdminSeesBookInBookList(cms: CMSInterface, bookName: string) {
    await cms.page!.waitForSelector(`[title="${bookName}"]`);
}

export async function schoolAdminDoesNotSeeBookInBookList(cms: CMSInterface, bookName: string) {
    await cms.page!.waitForSelector(`[title="${bookName}"]`, { state: 'hidden' });
}

export async function schoolAdminDoesNotSeeBookContent(cms: CMSInterface) {
    await cms.page!.waitForSelector(`[data-testid="WrapperPageHeader__root"]`, {
        state: 'hidden',
    });
}
