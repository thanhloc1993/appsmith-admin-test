import { CMSInterface } from '@supports/app-types';

import * as PaymentKeys from 'step-definitions/cms-selectors/payment';

export const clickSubmitOrder = async (cms: CMSInterface) => {
    await cms.instruction('Click Submit Order', async () => {
        await cms.page?.click(PaymentKeys.createOrderButtonSubmit);
    });
};
