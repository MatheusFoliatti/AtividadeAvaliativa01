import { table } from "node:console";
import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

interface IDatabase {
  id:string
  name:string
  email:string
}

export class Database {
  #database: IDatabase[][] = []
  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2));
  }

  select(table:any, id?: string): IDatabase[] {
    let data = this.#database[table] ?? [];

    if (id) {
      data = data.find((row: any) => {
        return row.id === id;
      });
    }

    return data;
  }

  insert(table:any, data:IDatabase): IDatabase {
    if (Array.isArray(this.#database[table])) {
      // Se sim entra aqui
      this.#database[table].push(data);
      this.#persist();
    } else {
      // Se não entra aqui
      this.#database[table] = [data];
    }

    return data;
  }

  delete(table: any, id: string): void {
    const rowIndex = this.#database[table].findIndex(
      (row: any) => row.id === id
    );

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }

  update(table: any, id: string, data: IDatabase){

    const rowIndex = this.#database[table].findIndex((row:any) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = data;
      this.#persist()
    }
  }
};


