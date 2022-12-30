import { When } from '@cucumber/cucumber';

import { deleteOneTimeMaterialAtIndex } from './payment-remove-one-time-material-on-product-list-definitions';

When('school admin deletes {string}', async function (productAlias: string) {
    const cms = this.cms;
    const scenario = this.scenario;

    await deleteOneTimeMaterialAtIndex(cms, scenario, productAlias);
});
