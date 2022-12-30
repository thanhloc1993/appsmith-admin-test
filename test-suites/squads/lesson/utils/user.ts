import { ScenarioContext } from '@supports/scenario-context';

import { UserProfileEntity } from 'test-suites/squads/lesson/common/lesson-profile-entity';

export function getUsersFromContextByRegexKeys(
    scenarioContext: ScenarioContext,
    prefixAlias: string
): UserProfileEntity[] {
    return scenarioContext.getByRegexKeys(prefixAlias);
}
