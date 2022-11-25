import { CreateEntryExitRequest } from 'manabuf/entryexitmgmt/v1/entry_exit_pb';

declare namespace NsEntryExitService {
    export interface CreateEntryExit extends CreateEntryExitRequest.AsObject {}
}

export default NsEntryExitService;
