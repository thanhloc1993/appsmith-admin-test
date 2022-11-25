import { getTestId } from './cms-keys';

export const locationsLowestLevelAutocomplete = getTestId(
    'LocationsLowestLevelAutocompleteHF__autocomplete'
);

export const locationsLowestLevelAutocompleteId =
    '[id="LocationsLowestLevelAutocompleteHF__autocomplete"]';

export const createOrderFormButtonAdd = getTestId('TableAddDeleteRow__addButton');
export const tableHeader = getTestId('TableBase__header');
export const productAutocomplete = getTestId('ProductAutocompleteWithIdsHF__autocomplete');
export const discountAutocomplete = getTestId('DiscountsAutocompleteHF__autocomplete');

export const itemListBillingDate = getTestId('ProductListItemDetails__billingDate');

export const createOrderFormCommentTextarea = getTestId('CommentSection__commentInput');
export const createOrderButtonSubmit = getTestId('OrderUpsertDialogFooter__buttonSubmit');

export const createOrderBilledAtOrderProductSection = getTestId(
    'BilledAtOrderProduct__productContainer'
);

export const createOrderBilledAtOrderDiscountSection = getTestId(
    'BilledAtOrderProduct__discountContainer'
);
export const createOrderBilledAtOrderSubTotalSection = getTestId('BilledAtOrderList__subtotal');
export const createOrderBilledAtOrderTaxInclusionsSection = getTestId(
    'BilledAtOrderList__taxInclusions'
);

export const createOrderBilledAtOrderTotalSection = getTestId('BilledAtOrderList__total');

export const billedAtOrderItemContainer = getTestId('BilledAtOrderItem__container');
export const billedAtOrderItemName = getTestId('BilledAtOrderItem__name');
export const billedAtOrderItemPrice = getTestId('BilledAtOrderItem__price');
export const billedAtOrderSubTotal = getTestId('BilledAtOrderList__subtotal');
export const billedAtOrderTotal = getTestId('BilledAtOrderList__total');

export const paymentNoDataMessage = getTestId('NoData__message');
export const paymentTableNoDataMessage = getTestId('TableBase__noDataMessage');

export const billAtOrderWithNoInfo = getTestId('BilledAtOrderSection__noDataContainer');
export const upcomingBillingSection = getTestId('UpcomingBillingList__container');
export const upcomingBillingProductName = getTestId('UpcomingBillingProduct__name');
export const upcomingBillingProductAmount = getTestId('UpcomingBillingProduct__price');
export const upcomingBillingProductDiscount = getTestId('UpcomingBillingProduct__discount');
export const upcomingBillingProductBillingDate = getTestId('UpcomingBillingProduct__billingDate');
