import { Command } from './message';

export class CommandWithTarget extends Command {
    finder: SerializableFinder;
    constructor(finder: SerializableFinder, { timeout }: { timeout?: number }) {
        super(timeout);
        this.finder = finder;
    }

    get flat(): any {
        const obj: any = {
            ...this,
            ...this.finder,
        };

        delete obj.finder;

        return JSON.parse(JSON.stringify(obj));
    }
}

export class WaitFor extends CommandWithTarget {
    constructor(finder: SerializableFinder, { timeout }: { timeout?: number }) {
        super(finder, { timeout: timeout });
    }

    command = 'waitFor';
}

export class WaitForAbsent extends CommandWithTarget {
    constructor(finder: SerializableFinder, { timeout }: { timeout?: number }) {
        super(finder, { timeout: timeout });
    }

    command = 'waitForAbsent';
}

/// Base class for Flutter Driver finders, objects that describe how the driver
/// should search for elements.
export class SerializableFinder {
    /// Identifies the type of finder to be used by the driver extension.
    finderType!: string;
}

/// A Flutter Driver finder that finds widgets by `ValueKey`.
export class ByValueKey extends SerializableFinder {
    keyValueString: string;
    /// Creates a finder given the key value.
    constructor(keyValueString: string) {
        super();
        this.keyValueString = keyValueString;
    }

    keyValueType = 'String';

    finderType = 'ByValueKey';
}

export class ByText extends SerializableFinder {
    text: string;
    constructor(text: string) {
        super();
        this.text = text;
    }

    finderType = 'ByText';
}

export class ByTooltipMessage extends SerializableFinder {
    text: string;
    constructor(text: string) {
        super();
        this.text = text;
    }

    finderType = 'ByTooltipMessage';
}
export default {};
