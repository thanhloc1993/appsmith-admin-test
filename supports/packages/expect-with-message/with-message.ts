import { Expect, Matchers } from 'expect/build/types';

export type MatcherTypes<T> = keyof Matchers<T>;

type Fn = (...args: any[]) => any;

type MatcherResult<T> = (T | Promise<T>) & {
    message: () => string;
};

class JestAssertionError<T> extends Error {
    matcherResult: MatcherResult<T>;
    constructor(result: MatcherResult<T>, callsite: Fn | undefined) {
        super(result.message());

        this.matcherResult = result;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, callsite);
        }
    }
}

const wrapMatcher = <T>(matcher: Fn, customMessage: string) => {
    const newMatcher = (...args: any[]) => {
        try {
            return matcher(...args);
        } catch (error) {
            if (!(error as any).matcherResult) {
                throw error;
            }
            const { matcherResult }: { matcherResult: MatcherResult<T> } = error as any;

            const message = () => {
                let msg =
                    typeof matcherResult.message === 'function'
                        ? matcherResult.message()
                        : String(matcherResult.message);

                if (customMessage) {
                    msg = `We expect ${customMessage}\n` + msg;
                }

                return msg;
            };

            throw new JestAssertionError<T>({ ...matcherResult, message }, newMatcher);
        }
    };
    return newMatcher;
};

const wrapMatchers = <T = any>(matchers: Matchers<T>, customMessage: string): Matchers<T> => {
    const keyMatchers: string[] = Object.keys(matchers);
    return keyMatchers.reduce((acc: Matchers<T>, name: string) => {
        const matcher = matchers[name as MatcherTypes<T>];

        if (typeof matcher === 'function') {
            return {
                ...acc,
                [name]: wrapMatcher(matcher as Fn, customMessage),
            } as Matchers<T>;
        }

        return {
            ...acc,
            [name]: wrapMatchers<T>(matcher as Matchers<T>, customMessage), // recurse on .not/.resolves/.rejects
        } as Matchers<T>;
    }, {} as Matchers<T>);
};

export default <T = any>(expect: Expect) => {
    // proxy the expect function
    let expectProxy = Object.assign(
        (actual: T, customMessage: string) => wrapMatchers<T>(expect(actual) as any, customMessage), // partially apply expect to get all matchers and chain them
        expect // clone additional properties on expect
    );

    expectProxy.extend = (o) => {
        expect.extend(o); // add new matchers to expect
        expectProxy = Object.assign(expectProxy, expect); // clone new asymmetric matchers
    };

    return expectProxy;
};
