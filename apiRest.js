/**
 * Atividade de Banco de Dados NOSQL - UFRN
 * API REST para o Mongo
 * Author: Valmir Correa da Silva Junior
 * E-mail: valmircsjr@gmail.com
 * Comandos: 
 *  - Subir o container do Mongo no docker: 
 *      - docker run -p 27017:27017 --name nosql-mongo -d mongo
 *  - Instalar dependencias:
 *      - npm install
 *  - Iniciar aplicação:
 *      - npm start
 *  - Chamdas da API:
 *      - Salvar novos usuários:
 *          - POST: http://localhost:3000/user?username=<NomeDoUsuário>
 *      - Listar Usuários Salvos:
 *          - GET: http://localhost:3000/users
 *      - Listar pelo ID:
 *          - GET: http://localhost:3000/user/<IdDoUsuário>
 */

const express = require('express');
const app = express();
const mongoose = require('mongoose');      
const port = 3000;

/* Mensagem para o Start up da aplicação na porta especificada */
app.listen(port, () => console.log(`App listening on port ${port}!`));

/* Tela inicial da aplicação web */
app.get('/', (req, res) => res.send('Welcome!'));

/* Conectando com o Mongo */
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

/* Verificando conexão */
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Mongo Connected!');
});

/* Modelo do usuário */
var userSchema = new mongoose.Schema({
    username: String,
});

/* Driver do documento de usuários */
var User = mongoose.model('User', userSchema);

/* Salvar novos usuários */
app.post('/user', (req, res) => {

    /* Novo usuário */
    var username = req.query.username;
    var newUser = new User({
        username: username,
    });
    
    /* Ssalvar usuário */
    newUser.save(function(err, thor) {
        if (err) {
            res.send(`Error, sorry!`);
        } else {
            res.send(`Usuário ` + username + ` adicionado!`);
        }
    });
});

/*  GET para listar todos os usuários salvos */
app.get('/users', (req, res) => {
    User.find(function(err, users) {
        if (err) {
            res.send(`Error, sorry!`);
        } else {
            console.dir(users);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(users));
        }
    });
});

/* GET para consultar determinado usuário */
app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id, function (err, user) {
        if (err) {
            res.send(`Error, sorry!`);
        } else {
            res.end(JSON.stringify(user));
        }
    });
});