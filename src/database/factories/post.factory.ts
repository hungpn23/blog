import { Post } from "@/modules/post/post.entity";
import { setSeederFactory } from "typeorm-extension";

export const PostFactory = setSeederFactory(Post, (faker) => {
  const post = new Post();

  post.title = faker.lorem.words({ min: 3, max: 7 });
  post.content = faker.lorem.paragraph({ min: 5, max: 10 });

  return post;
});
