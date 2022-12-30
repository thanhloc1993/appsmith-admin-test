export const buttonActionDropdown = '[data-testid="ButtonDropdown"]';
export const buttonActionDropdownPopover = '[data-testid="ButtonDropdown__popover"]';
export const buttonActionDropdownItem = (value: 'IMPORT' | 'EXPORT') => {
    return `[data-value="${value}"]`;
};
export const uploadInput = '[data-testid="UploadInput__inputFile"]';
export const buttonSelectMasterDropdown = '[data-testid="MasterView__typeSelect"]';
export const buttonImport = '[data-testid="MasterView__importButton"]';
