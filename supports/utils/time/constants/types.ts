export interface DateCommon {
    date: string | Date | number;
}

export interface OptionSelectType {
    id: string | number;
    value: string;
    label?: string | JSX.Element; // add a label for more descriptive item when map to element
}
