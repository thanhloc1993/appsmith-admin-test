import { ConverterUtils } from '../converter';

describe('ConverterUtils', () => {
    it('getKeyFromDescription with input normal', () => {
        const key = ConverterUtils.getKeyFromDescription(
            "ManabieAddNewItemButton-[<'add A New Account Button'>]"
        );

        expect(key).toEqual('add A New Account Button');
    });

    it('getKeyFromDescription with input ascii special', () => {
        const key = ConverterUtils.getKeyFromDescription(
            "ManabieAddNewItemButton-[<'add ]A[] New_Account\\Button'>]"
        );

        expect(key).toEqual('add ]A[] New_Account\\Button');
    });

    it('getKeyFromDescription with input not contain key', () => {
        const key = ConverterUtils.getKeyFromDescription('ManabieAddNewItemButton');

        expect(key).toEqual('');
    });
});
