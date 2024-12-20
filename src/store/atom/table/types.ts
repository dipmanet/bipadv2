export interface HeaderWithModifier<T> {
    key: string;
    label: string;
    order: number;
    sortable?: boolean;
    comparator?: (a:T, b:T) => number;
    modifier: (leave: T) => React.ReactNode;
}

export interface HeaderWithoutModifier<T> {
    key: keyof T;
    label: string;
    order: number;
    sortable?: boolean;
}

export type Header<T> = HeaderWithModifier<T> | HeaderWithoutModifier<T>;

// eslint-disable-next-line max-len, import/prefer-default-export
export function hasModifier<T>(item: HeaderWithModifier<T> | HeaderWithoutModifier<T>): item is HeaderWithModifier<T> {
    return !!(item as HeaderWithModifier<T>).modifier;
}
