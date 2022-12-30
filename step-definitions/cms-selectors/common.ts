export const baseDialogRoot = '[data-testid="BaseDialog__root"]';
export const getDateSelectorOfDatePickerCalendar = (day: number) =>
    `div[aria-label="DatePickerHF__dialog"] div[role="cell"] button:has-text("${day}")`;
export const menuItemLinkRoot = '[data-testid="MenuItemLink__root"]';
