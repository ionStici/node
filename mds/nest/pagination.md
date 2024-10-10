# Pagination in NestJS

## Building a Reusable Pagination Module

```ts
// src/common/pagination/dtos/pagination-query.dto.ts
import { IsOptional, IsPositive } from "class-validator";
import { Type } from "class-transformer";

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: Number = 10;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: Number = 1;
}
```

```ts
// src/common/pagination/interfaces/paginated.interface.ts
export interface Paginated<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
  links: {
    first: string;
    last: string;
    current: string;
    next: string;
    previous: string;
  };
}
```

```ts
// src/common/pagination
import { Injectable, Inject } from "@nestjs/common";
import { ObjectLiteral, Repository } from "typeorm";
import { PaginationQueryDto } from "../dtos/pagination-query.dto";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { Paginated } from "../interfaces/paginated.interface";

@Injectable()
export class PaginationService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request
  ) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>
  ): Promise<Paginated<T>> {
    const results = await repository.find({
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit,
    });

    const baseURL =
      this.request.protocol + "://" + this.request.headers.host + "/";
    const newUrl = new URL(this.request.url, baseURL);

    const baseURL =
      this.request.protocol + "://" + this.request.headers.host + "/"; // http://localhost:3000/
    const newUrl = new URL(this.request.url, baseURL);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / paginationQuery.limit);
    const nextPage =
      paginationQuery.page === totalPages
        ? paginationQuery.page
        : paginationQuery.page + 1;
    const previousPage =
      paginationQuery.page === 1
        ? paginationQuery.page
        : paginationQuery.page - 1;

    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: paginationQuery.limit,
        totalItems: totalItems,
        currentPage: paginationQuery.page,
        totalPages: totalPages,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${totalPages}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&${paginationQuery.page}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&${nextPage}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&${previousPage}`,
      },
    };

    return finalResponse;
  }
}
```

## Using the Pagination Module

```ts
// src/posts/dto/get-posts.dto.ts
import { IntersectionType } from "@nestjs/mapped-types";
import { IsDate, IsOptional } from "class-validator";
import { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query.dto";

export class GetPostsBaseDto {
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;
}

export class GetPostsDto extends IntersectionType(
  GetPostsBaseDto,
  PaginationQueryDto
) {}
```

```ts
// src/posts/providers/posts.service.ts
import { Injectable } from "@nestjs/common";
import { GetPostsDto } from "../dtos/get-posts.dto";
import { PaginationService } from "src/common/pagination/providers/pagination.service";
import { Paginated } from "src/common/pagination/interfaces/paginated.interface";

@Injectable()
export class PostsService {
  constructor(private readonly paginationService: PaginationService) {}

  public async findPosts(postQuery: GetPostsDto): Promise<Paginated<Post>> {
    const posts = await this.paginationService.paginateQuery(
      { limit: postQuery.limit, page: postQuery.page },
      this.postRepository
    );

    return posts;
  }
}
```

```
GET http://localhost:3000/posts/?limit=3&page=1
```
