import { ScenarioContextInterface } from './app-types';

export class ScenarioContext implements ScenarioContextInterface {
    context: ScenarioContextInterface['context'] = new Map();

    /**
     * set value to context
     * @param key
     * @param value
     * @param options
     * @returns {Map}: ScenarioContextInterface['context']
     */
    set = <T = any>(
        key: string,
        value: T,
        options: {
            ignoreStrictData?: boolean;
        } = {}
    ): ScenarioContextInterface['context'] => {
        const { ignoreStrictData } = options;

        if (ignoreStrictData) {
            const logInfo = '[ignoreStrictData: deprecated] Set scenario context ';

            console.log(logInfo, key, 'value', value, '\n');

            return this.context.set(key, value);
        }

        const isObject = typeof value === 'object';
        const newValue = isObject ? JSON.parse(JSON.stringify(value, null, 4)) : value;

        console.log('Set scenario context', key, 'value', newValue, '\n');

        return this.context.set(key, newValue);
    };

    /**
     * get value from context
     * @param key
     * @returns T
     */
    get = <T = string>(key: string): T => {
        return this.context.get(key);
    };

    /**
     * get values from context by regex keys
     * @param regexKey
     * @returns {any[]} any[]
     */
    getByRegexKeys = <T = string>(regexKey: string): T[] => {
        const values: T[] = [];
        this.context.forEach((value: any, key: string) => {
            if (key.indexOf(regexKey) !== -1) {
                values.push(value);
            }
        });
        return values;
    };

    /**
     * check key exist or not in context
     * @param key
     * @returns {boolean} boolean
     */
    has = (key: string): boolean => {
        return this.context.has(key);
    };
}
