import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasBookNamesListTenantS1, aliasBookNamesListTenantS2 } from './alias-keys/syllabus';
import { bookAutocompleteHFInput, bookAutocompleteHFRoot } from './cms-selectors/cms-keys';
import { schoolAdminChooseBookInStudyPlanForm } from './syllabus-course-create-study-plan-definitions';
import { BookNameWithTenant } from './syllabus-select-book-to-create-study-plan-multi-tenant-steps';

export const schoolAdminCanSeeBookWhenCreatingSP = async (cms: CMSInterface, bookName: string) => {
    await schoolAdminChooseBookInStudyPlanForm(cms, bookName);
};

export const schoolAdminCannotSeeBookWhenCreatingSP = async (
    cms: CMSInterface,
    bookName: string
) => {
    const cmsPage = cms.page!;
    await cmsPage.fill(bookAutocompleteHFInput, bookName);
    await cms.waitingAutocompleteLoading(bookAutocompleteHFRoot);
    await cms.waitForSelectorHasText("div[role='presentation']", 'No options');
    // TODO: will replace div[role='presentation'] by data-testid
};

export const getBookNameWithTenant = async (
    context: ScenarioContext,
    bookName: BookNameWithTenant
) => {
    let name = '';
    switch (bookName) {
        case 'book 1a':
            name = context.get<string[]>(aliasBookNamesListTenantS1)[0];
            break;
        case 'book 1b':
            name = context.get<string[]>(aliasBookNamesListTenantS1)[1];
            break;
        case 'book 2a':
            name = context.get<string[]>(aliasBookNamesListTenantS2)[0];
            break;
        case 'book 2b':
            name = context.get<string[]>(aliasBookNamesListTenantS2)[1];
            break;
        default:
            break;
    }
    return name;
};
