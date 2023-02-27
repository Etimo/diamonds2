import { DataSource } from "typeorm";
import { dataSource } from "./datasource";
export const databaseProviders = [
  {
    provide: "DATA_SOURCE",
    useFactory: async () => {
      return dataSource.initialize();
    },
  },
];
