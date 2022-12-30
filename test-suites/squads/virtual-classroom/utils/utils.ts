import { ScenarioContext } from '@supports/scenario-context';

import path from 'path';
import { aliasMaterialNamePrefix } from 'test-suites/squads/lesson/common/alias-keys';
import { pollOptionValues } from 'test-suites/squads/virtual-classroom/utils/constants';

export async function retryHelper(params: {
    action: () => Promise<void>;
    retryCount: number;
    errorAction?: () => Promise<void>;
}) {
    const { action, retryCount, errorAction } = params;
    let tempTry = 0;
    while (tempTry < retryCount) {
        tempTry++;
        try {
            await action();
            tempTry = retryCount;
        } catch (e) {
            if (tempTry === retryCount - 1) {
                throw e;
            } else {
                if (errorAction !== null && errorAction !== undefined) {
                    await errorAction();
                }
            }
        }
    }
}

export async function getMaterialNamesFromContext(scenarioContext: ScenarioContext) {
    return scenarioContext.getByRegexKeys(aliasMaterialNamePrefix);
}

export function removeExtensionOfFile(fileName: string) {
    return path.parse(fileName).name;
}

export function pollOptionIndex(option: string): number {
    for (let i = 0; i < pollOptionValues.length; i++) {
        if (pollOptionValues[i] === option) {
            return i;
        }
    }
    throw 'Poll Option is not valid';
}
