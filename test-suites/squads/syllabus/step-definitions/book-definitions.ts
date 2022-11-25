import { CMSInterface } from '@supports/app-types';

import { getBOBookDetailUrl } from './utils/book';

export const schoolAdminWaitingBookDetailPage = async (cms: CMSInterface, bookName: string) => {
    // Wait loading book detail page
    await cms.waitingForLoadingIcon();

    await cms.assertThePageTitle(bookName);
};

export const schoolAdminIsOnBookDetailPageByUrl = async (
    cms: CMSInterface,
    book: { id: string; name: string }
) => {
    const cmsPage = cms.page!;
    const { id, name } = book;
    const url = getBOBookDetailUrl(id);

    await cmsPage.goto(url);

    // Wait loading BO
    await cms.waitingForLoadingIcon();

    await schoolAdminWaitingBookDetailPage(cms, name);
};
