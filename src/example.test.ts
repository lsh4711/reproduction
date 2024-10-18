import {Entity, MikroORM, PrimaryKey, Property} from "@mikro-orm/mariadb";

@Entity()
class User {

  @PrimaryKey()
  id!: number;

  @Property()
  firstName!: string;

  @Property()
  language!: string;

  constructor(firstName: string, language: string) {
    this.firstName = firstName;
    this.language = language;
  }

}

let orm: MikroORM;

describe("6153", () => {

  beforeAll(async () => {
    orm = await MikroORM.init({
      dbName: "6153",
      port: 3309,
      entities: [User],
      debug: ["query", "query-params"],
      allowGlobalContext: true
    });
    await orm.schema.refreshDatabase();
  });

  afterAll(async () => {
    await orm.schema.dropDatabase();
    await orm.close(true);
  });

  test("", async () => {
    const userRepository = orm.em.getRepository(User);

    await userRepository.insert(new User("1", "1"));

    const result1 = await userRepository.findOne({id: 1}, {fields: ["id"]});
    expect(result1).toEqual({id: 1});

    const result2 = await userRepository.findOne({id: 1}, {
      fields: [
        "firstName",
        "id",
        "language"
      ]
    });
    expect(result2).not.toEqual({id: 1});

    expect(result2).toBe(result1);
  });

});
