import { Strategy } from 'unleash-client';

export class EnvironmentStrategy extends Strategy {
    constructor() {
        super('strategy_environment');
    }

    isEnabled(parameters: any, context: any): boolean {
        return parameters.environments.split(',').includes(context.env);
    }
}

export class OrganizationStrategy extends Strategy {
    constructor() {
        super('strategy_organization');
    }

    isEnabled(parameters: any, context: any): boolean {
        return parameters.organizations.split(',').includes(context.org);
    }
}
