import { User } from "@/modules/user/entities/user.entity";
import { setSeederFactory } from "typeorm-extension";

export const UserFactory = setSeederFactory(User, (faker) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const user = new User();

  user.username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
  user.email = faker.internet.email();
  user.password = "12345678";
  user.avatar = faker.image.avatar();
  user.bio = faker.lorem.sentence();

  return user;
});
