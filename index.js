const express=require('express')
const {ApolloServer}=require('@apollo/server')
const bodyParser=require('body-parser')
const cors=require('cors')
const {expressMiddleware}=require('@apollo/server/express4')
const axios=require('axios')
async function StartServer(){
    const app=express()
    const server= new ApolloServer({
        typeDefs:`

            type User{
            id:ID!
            name:String!
            username:String!
            email:String!
            website:String!
            }

            type Todo{
            id:ID!
            title:String!
            Completed:Boolean
            user:User
            }

            type Query{
            getTodos:[Todo]
            getAllusers:[User]
            getUser(id:ID!):User
            }

        `,    
        resolvers:{
            Todo:{
                user:async(todo)=>(await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data,
            },
            Query:{
                getTodos:async()=> (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
                getAllusers:async()=> (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
                getUser:async(parent,{id})=> (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
            }
        }
    })
    app.use(bodyParser.json())
    app.use(cors())

    await server.start()

    app.use("/graphql",expressMiddleware(server))
    app.listen(4000,()=>{
        console.log(`server is running at 4000`)
    })
}

StartServer()