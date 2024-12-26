import { Role } from '@/constants';
import { PostEntity } from '@/modules/post/entities/post.entity';
import { TopicEntity } from '@/modules/topic/topic.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import _ from 'lodash';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.time('SEEDING TIME');

    const topics = await TopicEntity.save([
      new TopicEntity({ name: 'javascript' }),
      new TopicEntity({ name: 'typescript' }),
      new TopicEntity({ name: 'reactjs' }),
      new TopicEntity({ name: 'nextjs' }),
      new TopicEntity({ name: 'nestjs' }),
      new TopicEntity({ name: 'express' }),
      new TopicEntity({ name: 'nodejs' }),
      new TopicEntity({ name: 'docker' }),
      new TopicEntity({ name: 'git' }),
      new TopicEntity({ name: 'mysql' }),
      new TopicEntity({ name: 'redis' }),
      new TopicEntity({ name: 'cloudinary' }),
    ]);

    const admin = await UserEntity.save(
      new UserEntity({
        username: 'admin',
        email: 'admin@admin.com',
        password: 'admin123',
        role: Role.ADMIN,
      }),
    );

    // //  use factory for seeding many posts
    // const postRepo = dataSource.getRepository(PostEntity);
    // const postFactory = factoryManager.get(PostEntity);

    // const batchSize = 10;
    // const totalPosts = 100;

    // let postPromises: Promise<PostEntity>[] = [];
    // for (let i = 1; i <= totalPosts; i++) {
    //   postPromises.push(
    //     postFactory.make({
    //       createdBy: admin.username,
    //       author: admin,
    //       topics: _.sampleSize(topics, _.random(1, 6)),
    //     }),
    //   );

    //   if (postPromises.length === batchSize) {
    //     console.log(`adding ${postPromises.length} posts...`);
    //     const posts = await Promise.all(postPromises);
    //     await postRepo.save(posts);
    //     postPromises = [];
    //   }
    // }

    // // add remaining posts
    // if (postPromises.length > 0) {
    //   const posts = await Promise.all(postPromises);
    //   await postRepo.save(posts);
    // }

    // use post entity
    const totalPosts = 100;
    const posts = [];
    for (let i = 1; i <= totalPosts; i++) {
      posts.push(
        new PostEntity({
          title: `Post ${i}`,
          content: `Content of post ${i}`,
          createdBy: admin.username,
          author: admin,
          topics: _.sampleSize(topics, _.random(1, 6)),
        }),
      );
    }

    await PostEntity.save(posts);

    console.timeEnd('SEEDING TIME');
  }
}
