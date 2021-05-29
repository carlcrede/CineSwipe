const fs = require('fs');

const head = fs.readFileSync(__dirname + '/../public/fragments/head.html', 'utf-8');
const nav = fs.readFileSync(__dirname + '/../public/fragments/header.html', 'utf-8');
const footer = fs.readFileSync(__dirname + '/../public/fragments/footer.html', 'utf-8')

const body = {
    index: fs.readFileSync(__dirname + '/../public/index/index.html', 'utf-8'),
    login: fs.readFileSync(__dirname + '/../public/authentication/login/login.html', 'utf-8'),
    register: fs.readFileSync(__dirname + '/../public/authentication/register/register.html', 'utf-8')
}

const index = head + nav + body.index + footer;
const login = head + nav + body.login + footer;
const register = head + nav + body.register + footer;

module.exports = {
    index, login, register
}