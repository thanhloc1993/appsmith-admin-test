import { getTestId } from '@legacy-step-definitions/cms-selectors/cms-keys';

import { CMSInterface } from '@supports/app-types';

type TableColumnAssertionProps = {
    cms: CMSInterface;
    columnLabel: string;
    tableTestId?: string;
    cellHeaderTestId?: string;
};

type TableColumnsAssertionProps = {
    cms: CMSInterface;
    columnLabels: string[];
    tableTestId?: string;
    cellHeaderTestId?: string;
};

export const assertElementExists = async (cms: CMSInterface, selector: string) => {
    const page = cms.page!;
    const elementCount = await page.locator(selector).count();
    weExpect(elementCount).toBeGreaterThanOrEqual(1);
};

export const assertElementDoesNotExist = async (cms: CMSInterface, selector: string) => {
    const page = cms.page!;
    const elementCount = await page.locator(selector).count();
    weExpect(elementCount).toBe(0);
};

export const assertTableColumnExists = async ({
    cms,
    columnLabel,
    tableTestId = '',
    cellHeaderTestId = 'TableHeaderWithCheckbox__cellHeader',
}: TableColumnAssertionProps) => {
    await assertElementExists(
        cms,
        `${tableTestId ? `table${getTestId(tableTestId)} ` : ''}${getTestId(
            cellHeaderTestId
        )}:text-is("${columnLabel}")`
    );
};

export const assertTableColumnDoesNotExist = async ({
    cms,
    columnLabel,
    tableTestId = '',
    cellHeaderTestId = 'TableHeaderWithCheckbox__cellHeader',
}: TableColumnAssertionProps) => {
    await assertElementDoesNotExist(
        cms,
        `${tableTestId ? `table${getTestId(tableTestId)} ` : ''}${getTestId(
            cellHeaderTestId
        )}:text-is("${columnLabel}")`
    );
};

export const assertLabelAndOrderOfColumnsOnTable = async ({
    cms,
    columnLabels,
    tableTestId = '',
    cellHeaderTestId = 'TableHeaderWithCheckbox__cellHeader',
}: TableColumnsAssertionProps) => {
    const tableHeaderCells = await cms.page!.$$(
        `${tableTestId ? `table${getTestId(tableTestId)} ` : ''}${getTestId(cellHeaderTestId)}`
    );

    for (let i = 0; i < tableHeaderCells.length; i++) {
        const cellHeaderText = await tableHeaderCells[i].textContent();
        const columnLabel = columnLabels[i];
        weExpect(cellHeaderText).toEqual(columnLabel);
    }
};
