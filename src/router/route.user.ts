import { Router } from "express";
import { Database } from '../database';
import { randomUUID } from 'node:crypto';

const userRoute = Router();

const database = new Database();

const table = "user";

// Request - Requisição
// Response - Resposta
userRoute.get('/', (request, response ) => {

  const user = database.select(table);

  response.json(user)
});

userRoute.get('/:id', (request, response) => {
  const {id} = request.params

 const result = database.select(table, id);

 if(result === undefined) response.status(400).json({msg:'Usuarios nao encontrado'})

  response.json(result)
})

//Adicionar usuário
userRoute.post('/', (request, response ) => {
const {name, transacao, cep, cpf, cidade} = request.body;

const user = {
  id: randomUUID(),
  name,
  cep,
  cpf,
  cidade,
  saldo: 0,
  transacao
  };

  database.insert(table, user);

response.status(201).send({msg:'Conta Criada!'});
});

//Deletar Usuário
userRoute.delete('/:id', (request, response) => {
  const {id} = request.params
  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Usuario nao encontrado'});

    database.delete(table, id)

    response.status(202).json(
      {msg: `Usuario ${userExist.name} deletado`});
});

//Editar Usuário
userRoute.put('/:id', (request,response)=>{
  const {id} = request.params
  const {name, cep, cpf, cidade} = request.body
  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Usuario nao encontrado'});

    //Usuário encontrado
    const user:any = {name, cpf, cidade, cep};

    const filteredUser: any = {};
      for (const key in user) {
        if (user[key] !== undefined) {
      filteredUser[key] = user[key];
    }
  }
    const infoDB:any = {...userExist, ...filteredUser}
    database.update(table, id, infoDB);

    response.status(202).json(
      {msg: `Usuario ${userExist.name} alterado` });
})

//Retirar dinheiro da conta
userRoute.put('/retirada/:id', (request,response)=>{

  const {id} = request.params
  const {tipo, valor} = request.body

  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Usuario nao encontrado'});

  if(userExist.saldo >= valor){

    const name = userExist.name;

    let transacao = userExist.transacao
    transacao.push(tipo, valor)
    let saldo = userExist.saldo
    database.update(table, id, {name, saldo: saldo - Number(valor), transacao})

    response.status(201).json(
      {msg: ` Foi retidado o valor de  ${valor} na conta ${name}` });
    }
    else{
      response.status(404).json(
        {msg: 'Saldo insuficiente para retirada'}
      )
    }
})

//Deposito da grana
userRoute.put('/deposito/:id', (request,response)=>{

  const {id} = request.params
  const {tipo, valor} = request.body

  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Usuario nao encontrado'});

    const name = userExist.name;
    let transacao = userExist.transacao
    transacao.push(tipo, valor);
    let saldo = userExist.saldo
    database.update(table, id, {name, saldo: saldo + Number(valor), transacao})

    response.status(201).json(
      {msg: ` Foi depositado o valor de  ${valor} na conta ${name}` });

})

userRoute.get('/', (request, response)=>{

  response.send(`Rota userRote ON.`)
})

export {userRoute}
