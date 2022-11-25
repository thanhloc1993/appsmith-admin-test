import { callGRPC } from '../grpc/grpc';
import { GetBasicProfileRequest, GetBasicProfileResponse } from 'manabie-bob/user_pb';

export class BobUserReaderService {
    readonly serviceName = 'manabie.bob.UserService';

    async retrieveBasicProfile(
        token: string,
        userId: string
    ): Promise<{ response?: GetBasicProfileResponse.AsObject }> {
        const request = new GetBasicProfileRequest();
        request.setUserIdsList([userId]);

        const response = await callGRPC<GetBasicProfileRequest, GetBasicProfileResponse>({
            serviceName: this.serviceName,
            methodName: 'GetBasicProfile',
            request,
            token,
            requestType: GetBasicProfileRequest,
            responseType: GetBasicProfileResponse,
        });

        return { response: response.message?.toObject() };
    }
}
