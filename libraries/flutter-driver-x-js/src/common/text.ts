import { CommandWithTarget, SerializableFinder } from './find';
import { Command, Result } from './message';

/// A Flutter Driver command that reads the text from a given element.
export class GetText extends CommandWithTarget {
    constructor(finder: SerializableFinder, { timeout }: { timeout?: number }) {
        super(finder, { timeout: timeout });
    }

    command = 'get_text';
}

/// A Flutter Driver command that enters text into the currently focused widget.
export class EnterText extends Command {
    text: string;
    /// Creates a command that enters text into the currently focused widget.
    constructor(text: string, { timeout }: { timeout?: number }) {
        super(timeout);
        this.text = text;
    }

    command = 'enter_text';
}

export class GetTextResult extends Result {
    response!: {
        text: string;
    };
}

/// A Flutter Driver command that enables and disables text entry emulation.
export class SetTextEntryEmulation extends Command {
    /// Creates a command that enables and disables text entry emulation.
    constructor(enabled: boolean, { timeout }: { timeout?: number }) {
        super(timeout);
        this.enabled = enabled;
    };

    /// Whether text entry emulation should be enabled.
    enabled: boolean;

    command = 'set_text_entry_emulation';
}