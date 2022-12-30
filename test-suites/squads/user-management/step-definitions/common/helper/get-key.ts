export const getTestId = (testId: string) => `[data-testid='${testId}']`;
export const getAriaLabel = (text: string) => `[aria-label="${text}"]`;
export const getPlaceholder = (placeholder: 'Start Date' | 'End Date') =>
    `[placeholder="${placeholder}"]`;

export const getDataValue = (dataValue: string) => `[data-value='${dataValue}']`;
