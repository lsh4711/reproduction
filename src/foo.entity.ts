import {Entity, PrimaryKey} from "@mikro-orm/sqlite";

@Entity()
export class Foo {
  @PrimaryKey()
  id!: bigint;
}
