import { Command } from './message';

/// A Flutter Driver command that enables or disables the FrameSync mechanism.
export class SetFrameSync extends Command {
    enabled?: string;

    constructor(enabled: boolean, { timeout }: { timeout?: number }) {
        super(timeout);
        this.enabled = `${enabled}`;
    }

    command = 'set_frame_sync';
}
