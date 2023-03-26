import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database:any = [];

  constructor(){
    fs.readFile(databasePath, 'utf8')
    .then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      fs.writeFile(databasePath, JSON.stringify({}, null, 2))
    })
  }

  //catch = Quando não ocorre a promesa, ocorre um callback
  //parse = Converte uma string para um objeto
  //Stringfy = Converte um objeto para uma string

  #persist(){

    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2))
  }

  select(table: any, id?: string): object {
    let data = this.#database[table] ?? []

    if(id){ data = data.find((row:any) => {
      return row.id === id;
    })};

    return data
  }

  insert(table: any, data:object): object {

    if(Array.isArray(this.#database[table])) {
      // Insere um dado
      this.#database[table].push(data);
      this.#persist();
    } else {
      // Altera um dado
      this.#database[table] = [data]
    }

    return data
  }

  delete(table:any, id:string): void{

    //Procura o ID para deletar
    const rowIndex  = this.#database[table].findIndex((row:any) => row.id === id)

    //Valida o ID e então deleta
    if(rowIndex > -1){
      this.#database[table].slice(rowIndex, 1);
      this.#persist();
    }
  }

  update(table:any, id:string, data:object): void{

    const rowIndex = this.#database[table].findIndex((row:any)=> row.id === id);

    if(rowIndex > -1) {
      this.#database[table][rowIndex] = data

      this.#persist()
    }

  }
}
