export type WithPaginationPayload<T> = T & {
    page: number;
    page_size: number;
};

export interface WithPaginationResponse<T> {
    items: T[];
    offset: number;
    total: number;
}
