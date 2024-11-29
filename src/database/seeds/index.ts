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
    console.log('seeding topics...');
    const topics = await Topic.save([
      new Topic({ name: 'Thảo luận' }),
      new Topic({ name: 'Hỏi đáp' }),
    ]);

    console.log('seeding admin');
    const admin = await User.save(
      new User({
        username: 'admin',
        email: 'admin@admin.com',
        password: 'admin123',
      }),
    );

    console.log('seeding users...');
    const userFactory = factoryManager.get(User);
    const users = await userFactory.saveMany(10);

    console.log('seeding admin posts...');
    const postRepo = dataSource.getRepository(Post);
    const postFactory = factoryManager.get(Post);
    const posts = await Promise.all(
      new Array(100).fill('').map(async () => {
        return await postFactory.make({
          createdBy: admin.username,
          author: admin,
          topic: topics[Math.floor(Math.random() * topics.length)],
        });
      }),
    );
    await postRepo.save(posts);
    console.timeEnd('SEEDING TIME');
  }
}
