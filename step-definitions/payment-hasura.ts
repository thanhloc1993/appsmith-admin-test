import { CMSInterface } from '@supports/app-types';
import { Payment_Eibanam_GetLowestLocationTypesQuery } from '@supports/graphql/bob/bob-types';
import locationTypesBob from '@supports/graphql/bob/location-types.query';
import BillingSchedulePeriodsFatima from '@supports/graphql/fatima/billing-schedule-period.query';
import BillingSchedulesFatima from '@supports/graphql/fatima/billing-schedule.query';
import discountsFatima from '@supports/graphql/fatima/discounts.query';
import {
    Payment_Eibanam_GetBillingScheduleIdByNameQuery,
    Payment_Eibanam_GetBillingSchedulePeriodIdByNameQuery,
    Payment_Eibanam_GetDiscountIdByNameQuery,
    Payment_Eibanam_GetProductIdByNameQuery,
    Payment_Eibanam_GetTaxIdByNameQuery,
} from '@supports/graphql/fatima/fatima-types';
import ProductFatima from '@supports/graphql/fatima/product.query';
import TaxFatima from '@supports/graphql/fatima/tax.query';
import MasterReaderService from '@supports/services/bob-master-data-reader/bob-master-data-reader-service';
import { ArrayElement } from '@supports/types/cms-types';

import {
    GetLowestLocationTypeReturn,
    getPaymentError,
    getPaymentResponseObject,
} from 'step-definitions/payment-utils';
import { pick1stElement } from 'step-definitions/utils';

export const getDiscountIdByName = async (cms: CMSInterface, discountName: string) => {
    const data = await cms.graphqlClient?.callGqlFatima<Payment_Eibanam_GetDiscountIdByNameQuery>({
        body: discountsFatima.getDiscountIdByName({ name: discountName }),
    });

    if (!data)
        throw getPaymentError(
            `getDiscountIdByName DiscountsFatima.getDiscountIdByName ${discountName} is not success: ${JSON.stringify(
                data
            )}`
        );

    const { discount } = getPaymentResponseObject(data);

    if (!discount.length) throw getPaymentError(`${discountName} not found`);

    return discount[0];
};

export const getBillingScheduleIdByName = async (
    cms: CMSInterface,
    billingScheduleName: string
) => {
    const data =
        await cms.graphqlClient?.callGqlFatima<Payment_Eibanam_GetBillingScheduleIdByNameQuery>({
            body: BillingSchedulesFatima.getBillingScheduleIdByName({ name: billingScheduleName }),
        });

    if (!data)
        throw getPaymentError(
            `getBillingScheduleIdByName BillingScheduleFatima.getBillingScheduleIdByName ${billingScheduleName} is not success: ${JSON.stringify(
                data
            )}`
        );

    const { billing_schedule: billingSchedule } = getPaymentResponseObject(data);

    if (!billingSchedule.length) throw getPaymentError(`${billingScheduleName} not found`);

    return billingSchedule[0];
};

export const getBillingSchedulePeriodIdByName = async (
    cms: CMSInterface,
    billingSchedulePeriodName: string
) => {
    const data =
        await cms.graphqlClient?.callGqlFatima<Payment_Eibanam_GetBillingSchedulePeriodIdByNameQuery>(
            {
                body: BillingSchedulePeriodsFatima.getBillingSchedulePeriodIdByName({
                    name: billingSchedulePeriodName,
                }),
            }
        );

    if (!data)
        throw getPaymentError(
            `getBillingSchedulePeriodIdByName BillingSchedulePeriodFatima.getBillingSchedulePeriodIdByName ${billingSchedulePeriodName} is not success: ${JSON.stringify(
                data
            )}`
        );

    const { billing_schedule_period: billingSchedulePeriod } = getPaymentResponseObject(data);

    if (!billingSchedulePeriod.length)
        throw getPaymentError(`${billingSchedulePeriodName} not found`);

    return billingSchedulePeriod[0];
};

export const getTaxIdByName = async (cms: CMSInterface, taxName: string) => {
    const data = await cms.graphqlClient?.callGqlFatima<Payment_Eibanam_GetTaxIdByNameQuery>({
        body: TaxFatima.getTaxIdByName({
            name: taxName,
        }),
    });

    if (!data)
        throw getPaymentError(
            `getTaxIdByName TaxFatima.getTaxIdByName ${taxName} is not success: ${JSON.stringify(
                data
            )}`
        );

    const { tax } = getPaymentResponseObject(data);

    if (!tax.length) throw getPaymentError(`${taxName} not found`);

    return tax[0];
};

export const getProductIdByName = async (cms: CMSInterface, productName: string) => {
    const data = await cms.graphqlClient?.callGqlFatima<Payment_Eibanam_GetProductIdByNameQuery>({
        body: ProductFatima.getProductIdByName({
            name: productName,
        }),
    });

    if (!data)
        throw getPaymentError(
            `getProductIdByName ProductFatima.getProductIdByName ${productName} is not success: ${JSON.stringify(
                data
            )}`
        );

    const { product } = getPaymentResponseObject(data);

    if (!product.length) throw getPaymentError(`${productName} not found`);

    return product[0];
};

export const getLocationByName = async (cms: CMSInterface, locationName: string) => {
    const token = await cms.getToken();
    const { response } = await MasterReaderService.retrieveLowestLocations(token, locationName);

    if (!response)
        throw getPaymentError(
            `getLocationByName MasterReaderService.retrieveLowestLocations with ${locationName} is not success: ${JSON.stringify(
                response
            )}`
        );

    return response.locationsList[0];
};

export const getLowestLocationType = async (
    cms: CMSInterface
): Promise<GetLowestLocationTypeReturn> => {
    const response =
        await cms.graphqlClient?.callGqlBob<Payment_Eibanam_GetLowestLocationTypesQuery>({
            body: locationTypesBob.getLowestLocationTypes(),
        });

    if (!response)
        throw getPaymentError(
            `getLowestLocationTypes locationTypesBob.getLowestLocationTypes is not success: ${JSON.stringify(
                response
            )}`
        );

    const { get_lowest_location_types: locationTypes } = getPaymentResponseObject(response);

    const lowestLocationType =
        pick1stElement<
            ArrayElement<Payment_Eibanam_GetLowestLocationTypesQuery['get_lowest_location_types']>
        >(locationTypes);

    return {
        locationTypeName: lowestLocationType!.name,
        parentLocationTypeName: lowestLocationType!.parent_name,
    };
};
