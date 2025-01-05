import { PostEntity } from '@/modules/post/entities/post.entity';
import { setSeederFactory } from 'typeorm-extension';

export const PostFactory = setSeederFactory(PostEntity, (faker) => {
  const post = new PostEntity({
    title: faker.lorem.words({ min: 3, max: 7 }),
    content: faker.lorem.paragraph({ min: 5, max: 10 }),
  });

  // post.comments = [];

  // new Array(_.random(0, 10)).fill(0).forEach(() => {
  //   post.comments.push(new CommentEntity({ content: faker.lorem.sentence() }));
  // });

  return post;
});
