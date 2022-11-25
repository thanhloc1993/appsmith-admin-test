import { CommandWithTarget, SerializableFinder } from './find';

/// A Flutter Driver command that taps on a target widget located by [finder].
export class Tap extends CommandWithTarget {
    /// Creates a tap command to tap on a widget located by [finder].
    constructor(finder: SerializableFinder, { timeout }: { timeout?: number }) {
        super(finder, { timeout: timeout });
    }

    command = 'tap';
}

/// A Flutter Driver command that commands the driver to perform a scrolling action.
export class Scroll extends CommandWithTarget {
    dx: number;
    dy: number;
    duration: number;
    frequency: number;
    /// Creates a scroll command that will attempt to scroll a scrollable view by
    /// dragging a widget located by the given [finder].
    constructor(
        finder: SerializableFinder,
        dx: number,
        dy: number,
        duration: number,
        frequency: number,
        { timeout }: { timeout?: number }
    ) {
        super(finder, { timeout: timeout });

        /// Delta X offset per move event.
        this.dx = dx;

        /// Delta Y offset per move event.
        this.dy = dy;

        /// The duration of the scrolling action.
        /// Convert millisecond to microseconds:
        /// https://github.com/flutter/flutter/blob/master/packages/flutter_driver/lib/src/common/gesture.dart#L60
        this.duration = duration * 1000;

        /// The frequency in Hz of the generated move events.
        this.frequency = frequency;
    }

    command = 'scroll';
}

/// A Flutter Driver command that commands the driver to ensure that the element
/// represented by [finder] has been scrolled completely into view.
export class ScrollIntoView extends CommandWithTarget {
    alignment: number;
    /// Creates this command given a [finder] used to locate the widget to be
    /// scrolled into view.
    constructor(
        finder: SerializableFinder,
        { alignment = 0.0, timeout }: { alignment?: number; timeout?: number }
    ) {
        super(finder, { timeout: timeout });
        this.alignment = alignment;
    }

    /// How the widget should be aligned.
    ///
    /// This value is passed to [Scrollable.ensureVisible] as the value of its
    /// argument of the same name.
    ///
    /// Defaults to 0.0.
    command = 'scrollIntoView';
}

export default {};
