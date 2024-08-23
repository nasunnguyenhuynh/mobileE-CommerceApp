interface User {
    id: number,
    username: string,
    avatar: string
}

interface CommentDetail {
    id: number,
    content: string,
    is_shop: boolean,
    is_parent: boolean,
    parent_comment: number | null
}

export interface Comment {
    user: User,
    comment: CommentDetail
}