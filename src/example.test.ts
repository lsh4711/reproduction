import {MikroOrmModule} from "@mikro-orm/nestjs";
import {EntityManager, MikroORM} from "@mikro-orm/sqlite";
import {Test, TestingModule} from "@nestjs/testing";

let testModule: TestingModule;
let orm: MikroORM;

afterAll(async () => {
  await orm.close(true);
  await testModule.close();
});

/*
6.3.14-dev.56 will pass
6.3.14-dev.(57 ~ 69) will fail due to signature issue
6.3.14-dev.70 will fail due to dynamic import issue and needs `ConfigurationLoader.commonJSCompat()`
 */
test("6.3.14-dev.70", async () => {
  testModule = await Test.createTestingModule({
    imports: [MikroOrmModule.forRoot()]
  }).compile();
  orm = testModule.get(MikroORM);

  expect(orm).toBeDefined();
  expect(orm.config.get("contextName")).toBe("default");
  expect(testModule.get(EntityManager)).toBeDefined();
});
