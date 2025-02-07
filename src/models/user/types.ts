export interface User {
    id: number;
    email: string;
    password: string;
    roles: Role[];
    firstname?: string;
    surname?: string;
    patronymic?: string;
    image?: string;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: 'ADMIN' | 'USER' | 'MODERATOR';
}

export interface PostComment {
    uuid: string;
    user_id?: number;
    post_uuid: string;
    text: string;
    likes_count: number;
    is_liked?: boolean; // если отправляем id нашего пользователя
    created_at: string;
    updated_at: string;
}

export interface PostCatetegory {
    id: string;
    name: 'FUN' | 'LOVE' | 'FAIL'; // и т.п.
}

export type Post = {
    uuid: string;
    user: User | null; // если тип 'PUBLIC' или 'PERSONAL'
    type: 'PUBLIC' | 'PERSONAL' | 'ANONYM';
    category: PostCatetegory;
    body: {
        text: string;
        images: string[]; // uuids картинок, макс. 10 штук
    };
    comments_count: number;
    comments: PostComment[]; // первые 20 комментов, остальное отдельным запросом
    likes_count: number;
    is_liked: boolean | null; // если отправляем id нашего пользователя
    is_checked_by_moderator: boolean | null;
    created_at: string;
    updated_at: string;
};
