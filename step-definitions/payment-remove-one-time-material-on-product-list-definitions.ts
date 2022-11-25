import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { ActionOptions } from '@supports/types/cms-types';

import { aliasProductData } from './alias-keys/payment';
import { tableBaseRowWithId } from './cms-selectors/cms-keys';
import { ProductData } from './payment-one-time-material-definition';

export const deleteOneTimeMaterialAtIndex = async (
    cms: CMSInterface,
    context: ScenarioContext,
    productAlias: string
) => {
    const productsData: ProductData = context.get(aliasProductData);

    const productIndex = productsData.products.findIndex(
        (product) => product.alias === productAlias
    );

    await cms.selectActionButton(ActionOptions.DELETE, {
        target: 'actionPanelTrigger',
        wrapperSelector: tableBaseRowWithId(productIndex),
    });

    context.set(aliasProductData, {
        ...productsData,
        products: productsData.products.filter((product) => product.alias !== productAlias),
    });
};
