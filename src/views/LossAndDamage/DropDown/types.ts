export interface DropDownOption {
    key: string;
    label: string;
}

export interface DropDownProps {
    dropDownClickHandler: (item: DropDownOption,
        index: number, elemName: string | undefined) => void;
    setSelectOption: (name: string, key: string) => void;
    icon?: boolean;
    dropdownOption: DropDownOption[];
    selectOption: { name: string; key: string };
    placeholder?: string | undefined;
    label?: string | undefined;
    className?: string | undefined;
    deleteicon: boolean;
    elementName?: string | undefined;
    clearValues: (elementName: string | undefined) => void;
}
