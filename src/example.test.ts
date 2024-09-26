import {EntitySchema, type EntitySchemaMetadata, MikroORM, type Options} from "@mikro-orm/mysql";

type Key = "unsigned" | "signed";

type Property = { id: number };

const entity: Record<Key, EntitySchemaMetadata<Property>> = {
  unsigned: {
    name: "entity",
    properties: {id: {primary: true, type: "bigint", unsigned: true}}
  },
  signed: {
    name: "entity",
    properties: {id: {primary: true, type: "bigint", unsigned: false}}
  }
};

let orm: MikroORM;

afterAll(async () => {
  await orm.close(true);
});

test("MySQL: Should include auto_increment.", async () => {
  const dbInfo: Options = {dbName: "GH6072", port: 3308};
  orm = await MikroORM.init({entities: [new EntitySchema(entity.unsigned)], ...dbInfo});
  await orm.schema.refreshDatabase();
  const property = orm.getMetadata().get<Property>("entity").properties.id;

  property.unsigned = false;
  const sql1 = await orm.schema.getUpdateSchemaSQL({wrap: false});
  expect(sql1).toMatch(/^alter table `entity` modify `id` bigint not null auto_increment;.*/);
});
