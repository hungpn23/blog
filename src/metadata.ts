export default async () => {
  const t = {
    ['./dto/error/error-detail.dto']: await import(
      './dto/error/error-detail.dto'
    ),
    ['./constants/index']: await import('./constants/index'),
    ['./dto/offset-pagination/metadata.dto']: await import(
      './dto/offset-pagination/metadata.dto'
    ),
    ['./modules/post/entities/post.entity']: await import(
      './modules/post/entities/post.entity'
    ),
    ['./modules/post/entities/post-image.entity']: await import(
      './modules/post/entities/post-image.entity'
    ),
    ['./modules/comment/comment.entity']: await import(
      './modules/comment/comment.entity'
    ),
    ['./modules/user/entities/user.entity']: await import(
      './modules/user/entities/user.entity'
    ),
    ['./modules/tag/tag.entity']: await import('./modules/tag/tag.entity'),
    ['./modules/user/entities/session.entity']: await import(
      './modules/user/entities/session.entity'
    ),
    ['./modules/user/entities/follow.entity']: await import(
      './modules/user/entities/follow.entity'
    ),
    ['./modules/auth/auth.dto']: await import('./modules/auth/auth.dto'),
    ['./modules/user/user.dto']: await import('./modules/user/user.dto'),
  };
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('./dto/error/error-detail.dto'),
          {
            ErrorDetailDto: {
              property: { required: true, type: () => String },
              code: { required: true, type: () => String },
              message: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./dto/error/error.dto'),
          {
            ErrorDto: {
              timestamp: { required: true, type: () => String },
              statusCode: { required: true, type: () => Number },
              message: { required: true, type: () => String },
              details: {
                required: false,
                type: () => [t['./dto/error/error-detail.dto'].ErrorDetailDto],
              },
            },
            CommonErrorDto: {},
          },
        ],
        [
          import('./dto/offset-pagination/query.dto'),
          {
            OffsetPaginationQueryDto: {
              page: { required: false, type: () => Number, default: 1 },
              take: { required: false, type: () => Number, default: 10 },
              order: { required: false, enum: t['./constants/index'].Order },
              search: { required: false, type: () => String },
            },
            PostQueryDto: { tag: { required: false, type: () => String } },
          },
        ],
        [
          import('./dto/offset-pagination/metadata.dto'),
          {
            OffsetMetadataDto: {
              take: { required: true, type: () => Number },
              totalRecords: { required: true, type: () => Number },
              totalPages: { required: true, type: () => Number },
              currentPage: { required: true, type: () => Number },
              nextPage: { required: false, type: () => Number },
              previousPage: { required: false, type: () => Number },
            },
          },
        ],
        [
          import('./dto/offset-pagination/paginated.dto'),
          {
            OffsetPaginatedDto: {
              paginatedData: { required: true },
              metadata: {
                required: true,
                type: () =>
                  t['./dto/offset-pagination/metadata.dto'].OffsetMetadataDto,
              },
            },
          },
        ],
        [
          import('./modules/auth/auth.dto'),
          {
            AuthReqDto: {
              email: { required: true, type: () => String },
              password: { required: true, type: () => String },
            },
            AuthResDto: {
              accessToken: { required: true, type: () => String },
              refreshToken: { required: true, type: () => String },
            },
            LoginResDto: {},
            RefreshResDto: {},
          },
        ],
        [
          import('./database/entities/abstract.entity'),
          {
            AbstractEntity: {
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
              createdBy: { required: true, type: () => String },
              updatedBy: { required: true, type: () => String },
            },
            DeletableAbstractEntity: {},
          },
        ],
        [
          import('./modules/tag/tag.entity'),
          {
            TagEntity: {
              id: { required: true, type: () => Object },
              name: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./modules/post/entities/post-image.entity'),
          {
            PostImageEntity: {
              id: { required: true, type: () => Object },
              url: { required: true, type: () => String },
              post: {
                required: true,
                type: () => t['./modules/post/entities/post.entity'].PostEntity,
              },
            },
          },
        ],
        [
          import('./modules/post/entities/post.entity'),
          {
            PostEntity: {
              id: { required: true, type: () => Object },
              title: { required: true, type: () => String },
              slug: { required: true, type: () => String },
              content: { required: true, type: () => String },
              wordCount: { required: true, type: () => Number },
              readingTime: { required: true, type: () => Number },
              viewCount: { required: true, type: () => Number },
              images: {
                required: true,
                type: () => [
                  t['./modules/post/entities/post-image.entity']
                    .PostImageEntity,
                ],
              },
              comments: {
                required: true,
                type: () => [
                  t['./modules/comment/comment.entity'].CommentEntity,
                ],
              },
              author: {
                required: true,
                type: () => t['./modules/user/entities/user.entity'].UserEntity,
              },
              tags: {
                required: true,
                type: () => [t['./modules/tag/tag.entity'].TagEntity],
              },
            },
          },
        ],
        [
          import('./modules/comment/comment.entity'),
          {
            CommentEntity: {
              id: { required: true, type: () => Object },
              content: { required: true, type: () => String },
              post: {
                required: true,
                type: () => t['./modules/post/entities/post.entity'].PostEntity,
              },
              author: {
                required: true,
                type: () => t['./modules/user/entities/user.entity'].UserEntity,
              },
            },
          },
        ],
        [
          import('./modules/user/entities/follow.entity'),
          {
            FollowEntity: {
              followerId: { required: true, type: () => Object },
              followedId: { required: true, type: () => Object },
              follower: {
                required: true,
                type: () => t['./modules/user/entities/user.entity'].UserEntity,
              },
              followed: {
                required: true,
                type: () => t['./modules/user/entities/user.entity'].UserEntity,
              },
            },
          },
        ],
        [
          import('./modules/user/entities/user.entity'),
          {
            UserEntity: {
              id: { required: true, type: () => Object },
              role: { required: true, enum: t['./constants/index'].Role },
              username: { required: false, type: () => String },
              email: { required: true, type: () => String },
              isEmailVerified: { required: true, type: () => Boolean },
              bio: { required: false, type: () => String },
              avatar: { required: false, type: () => String },
              sessions: {
                required: true,
                type: () => [
                  t['./modules/user/entities/session.entity'].SessionEntity,
                ],
              },
              posts: {
                required: true,
                type: () => [
                  t['./modules/post/entities/post.entity'].PostEntity,
                ],
              },
              comments: {
                required: true,
                type: () => [
                  t['./modules/comment/comment.entity'].CommentEntity,
                ],
              },
              followers: {
                required: true,
                type: () => [
                  t['./modules/user/entities/follow.entity'].FollowEntity,
                ],
              },
              followeds: {
                required: true,
                type: () => [
                  t['./modules/user/entities/follow.entity'].FollowEntity,
                ],
              },
            },
          },
        ],
        [
          import('./modules/user/entities/session.entity'),
          {
            SessionEntity: {
              id: { required: true, type: () => Object },
              expiresAt: { required: true, type: () => Date },
              user: {
                required: true,
                type: () => t['./modules/user/entities/user.entity'].UserEntity,
              },
            },
          },
        ],
        [
          import('./modules/comment/comment.dto'),
          {
            CreateCommentDto: {
              content: { required: true, type: () => String },
            },
            UpdateCommentDto: {},
          },
        ],
        [
          import('./modules/post/post.dto'),
          {
            CreatePostDto: {
              title: { required: true, type: () => String },
              content: { required: true, type: () => String },
              tags: { required: true, type: () => [String] },
            },
            UpdatePostDto: {},
          },
        ],
        [
          import('./modules/tag/tag.dto'),
          {
            CreateTagDto: { name: { required: true, type: () => String } },
            UpdateTagDto: {},
          },
        ],
        [
          import('./modules/user/user.dto'),
          {
            UpdateUserDto: {
              username: { required: false, type: () => String },
              email: { required: false, type: () => String },
              bio: { required: false, type: () => String },
            },
            UploadAvatarResponseDto: {
              avatarUrl: { required: true, type: () => String },
            },
          },
        ],
      ],
      controllers: [
        [
          import('./modules/auth/auth.controller'),
          {
            AuthController: {
              register: {},
              login: { type: t['./modules/auth/auth.dto'].LoginResDto },
              logout: {},
              refreshToken: {
                type: t['./modules/auth/auth.dto'].RefreshResDto,
              },
              forgotPassword: { type: String },
              verifyForgotPassword: { type: String },
              verifyEmail: { type: String },
              resendVerifyEmail: { type: String },
            },
          },
        ],
        [
          import('./modules/comment/comment.controller'),
          {
            CommentController: {
              create: {
                type: t['./modules/comment/comment.entity'].CommentEntity,
              },
              findAll: {
                type: [t['./modules/comment/comment.entity'].CommentEntity],
              },
              update: {
                type: t['./modules/comment/comment.entity'].CommentEntity,
              },
              remove: {
                type: t['./modules/comment/comment.entity'].CommentEntity,
              },
            },
          },
        ],
        [
          import('./modules/post/post.controller'),
          {
            PostController: {
              create: {
                type: t['./modules/post/entities/post.entity'].PostEntity,
              },
              getManyByAuthorId: {},
              getAll: {},
              getOne: {
                type: t['./modules/post/entities/post.entity'].PostEntity,
              },
              update: {
                type: t['./modules/post/entities/post.entity'].PostEntity,
              },
              remove: {
                type: t['./modules/post/entities/post.entity'].PostEntity,
              },
            },
          },
        ],
        [
          import('./modules/tag/tag.controller'),
          {
            TagController: {
              create: { type: t['./modules/tag/tag.entity'].TagEntity },
              findAll: { type: [t['./modules/tag/tag.entity'].TagEntity] },
              findOne: { type: t['./modules/tag/tag.entity'].TagEntity },
              update: { type: t['./modules/tag/tag.entity'].TagEntity },
              remove: { type: t['./modules/tag/tag.entity'].TagEntity },
            },
          },
        ],
        [
          import('./modules/user/user.controller'),
          {
            UserController: {
              getOne: {
                type: t['./modules/user/entities/user.entity'].UserEntity,
              },
              getAll: {
                type: [t['./modules/user/entities/user.entity'].UserEntity],
              },
              updateProfile: {
                type: t['./modules/user/entities/user.entity'].UserEntity,
              },
              uploadAvatar: {
                type: t['./modules/user/user.dto'].UploadAvatarResponseDto,
              },
              deleteAvatar: {},
              follow: {},
              unfollow: {},
            },
          },
        ],
      ],
    },
  };
};
