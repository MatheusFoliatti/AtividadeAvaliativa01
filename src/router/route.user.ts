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
  const {name, saldo ,transicao} = request.body;

 const result = database.select(table, id,);

 if(result === undefined) response.status(400).json({msg:'User not found'})

 database.update(table, id, {id, name, saldo, transicao})

  response.json(result)
})

//Adicionar um usuário
userRoute.post('/', (request, response ) => {
const {name, saldo ,transicao} = request.body;

const user = {
  id: randomUUID(),
  name,
  saldo,
  transicao
  };

  database.insert(table, user);

response.status(201).send({msg:'ok'});
});

// Deletar pelo ID
userRoute.delete('/:id', (request, response) => {
  const {id} = request.params

  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'User not found'});

    database.delete(table, id)

    response.status(202).json(
      {msg: `O usuário ${userExist.name} foi deletado com sucesso!` });
});

// Editar o Usuário pelo ID
userRoute.put('/:id', (request,response)=>{

  const {id} = request.params
  const {name, saldo, transicao} = request.body

  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'User not found'});

    database.update(table, id, {id, name, saldo, transicao})

    response.status(201).json(
      {msg: `O usuário ${userExist.name} foi atualizado!` });

})

// Retirada do saldo pelo ID
userRoute.put('/retirada/:id', (request,response)=>{

  const {id} = request.params
  const {name, transicao: [{ tipo, valor }]} = request.body

  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'User not found'});

    let transicao = userExist.transicao
    transicao.push({ tipo, valor })
    console.log(transicao)
    let saldo = userExist.saldo
    database.update(table, id, { id, name, saldo: saldo - valor, transicao })

    response.status(201).json(
      {msg: ` Você retirou R$${valor} reais` });

})

// Deposito do saldo pelo ID
userRoute.put('/deposito/:id', (request,response)=>{

  const {id} = request.params
  const {name, transicao: [{ tipo, valor}]} = request.body

  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'User not found'});

    let transicao = userExist.transicao
    transicao.push({tipo, valor})
    console.log(transicao)
    let saldo = userExist.saldo
    database.update(table, id, {id, name, saldo: saldo + valor, transicao})

    response.status(201).json(
      {msg: ` Você depositou R$${valor} reais` });
})

userRoute.get('/', (request, response)=>{

  response.send(`Rota userRote ON.`)
})

export {userRoute}
