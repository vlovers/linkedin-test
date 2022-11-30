'use-strict'

const https = require('https');
const accessToken = require('./token.json').access_token;
const fs = require('fs');

getCookieData(accessToken).then(r => {
    console.log(`{"cookie": [${r.headers['set-cookie']}]}`)
    fs.writeFile("./cookie.json",`{"cookie": [${r.headers['get-cookie']}]}` , e => {if(e){console.log('ERROR - ' + e)}});
    console.log(r);
}).catch(e => console.log(e));

function getCookieData(accessToken) {
    return new Promise((res, rej) => {
        let hostname = 'api.linkedin.com';
        let path = '/v2/me';
        let method = 'GET';
        let headers = {
            'Authorization': 'Bearer ' + accessToken,
            'cache-control': 'no-cache',
            'X-Restli-Protocol-Version': '2.0.0',
            'Content-Type': 'application/json',
            'x-li-format': 'json',
        };
        _request(method, hostname, path, headers).then(r => {
            res(r);
        }).catch(e => rej(e))
    })
}

// Generic HTTP requester
function _request(method, hostname, path, headers, body) {
    return new Promise((resolve, reject) => {
        let reqOpts = {
            method,
            hostname,
            path,
            headers,
            "rejectUnauthorized": false // WARNING: accepting unauthorised end points for testing ONLY
        };
        let resBody = "";
        let req = https.request(reqOpts, res => {
            res.on('data', data => {
                resBody += data.toString('utf8');
            });
            res.on('end', () => {
                resolve({
                    "status": res.statusCode,
                    "headers": res.headers,
                    "body": resBody
                })
            });
        });
        req.on('error', e => {
            reject(e);
        });
        if (method !== 'GET') {
            req.write(body);
        }
        req.end();
    })
}
