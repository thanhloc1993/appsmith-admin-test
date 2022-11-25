export class ConverterUtils {
    static getKeyFromDescription(description: string): string {
        // eslint-disable-next-line no-useless-escape
        const pattern = RegExp(/(-\[<'.*\'>\])/g);
        const matches = description.match(pattern);
        if (matches) {
            return matches[0].replace("-[<'", '').replace("'>]", '');
        }
        return '';
    }
}
