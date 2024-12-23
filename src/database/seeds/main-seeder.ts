import { Role } from '@/constants';
import { PostEntity } from '@/modules/post/entities/post.entity';
import { TopicEntity } from '@/modules/topic/topic.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.time('SEEDING TIME');

    const topics = await TopicEntity.save([
      new TopicEntity({ name: 'Discussion' }),
      new TopicEntity({ name: 'Q&A' }),
    ]);

    const admin = await UserEntity.save(
      new UserEntity({
        username: 'admin',
        email: 'admin@admin.com',
        password: 'admin123',
        role: Role.ADMIN,
      }),
    );

    // ** for seeding many posts
    const postRepo = dataSource.getRepository(PostEntity);
    const postFactory = factoryManager.get(PostEntity);

    const batchSize = 10;
    const totalPosts = 100;
    let postPromises: Promise<PostEntity>[] = [];

    for (let i = 0; i < totalPosts; i++) {
      postPromises.push(
        postFactory.make({
          createdBy: admin.username,
          author: admin,
          topic: topics[Math.floor(Math.random() * topics.length)],
        }),
      );

      if (postPromises.length === batchSize) {
        console.log(`adding ${postPromises.length} posts...`);
        const posts = await Promise.all(postPromises);
        await postRepo.save(posts);
        postPromises = [];
      }
    }

    if (postPromises.length > 0) {
      console.log(`adding ${postPromises.length} remaining posts...`);
      const posts = await Promise.all(postPromises);
      await postRepo.save(posts);
    }

    console.timeEnd('SEEDING TIME');
  }
}
