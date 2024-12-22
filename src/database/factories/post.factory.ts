import { CommentEntity } from '@/modules/comment/comment.entity';
import { PostEntity } from '@/modules/post/entities/post.entity';
import { setSeederFactory } from 'typeorm-extension';

export const PostFactory = setSeederFactory(PostEntity, (faker) => {
  const post = new PostEntity({
    title: faker.lorem.words({ min: 3, max: 7 }),
    content: faker.lorem.paragraph({ min: 5, max: 10 }),
  });
  const cmt1 = new CommentEntity({ content: faker.lorem.sentence() });
  const cmt2 = new CommentEntity({ content: faker.lorem.sentence() });
  const cmt3 = new CommentEntity({ content: faker.lorem.sentence() });

  post.comments = [cmt1, cmt2, cmt3];

  return post;
});
