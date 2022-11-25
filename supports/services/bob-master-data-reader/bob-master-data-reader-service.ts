import { callGRPC } from '../grpc/grpc';
import {
    RetrieveLocationsRequest,
    RetrieveLocationsResponse,
    RetrieveLocationTypesRequest,
    RetrieveLocationTypesResponse,
    RetrieveLowestLevelLocationsRequest,
    RetrieveLowestLevelLocationsResponse,
} from 'manabuf/bob/v1/masterdata_pb';

export default class MasterReaderService {
    static serviceName = 'bob.v1.MasterDataReaderService';

    static async retrieveLowestLocations(
        token: string,
        locationName?: string
    ): Promise<{
        response: RetrieveLowestLevelLocationsResponse.AsObject | undefined;
    }> {
        const request = new RetrieveLowestLevelLocationsRequest();

        if (locationName) request.setName(locationName);

        const response = await callGRPC<
            RetrieveLowestLevelLocationsRequest,
            RetrieveLowestLevelLocationsResponse
        >({
            serviceName: this.serviceName,
            methodName: 'RetrieveLowestLevelLocations',
            request,
            token,
            requestType: RetrieveLowestLevelLocationsRequest,
            responseType: RetrieveLowestLevelLocationsResponse,
        });

        return { response: response.message?.toObject() };
    }

    static async retrieveLocations(token: string): Promise<{
        response: RetrieveLocationsResponse.AsObject | undefined;
    }> {
        const request = new RetrieveLocationsRequest();

        const response = await callGRPC<RetrieveLocationsRequest, RetrieveLocationsResponse>({
            serviceName: this.serviceName,
            methodName: 'RetrieveLocations',
            request,
            token,
            requestType: RetrieveLocationsRequest,
            responseType: RetrieveLocationsResponse,
        });

        return { response: response.message?.toObject() };
    }

    static async retrieveLocationTypes(token: string): Promise<{
        response: RetrieveLocationTypesResponse.AsObject | undefined;
    }> {
        const request = new RetrieveLocationTypesRequest();

        const response = await callGRPC<
            RetrieveLocationTypesRequest,
            RetrieveLocationTypesResponse
        >({
            serviceName: this.serviceName,
            methodName: 'RetrieveLocationTypes',
            request,
            token,
            requestType: RetrieveLocationTypesRequest,
            responseType: RetrieveLocationTypesResponse,
        });

        return { response: response.message?.toObject() };
    }
}
