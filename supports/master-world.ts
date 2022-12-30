import { setWorldConstructor, World, setDefaultTimeout, IWorldOptions } from '@cucumber/cucumber';
import { TestStepResultStatus } from '@cucumber/messages';

import { CMS } from '@supports/cms-world';
import { Learner } from '@supports/learner-world';
import { Teacher } from '@supports/teacher-world';

import { IMasterWorld } from './app-types';
import { ScenarioContext } from './scenario-context';
import { UnleashAdmin } from './unleash-world';

declare module '@cucumber/cucumber' {
    interface IWorld extends IMasterWorld {}
}

export class MasterWorld extends World implements IMasterWorld {
    readonly cms!: CMS;
    readonly cms2!: CMS;
    readonly cms3!: CMS;
    readonly cms4!: CMS;
    readonly teacher!: Teacher;
    readonly teacher2!: Teacher;
    readonly learner!: Learner;
    readonly learner2!: Learner;
    readonly learner3!: Learner;
    /// Should we create learnerApp and learnerWeb?
    /// Web and app have difference UXs, the implementation code should be difference
    /// Also should we rename learner2 into parent?
    readonly parent!: Learner;
    readonly parent2!: Learner;
    readonly unleashAdmin!: UnleashAdmin;
    scenario: ScenarioContext;
    counter = 0;
    options: IWorldOptions;
    /**
     * constructor
     * @param options
     */
    constructor(options: IWorldOptions) {
        super(options);
        this.options = options;
        this.scenario = new ScenarioContext();
    }

    /**
     * @param message
     * @param status
     * @returns {Promise<void>}: connect
     */
    public attachMessageAndStatusInstance = async (
        message: string,
        status: TestStepResultStatus
    ): Promise<void> => {
        await this.attach(
            JSON.stringify({ event: 'attach_message_instance', message: message, status: status }),
            'application/json'
        );
    };
}

const defaultTimeout = 60 * 1000;
setWorldConstructor(MasterWorld);
setDefaultTimeout(defaultTimeout);
