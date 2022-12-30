import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { CMSInterface } from '@supports/app-types';

import { delay } from './utils';

export const schoolAdminWaitingCourseBookDataSync = async (place?: string) => {
    console.log('Waiting course book sync', place);

    await delay(3000);
};

export const schoolAdminWaitingQuestionDataSync = async (cms: CMSInterface) => {
    console.log('Waiting question data sync');

    await delay(3000);
    await cms.page!.reload();
};

export const schoolAdminShouldRedirectEndPointToEureka = () => {
    return featureFlagsHelper.isEnabled(
        'Syllabus_Migration_BackOffice_RedirectAPIEndPointToEureka'
    );
};
