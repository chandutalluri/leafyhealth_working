import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ContentType {
  ARTICLE = 'article',
  PAGE = 'page',
  BLOG = 'blog',
  FAQ = 'faq'
}

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export class CreateContentDto {
  @ApiProperty({ description: 'Content title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Content slug/URL' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'Content body' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Content excerpt', required: false })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiProperty({ description: 'Meta description for SEO', required: false })
  @IsString()
  @IsOptional()
  metaDescription?: string;

  @ApiProperty({ description: 'Meta keywords for SEO', required: false })
  @IsString()
  @IsOptional()
  metaKeywords?: string;

  @ApiProperty({ enum: ContentType, description: 'Type of content' })
  @IsEnum(ContentType)
  type: ContentType;

  @ApiProperty({ enum: ContentStatus, description: 'Content status', default: ContentStatus.DRAFT })
  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;

  @ApiProperty({ description: 'Category ID', required: false })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ description: 'Featured image URL', required: false })
  @IsString()
  @IsOptional()
  featuredImage?: string;

  @ApiProperty({ description: 'Tags as comma-separated string', required: false })
  @IsString()
  @IsOptional()
  tags?: string;

  @ApiProperty({ description: 'Author ID' })
  @IsNumber()
  authorId: number;
}

export class UpdateContentDto {
  @ApiProperty({ description: 'Content title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Content slug/URL', required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ description: 'Content body', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: 'Content excerpt', required: false })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiProperty({ description: 'Meta description for SEO', required: false })
  @IsString()
  @IsOptional()
  metaDescription?: string;

  @ApiProperty({ description: 'Meta keywords for SEO', required: false })
  @IsString()
  @IsOptional()
  metaKeywords?: string;

  @ApiProperty({ enum: ContentType, description: 'Type of content', required: false })
  @IsEnum(ContentType)
  @IsOptional()
  type?: ContentType;

  @ApiProperty({ enum: ContentStatus, description: 'Content status', required: false })
  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;

  @ApiProperty({ description: 'Category ID', required: false })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ description: 'Featured image URL', required: false })
  @IsString()
  @IsOptional()
  featuredImage?: string;

  @ApiProperty({ description: 'Tags as comma-separated string', required: false })
  @IsString()
  @IsOptional()
  tags?: string;
}

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Category slug/URL' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'Category description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Parent category ID', required: false })
  @IsNumber()
  @IsOptional()
  parentId?: number;
}

export class UpdateCategoryDto {
  @ApiProperty({ description: 'Category name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Category slug/URL', required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ description: 'Category description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Parent category ID', required: false })
  @IsNumber()
  @IsOptional()
  parentId?: number;
}