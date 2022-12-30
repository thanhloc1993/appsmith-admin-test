export const pdfTypeMenuTrigger = '[data-testid="ActionPanel__trigger"]';
export const recordStudentTableRowCheckbox = (recordId: string) =>
    `[data-testid="TableBase__row"][data-value="${recordId}"] input[type="checkbox"]`;

export const studentEntryExitRecordDateFilterDropdown =
    '[data-testid="StudentEntryExitRecords__dateFilter"]';

export const dateFilterChildItem = (filter: string) => `li[data-value="${filter}"]`;
