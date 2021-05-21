const fs = require('fs');

const frag = {
    header: fs.readFileSync(__dirname + '/../public/fragments/header.html', 'utf-8')
};

const indexfrag = {
    head: fs.readFileSync(__dirname + '/../public/index/index-head.html', 'utf-8'),
    body: fs.readFileSync(__dirname + '/../public/index/index.html', 'utf-8')
};

const loginfrag = {
    head: fs.readFileSync(__dirname + '/../public/authentication/login/login-head.html', 'utf-8'),
    body: fs.readFileSync(__dirname + '/../public/authentication/login/login.html', 'utf-8')
};

const registerfrag = {
    head: fs.readFileSync(__dirname + '/../public/authentication/register/register-head.html', 'utf-8'),
    body: fs.readFileSync(__dirname + '/../public/authentication/register/register.html', 'utf-8')
};

const index = indexfrag.head + frag.header + indexfrag.body;
const login = loginfrag.head + frag.header + loginfrag.body;
const register = registerfrag.head + frag.header + registerfrag.body;

module.exports = {
    index, login, register
}