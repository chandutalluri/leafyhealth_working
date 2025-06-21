export declare enum ContentType {
    ARTICLE = "article",
    PAGE = "page",
    BLOG = "blog",
    FAQ = "faq"
}
export declare enum ContentStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare class CreateContentDto {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    metaDescription?: string;
    metaKeywords?: string;
    type: ContentType;
    status?: ContentStatus;
    categoryId?: number;
    featuredImage?: string;
    tags?: string;
    authorId: number;
}
export declare class UpdateContentDto {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    metaDescription?: string;
    metaKeywords?: string;
    type?: ContentType;
    status?: ContentStatus;
    categoryId?: number;
    featuredImage?: string;
    tags?: string;
}
export declare class CreateCategoryDto {
    name: string;
    slug: string;
    description?: string;
    parentId?: number;
}
export declare class UpdateCategoryDto {
    name?: string;
    slug?: string;
    description?: string;
    parentId?: number;
}
