import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Post } from '../../modules/post/post.entity';
import { Topic } from '../../modules/topic/topic.entity';
import { User } from '../../modules/user/entities/user.entity';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.info('seeding topics...');

    const topics = await Topic.save([
      new Topic({ name: 'Thảo luận' }),
      new Topic({ name: 'Hỏi đáp' }),
    ]);

    console.info('seeding admin');
    const admin = await User.save(
      new User({
        email: 'admin@admin.com',
        password: 'admin123',
      }),
    );

    console.info('seeding users...');
    const userFactory = factoryManager.get(User);
    const users = await userFactory.saveMany(10);

    console.info('seeding admin posts...');
    const postRepo = dataSource.getRepository(Post);
    const postFactory = factoryManager.get(Post);

    const posts = await Promise.all(
      new Array(10).fill('').map(async () => {
        return await postFactory.make({
          user: admin,
          topic: faker.helpers.arrayElement(topics),
        });
      }),
    );

    await postRepo.save(posts);
  }
}
