import { FindAllQueryDto } from './find-all-query.dto';

export const getPagPayload = <T extends FindAllQueryDto>(dto: T) => {
    const { page, page_size } = dto;
    const offset = (page - 1) * page_size;

    return {
        offset,
        payload: {
            take: page_size,
            skip: offset,
        },
    };
};
