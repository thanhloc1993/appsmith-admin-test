import { fileChipName } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { toShortenStr } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';

export const schoolAdminSeeFileMediaChip = async (cms: CMSInterface, name: string) => {
    await cms.page?.waitForSelector(fileChipName(toShortenStr(name, 20)));
};
