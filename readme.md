# potluck


### Development

- `npm install`
- `npm run dev` to start watch for css/js
- Start http server in root and open index.html

### For now, if your tokbox token expires (it will tell you in console)

- `git clone git@github.com:eaze/potluck-tokbox-adapter`
- `cd potluck-tokbox-adapter`
- `npm i`
- `ZUUL_PORT=3000 node test-server`
- `curl -s http://localhost:3000`
- Copy paste resulting token into your app
