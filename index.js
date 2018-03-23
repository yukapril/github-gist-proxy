const request = require('request')
const fs = require('fs')
const Koa = require('koa')
const app = new Koa()

const readFile = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                reject(err)
                return
            }
            resolve(data)
        })
    })
}

const getGist = (url, useragent) => {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: url,
            headers: {
                'user-agent': useragent
            }
        }, (err, response, body) => {
            if (err) {
                reject(err)
                return
            }
            resolve({ response, body })
        })
    })
}

app.use(async ctx => {
    const reqUrl = ctx.request.url
    if (reqUrl === '' || reqUrl === '/') {
        // homepage
        ctx.set('content-type', 'text/html; charset=utf-8')
        ctx.body = await readFile('./index.html')
    } else {
        // proxy
        const prefix = 'https://gist.github.com'
        // const prefix = 'https://gist.coding.net'
        const url = prefix + reqUrl
        try {
            const { response, body } = await getGist(url, ctx.headers['user-agent'])
            ctx.status = response.statusCode
            ctx.set('content-type', response.headers['content-type'])
            ctx.body = body
        } catch (err) {
            console.log(err)
            ctx.body = ''
        }
    }
})

app.listen(5001)
