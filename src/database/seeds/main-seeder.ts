import { Role } from '@/constants';
import { PostEntity } from '@/modules/post/entities/post.entity';
import { TagEntity } from '@/modules/tag/tag.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import argon2 from 'argon2';
import _ from 'lodash';
import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederFactory, SeederFactoryManager } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.time('SEEDING TIME');
    const postRepo = dataSource.getRepository(PostEntity);
    const postFactory = factoryManager.get(PostEntity);

    const userFactory = factoryManager.get(UserEntity);

    const tags = await this.seedTags();

    await this.seedAdminAndPosts(tags, postRepo, postFactory);

    const users = await userFactory.saveMany(10);

    for (const user of users) {
      await this.seedPosts(user, tags, postRepo, postFactory);
    }

    console.timeEnd('SEEDING TIME');
  }

  private async seedTags() {
    return await TagEntity.save([
      new TagEntity({ name: 'javascript' }),
      new TagEntity({ name: 'typescript' }),
      new TagEntity({ name: 'reactjs' }),
      new TagEntity({ name: 'nextjs' }),
      new TagEntity({ name: 'nestjs' }),
      new TagEntity({ name: 'express' }),
      new TagEntity({ name: 'nodejs' }),
      new TagEntity({ name: 'docker' }),
      new TagEntity({ name: 'git' }),
      new TagEntity({ name: 'mysql' }),
      new TagEntity({ name: 'redis' }),
      new TagEntity({ name: 'cloudinary' }),
    ]);
  }

  private async seedPosts(
    user: UserEntity,
    tags: TagEntity[],
    postRepo: Repository<PostEntity>,
    postFactory: SeederFactory<PostEntity>,
  ) {
    const totalPosts = 100;

    let postPromises: Promise<PostEntity>[] = [];
    for (let i = 1; i <= totalPosts; i++) {
      postPromises.push(this.makePost(user, tags, postFactory));
    }

    await this.savePostPromises(postPromises, postRepo);
  }

  private async seedAdminAndPosts(
    tags: TagEntity[],
    postRepo: Repository<PostEntity>,
    postFactory: SeederFactory<PostEntity>,
  ) {
    const admin = await UserEntity.save(
      new UserEntity({
        username: 'admin',
        email: 'admin@admin.com',
        password: await argon2.hash('admin123'),
        role: Role.ADMIN,
      }),
    );

    const batchSize = 100;
    const totalPosts = 1000;

    let postPromises: Promise<PostEntity>[] = [];
    for (let i = 1; i <= totalPosts; i++) {
      postPromises.push(this.makePost(admin, tags, postFactory));

      if (postPromises.length === batchSize) {
        console.log(`>>> Adding ${postPromises.length} posts of admin...`);
        this.savePostPromises(postPromises, postRepo);
        postPromises = [];
      }
    }

    // add remaining posts
    if (postPromises.length > 0) this.savePostPromises(postPromises, postRepo);
  }

  private async savePostPromises(
    postPromises: Promise<PostEntity>[],
    postRepo: Repository<PostEntity>,
  ) {
    const posts = await Promise.all(postPromises);
    await postRepo.save(posts);
  }

  private async makePost(
    user: UserEntity,
    tags: TagEntity[],
    postFactory: SeederFactory<PostEntity>,
  ) {
    return postFactory.make({
      createdBy: user.username,
      author: user,
      tags: _.sampleSize(tags, _.random(1, 6)),
    });
  }
}
