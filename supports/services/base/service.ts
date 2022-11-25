import { IServiceBase } from './types';

export default abstract class ServiceBase implements IServiceBase {
    abstract serviceName: string;
}
