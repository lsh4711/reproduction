import {Collection, Entity, ManyToMany, MikroORM, PrimaryKey} from "@mikro-orm/postgresql";

@Entity()
class File {

  @PrimaryKey()
  id!: number;

}

@Entity()
class Project {

  @PrimaryKey()
  id!: number;

  @ManyToMany({entity: () => File, owner: true})
  files = new Collection<File>(this);

}

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: "6155",
    entities: [Project, File],
    debug: ["query", "query-params"],
    allowGlobalContext: true
  });
  await orm.schema.refreshDatabase();
});

afterAll(async () => {
  await orm.schema.dropSchema();
  await orm.close(true);
});

test("6155", async () => {
  const projectRepository = orm.em.getRepository(Project);
  await projectRepository.findByCursor({}, {populate: ["files"], first: 20, orderBy: {id: "desc"}});
});
