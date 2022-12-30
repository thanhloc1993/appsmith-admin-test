import { CMSInterface } from '@supports/app-types';

const formHelperSelector = '[class*=MuiFormHelperText-root]';

const findValidationError = async (
    cms: CMSInterface,
    field: { wrapper: string; message?: string }
) => {
    const { wrapper, message } = field;

    if (message) {
        const errorText = await cms.getTextContentElement(`${wrapper} ${formHelperSelector}`);

        return weExpect(errorText, `Should see "${message}" message error field`).toEqual(message);
    }

    return await cms.page!.waitForSelector(`${wrapper} ${formHelperSelector}`);
};

export const cmsForm = { findValidationError };
