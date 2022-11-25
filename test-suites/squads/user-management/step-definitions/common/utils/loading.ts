import { lookingForIcon } from '@user-common/cms-selectors/students-page';

import { Locator } from 'playwright';

import { CMSInterface } from '@supports/app-types';

export async function schoolAdminWaitForLoadingInTable(
    cms: CMSInterface,
    skeletonId: string,
    wrapper?: Locator
) {
    await cms.instruction('School admin does not see the skeletons in table', async function () {
        await cms.page?.locator(lookingForIcon).isHidden();

        let loading = cms.page!.getByTestId(skeletonId);
        if (wrapper) {
            loading = wrapper.getByTestId(skeletonId);
        }
        const count = await loading.count();
        for (let i = 0; i < count; i++) {
            await loading.nth(i).isHidden();
        }
    });
}
