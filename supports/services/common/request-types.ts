import {
    Paging as ProtoPaging,
    CommonFilter as ProtoCommonFilter,
} from 'manabuf/common/v1/requests_pb';

export declare namespace NsCommonRequest {
    export type Paging = ProtoPaging.AsObject;

    export type CommonFilter = ProtoCommonFilter.AsObject;
}

export default NsCommonRequest;
