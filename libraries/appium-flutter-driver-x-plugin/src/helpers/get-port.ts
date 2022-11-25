export function getPort(source: string): number {
    const regex = /:\d+\//;
    const found = source.match(regex);
    if (found) {
        const subSource = found[0];
        const numberRegex = /\d+/;
        const numbers = subSource.match(numberRegex);
        if (numbers) {
            return parseInt(numbers[0]);
        }
    }
    return 0;
}
