import { Command, Result } from './message';

/// A Flutter Driver command that requests a string representation of the render tree.
export class GetRenderTree extends Command {
    /// Create a command to request a string representation of the render tree.
    constructor({ timeout }: { timeout?: number }) {
        super(timeout);
    }

    command = 'get_render_tree';
}

export class RenderTree extends Result {
    response!: {
        tree: string;
    };
}
