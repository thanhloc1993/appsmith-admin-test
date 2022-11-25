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
    readonly cms: CMS;
    readonly cms2: CMS;
    readonly cms3: CMS;
    readonly cms4: CMS;
    readonly teacher: Teacher;
    readonly teacher2: Teacher;
    readonly learner: Learner;
    readonly learner2: Learner;
    readonly learner3: Learner;
    /// Should we create learnerApp and learnerWeb?
    /// Web and app have difference UXs, the implementation code should be difference
    /// Also should we rename learner2 into parent?
    readonly parent: Learner;
    readonly parent2: Learner;
    readonly unleashAdmin: UnleashAdmin;
    scenario: ScenarioContext;
    counter = 0;
    /**
     * constructor
     * @param options
     */
    constructor(options: IWorldOptions) {
        super(options);

        this.cms = new CMS(options, {
            driverName: 'cms',
        });
        this.cms2 = new CMS(options, {
            driverName: 'cms_2',
        });
        this.cms3 = new CMS(options, {
            driverName: 'cms_3',
        });
        this.cms4 = new CMS(options, {
            driverName: 'cms_4',
        });
        this.teacher = new Teacher(options, {
            driverName: 'teacher_1',
        });
        this.teacher2 = new Teacher(options, {
            driverName: 'teacher_2',
        });
        this.learner = new Learner(options, {
            driverName: 'learner_1',
        });
        this.learner2 = new Learner(options, {
            driverName: 'learner_2',
        });
        this.learner3 = new Learner(options, {
            driverName: 'learner_3',
        });
        this.parent = new Learner(options, {
            driverName: 'parent_1',
        });
        this.parent2 = new Learner(options, {
            driverName: 'parent_2',
        });
        this.unleashAdmin = new UnleashAdmin(options, {
            driverName: 'unleash_admin',
        });
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
