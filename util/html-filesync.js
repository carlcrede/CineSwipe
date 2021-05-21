const fs = require('fs');

const indexfrags = {
    head: fs.readFileSync(__dirname + '/../public/index/index-head.html', 'utf-8'),
    body: fs.readFileSync(__dirname + '/../public/index/index.html', 'utf-8')
}

const loginfrags = {
    head: fs.readFileSync(__dirname + '/../public/authentication/login/login-head.html', 'utf-8'),
    body: fs.readFileSync(__dirname + '/../public/authentication/login/login.html', 'utf-8')
}

const frag = {
    header: fs.readFileSync(__dirname + '/../public/fragments/header.html', 'utf-8')
}

const body = {
    index: fs.readFileSync(__dirname + '/../public/index/index.html', 'utf-8'),
    
}

const index = indexfrags.head + frag.header + indexfrags.body;
const login = loginfrags.head + frag.header + loginfrags.body;

module.exports = {
    index, login
}