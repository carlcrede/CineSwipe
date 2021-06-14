const fs = require('fs');

const head = fs.readFileSync(__dirname + '/../public/fragments/head.html', 'utf-8');
const nav = fs.readFileSync(__dirname + '/../public/fragments/header.html', 'utf-8');
const footer = fs.readFileSync(__dirname + '/../public/fragments/footer.html', 'utf-8');

const body = {
    index: fs.readFileSync(__dirname + '/../public/index/index.html', 'utf-8'),
    login: fs.readFileSync(__dirname + '/../public/authentication/login/login.html', 'utf-8'),
    register: fs.readFileSync(__dirname + '/../public/authentication/register/register.html', 'utf-8'),
    preferences: fs.readFileSync(__dirname + '/../public/user/preferences/preferences.html', 'utf-8'),
    requestlogin: fs.readFileSync(__dirname + '/../public/user/request-login.html', 'utf-8'),
    404: fs.readFileSync(__dirname + '/../public/errors/404.html', 'utf-8'),
    500: fs.readFileSync(__dirname + '/../public/errors/500.html', 'utf-8')
}

const prepare = (function(){
    Object.keys(body).forEach((key) => {
        body[key] = head + nav + body[key] + footer;
    });
}());

module.exports = {
    ...body
}