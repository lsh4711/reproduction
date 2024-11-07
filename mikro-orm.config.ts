import {defineConfig} from "@mikro-orm/sqlite";
import {Foo} from "./src/foo.entity";

export default defineConfig({
  dbName: ":memory:",
  entities: [Foo]
});
