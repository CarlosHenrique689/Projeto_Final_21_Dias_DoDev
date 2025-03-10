const { GoogleSpreadsheet } = require('google-spreadsheet');
const credenciais = require('./credentials.json');
const arquivo = require('./arquivo.json');
const { JWT } = require('google-auth-library');

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets'
];

const jwt = new JWT({
    email: credenciais.client_email,
    key: credenciais.private_key,
    scopes: SCOPES,
});

async function GetDoc(){
    const documento = new GoogleSpreadsheet(arquivo.id, jwt)
    await documento.loadInfo()
    return documento
};

async function ReadWorkSheet(){
    let folhas = (await GetDoc()).sheetsByIndex[0]
    let linhas = await folhas.getRows()
    let usuarios = linhas.map(linha => {
        return linha.toObject()
    })
    return usuarios
};

async function AddUser(data = {}){
    const resposta = await fetch("https://retoolapi.dev/5N35Jx/APIdeUsuarios",
        {method: "POST",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify(data)
        }
    )
    return resposta.json()
};

async function TrackData(){
    let data = await ReadWorkSheet();
    data.map(async (usuarios) => {
        let resposta = await AddUser(usuarios)
        console.log(resposta)
    })
    return console.log("Dados copiados com sucesso")
};

TrackData();