const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());
const port = 3000;
app.use(express.static("public"))
app.use('/static', express.static(path.join(__dirname, 'public')));
mongoose.connect('mongodb://127.0.0.1:27017/fiapbooks',{
    useNewUrlParser : true,
    useUnifiedTopology : true
    //serverSelectionTimeoutMS : 20000
})

//model padrão 
const UsuarioSchema = new mongoose.Schema({
    nome : {type : String},
    email : {type : String, require : true},
    senha : {type : String}
})
 const Usuario = mongoose.model("Usuario", UsuarioSchema)

 app.post("/cadastrousuario", async(req, res)=>{
    const nome = req.body.nome; 
    const email = req.body.email;
    const senha = req.body.senha;

    if (nome == null || email == null || senha == null){
        return res.status(400).json({error : "Preencha todos os campos!"})
    }

    const emailExiste = await Usuario.findOne({email : email})

    if(emailExiste){
        return res.status(400).json({error : "Esse email já existe."}) 
    }

    const usuario = new Usuario({
        nome : nome,
        email : email,
        senha : senha
    })

    try{
        const newUsuario = await usuario.save()
        res.json({error : null, msg : "Cadastrado com sucesso!"})
    }

    catch(error){
        res.status(400).json((error))
    }

 })

 //model especifica
 const ProdutoSchema = new mongoose.Schema({
    codigo : {type : String, require : true},
    descricao : {type : String },
    fornecedor : {type : String},
    fabricacao : {type : Date},
    estoque : {type : Number}
 })

 const Produto = mongoose.model("Produto", ProdutoSchema)

 app.post("/cadastroproduto", async(req, res)=>{
    const codigo = req.body.codigo
    const descricao = req.body.descricao
    const fornecedor = req.body.fornecedor
    const fabricacao = req.body.fabricacao
    const estoque = req.body.estoque
 
    if (codigo == null || descricao == null || fornecedor == null || fabricacao == null || estoque == null){
        return res.status(400).json({error : "Preencha todos os campos!"})
    }

    const codigoExiste = await Produto.findOne({codigo : codigo})

    if(codigoExiste){
        return res.status(400).json({error : "O codigo desse produto já existe!"})
    }

    const produto = new Produto({
        codigo : codigo,
        descricao : descricao,
        fornecedor : fornecedor,
        fabricacao : fabricacao,
        estoque : estoque
    })

    try{
        const newProduto = await produto.save()
        res.json({error : null, msg : "Cadastrado com sucesso!", produtoId : newProduto._id});
    } 
    catch(error){
        res.status(400).json((error))
    }
})

app.get("/cadastrousuario", async (req,res)=>{
    res.sendFile(__dirname + "/cadastrousuario.html")
})

app.get("/cadastroproduto", async (req,res)=>{
    res.sendFile(__dirname + "/cadastroproduto.html")
})

app.get("/", async (req,res)=>{
    res.sendFile(__dirname + "/index.html")
})

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`)
});
