// Abstract class mà các entity sẽ kế thừa
abstract class AbstractEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// Class User kế thừa từ AbstractEntity
class User extends AbstractEntity {
  name: string;
  email: string;
}

// Class Post kế thừa từ AbstractEntity
class Post extends AbstractEntity {
  title: string;
  content: string;
}

// Hàm generic để chọn các prop
function selectProps<T extends AbstractEntity>(
  props: Array<keyof T>,
  defaults: Array<keyof T>,
): Array<keyof T> {
  return [...new Set([...props, ...defaults])];
}

// Sử dụng hàm với các class entity
const userProps = selectProps<User>(['email'], ['id', 'createdAt']);
const postProps = selectProps<Post>(['title'], ['id', 'updatedAt']);

console.log(userProps); // Output: ['name', 'id', 'createdAt']
console.log(postProps); // Output: ['title', 'id', 'updatedAt']
