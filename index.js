const request = require('request')
const Koa = require('koa')
const app = new Koa()

const getGist = (url) => {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: url
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
    const prefix = 'https://gist.github.com'
    // const prefix = 'https://gist.coding.net'
    const url = prefix + ctx.request.url
    try {
        const { response, body } = await getGist(url)
        ctx.status = response.statusCode
        ctx.set('content-type', response.headers['content-type'])
        ctx.body = body
    } catch (err) {
        console.log(err)
        ctx.body = ''
    }
})

app.listen(5001)
