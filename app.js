const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/node-boilerplate'
//uGw8uw8MbtIruMma
const app = express()

mongoose.connect(url, {useNewUrlParser:true})
const con = mongoose.connection

con.on('open', () => {
    console.log('connected...')
})

app.use(express.json())

const cors = require('cors');

app.use(cors({
    origin: '*'
}));

const clients = require('./routes/clients')
const accounts = require('./routes/accounts')


app.use('/clients',clients);
app.use('/accounts',accounts);

const port = process.env.port || 3080;

app.listen(port, () => {
    console.log(`started on ${port}`)
})