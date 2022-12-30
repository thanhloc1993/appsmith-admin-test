import { CMSInterface } from '@supports/app-types';

import {
    loNameColumn,
    studyPlanItemHideIcon,
    studyPlanItemShowIcon,
} from './cms-selectors/study-plan';
import { activeDropdownMenu } from './study-plan-items-edit-definitions';
import { schoolAdminHasCreatedStudyPlanV2 } from './syllabus-study-plan-common-definitions';
import { StudyPlanItemStatus as StudyPlanItemStatusEnumProto } from 'manabuf/eureka/v1/assignments_pb';
import { asyncForEach } from 'step-definitions/utils';
import {
    Book,
    StudyPlanItem,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export type StudyPlanCreatedType = 'active' | 'archived' | 'mixed';

export type BulkShowHideOption = 'Show All' | 'Hide All';

export type VisibilityType = 'active' | 'archived';

export const schoolAdminCreatesStudyPlanItems = async (
    cms: CMSInterface,
    type: StudyPlanCreatedType,
    courseId: string,
    books: Book[],
    studyPlanItems: StudyPlanItem[]
) => {
    const { studyPlanId, studyPlanName } = await schoolAdminHasCreatedStudyPlanV2(
        cms,
        courseId,
        books,
        {
            studyPlanItems,
            generatorStudyPlanItems: (studyPlanItems) => {
                switch (type) {
                    case 'active': {
                        return studyPlanItems;
                    }

                    case 'archived': {
                        return studyPlanItems.map((item) => ({
                            ...item,
                            status: StudyPlanItemStatusEnumProto.STUDY_PLAN_ITEM_STATUS_ARCHIVED,
                        }));
                    }

                    case 'mixed': {
                        return studyPlanItems.map((item, index) => ({
                            ...item,
                            status:
                                index % 2 === 0
                                    ? StudyPlanItemStatusEnumProto.STUDY_PLAN_ITEM_STATUS_ACTIVE
                                    : StudyPlanItemStatusEnumProto.STUDY_PLAN_ITEM_STATUS_ARCHIVED,
                        }));
                    }
                }
            },
        }
    );

    return { studyPlanId, studyPlanName };
};

export const schoolAdminSelectBulkShowHideAction = async (
    cms: CMSInterface,
    action: BulkShowHideOption
) => {
    await activeDropdownMenu(cms);

    const bulkEditAction = await cms.page!.waitForSelector(`text="${action}"`);
    await bulkEditAction.click();
};

export const schoolAdminSeeStatusStudyPlanItemChanged = async (
    cms: CMSInterface,
    status: VisibilityType
) => {
    switch (status) {
        case 'active':
            await cms.page!.waitForSelector(studyPlanItemShowIcon);
            break;

        case 'archived':
            await cms.page!.waitForSelector(studyPlanItemHideIcon);
            break;
    }
};

export const schoolAdminGetStudyPlanItemStyles = async (cms: CMSInterface) => {
    const styles = (await cms.page!.$$eval(`td[data-testid="${loNameColumn}"]`, (nodes) =>
        nodes.map((n) => getComputedStyle(n))
    )) as CSSStyleDeclaration[];

    return styles;
};

export const schoolAdminGetStyleOfSelectedRows = async (
    cms: CMSInterface,
    selectedIds: string[]
) => {
    const currentStyles: CSSStyleDeclaration[] = [];

    await asyncForEach(selectedIds, async (selectedId) => {
        const style = await cms
            .page!.locator(`tr[data-value="${selectedId}"] td[data-testid="${loNameColumn}"]`)
            .evaluate((n) => getComputedStyle(n));
        currentStyles.push(style);
    });

    return currentStyles;
};

export const schoolAdminSeesStyleOfSelectedStudyPlanItemsChanged = async (
    cms: CMSInterface,
    status: VisibilityType,
    selectedItemIds: string[]
) => {
    const currentStyles = await schoolAdminGetStyleOfSelectedRows(cms, selectedItemIds);

    const areValuesEqual = currentStyles.every(
        (value) =>
            value.backgroundColor === 'rgb(245, 245, 245)' && value.color === 'rgb(189, 189, 189)'
    );

    switch (status) {
        case 'active':
            weExpect(areValuesEqual).toEqual(false);
            break;

        case 'archived':
            weExpect(areValuesEqual).toEqual(true);
            break;

        default:
            throw new Error(`Unknown status: ${status}`);
    }
};

export const schoolAdminSeesStudyPlanItemStatus = async (
    cms: CMSInterface,
    studyPlanItemsStyles: CSSStyleDeclaration[],
    isChanged: boolean
) => {
    const currentStyles = await schoolAdminGetStudyPlanItemStyles(cms);

    const result = studyPlanItemsStyles.every(
        (value, index) =>
            value.backgroundColor === currentStyles[index].backgroundColor &&
            value.color === currentStyles[index].color
    );

    weExpect(result).toEqual(isChanged);
};
