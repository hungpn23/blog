/* eslint-disable */
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
    ['./modules/topic/topic.entity']: await import(
      './modules/topic/topic.entity'
    ),
    ['./modules/user/entities/session.entity']: await import(
      './modules/user/entities/session.entity'
    ),
    ['./modules/user/entities/follower.entity']: await import(
      './modules/user/entities/follow.entity'
    ),
    ['./modules/auth/auth.dto']: await import('./modules/auth/auth.dto'),
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
              statusCode: { required: true, type: () => Number },
              message: { required: true, type: () => String },
              timestamp: { required: true, type: () => String },
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
              limit: { required: false, type: () => Number, default: 10 },
              order: { required: false, enum: t['./constants/index'].Order },
              search: { required: false, type: () => String },
            },
          },
        ],
        [
          import('./dto/offset-pagination/metadata.dto'),
          {
            OffsetMetadataDto: {
              limit: { required: true, type: () => Number },
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
              data: { required: true },
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
              email: { required: true, type: () => String, format: 'email' },
              password: { required: true, type: () => String, minLength: 8 },
            },
            AuthResDto: {
              userId: { required: true, type: () => Object },
              accessToken: { required: true, type: () => String },
              refreshToken: { required: true, type: () => String },
            },
            RegisterResDto: {},
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
          import('./modules/topic/topic.entity'),
          {
            TopicEntity: {
              id: { required: true, type: () => Object },
              name: { required: true, type: () => String },
              posts: {
                required: true,
                type: () => [
                  t['./modules/post/entities/post.entity'].PostEntity,
                ],
              },
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
              content: { required: true, type: () => String },
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
              topic: {
                required: true,
                type: () => t['./modules/topic/topic.entity'].TopicEntity,
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
                  t['./modules/user/entities/follower.entity']
                    .UserFollowerEntity,
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
            },
            UpdatePostDto: {},
          },
        ],
        [
          import('./modules/topic/topic.dto'),
          {
            CreateTopicDto: { name: { required: true, type: () => String } },
            UpdateTopicDto: {},
          },
        ],
        [import('./modules/user/user.dto'), { UpdateUserDto: {} }],
        [
          import('./modules/user/entities/follow.entity'),
          {
            FollowerEntity: {
              userId: { required: true, type: () => Object },
              followerId: { required: true, type: () => Object },
            },
            UserFollowerEntity: {
              userId: { required: true, type: () => Object },
              followerId: { required: true, type: () => Object },
            },
          },
        ],
      ],
      controllers: [
        [
          import('./modules/auth/auth.controller'),
          {
            AuthController: {
              register: { type: t['./modules/auth/auth.dto'].RegisterResDto },
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
              getMany: {},
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
          import('./modules/topic/topic.controller'),
          {
            TopicController: {
              create: { type: t['./modules/topic/topic.entity'].TopicEntity },
              findAll: {
                type: [t['./modules/topic/topic.entity'].TopicEntity],
              },
              findOne: { type: t['./modules/topic/topic.entity'].TopicEntity },
              update: { type: t['./modules/topic/topic.entity'].TopicEntity },
              remove: { type: t['./modules/topic/topic.entity'].TopicEntity },
            },
          },
        ],
        [
          import('./modules/user/user.controller'),
          {
            UserController: {
              getProfile: {
                type: t['./modules/user/entities/user.entity'].UserEntity,
              },
              uploadAvatar: {},
              updateProfile: {
                type: t['./modules/user/entities/user.entity'].UserEntity,
              },
            },
          },
        ],
      ],
    },
  };
};
