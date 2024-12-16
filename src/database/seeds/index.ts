import { Post } from '@/modules/post/post.entity';
import { Topic } from '@/modules/topic/topic.entity';
import { User } from '@/modules/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.time('SEEDING TIME');

    const topics = await Topic.save([
      new Topic({ name: 'Thảo luận' }),
      new Topic({ name: 'Hỏi đáp' }),
    ]);

    const admin = await User.save(
      new User({
        username: 'admin',
        email: 'admin@admin.com',
        password: 'admin123',
      }),
    );

    const userFactory = factoryManager.get(User);
    await userFactory.saveMany(10);

    const postRepo = dataSource.getRepository(Post);
    const postFactory = factoryManager.get(Post);

    const batchSize = 100;
    const totalPosts = 100;
    let postPromises: Promise<Post>[] = [];

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
