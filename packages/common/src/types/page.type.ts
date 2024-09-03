export type Page<T> = {
    index: number;
    size: number;
    totalPages?: number;
    isLast: boolean;
    items: T[];
};
