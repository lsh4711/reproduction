import {Entity, MikroORM, PrimaryKey, Property} from "@mikro-orm/mysql";

@Entity()
class User {

  @PrimaryKey({ unsigned: false })
  id!: bigint; // number(int) has the same issue.

  @Property()
  age!: bigint;

  @Property({ unsigned: false })
  price!: bigint;

  @Property({ unsigned: true })
  phone!: bigint;

}

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: 'mysql_schema_name',
    entities: [User],
    debug: ['query', 'query-params'],
    allowGlobalContext: true, // only for testing
  });
  await orm.schema.refreshDatabase();
});

afterAll(async () => {
  await orm.close(true);
});

// This test must pass.
test('basic CRUD example', async () => {
  const generator = orm.schema;
  const createDump = await generator.getCreateSchemaSQL();
  const [id, age, price, phone] = createDump
      .match("create table `user` \\((.+)\\).*;")![1]
      .split(", ");

  expect(id).toBe('`id` bigint not null auto_increment primary key');
  expect(age).toBe('`age` bigint not null');
  expect(price).toBe('`price` bigint not null');
  expect(phone).toBe('`phone` bigint unsigned not null');
});
