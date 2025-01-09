const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    const msg = req.query.msg;
    if (msg) {
      if(msg == '1') {
        res.send('1번 매크로');
      }
      else if(msg == '2') {
        res.send('2번 맼');
      }
      else if(msg == '3방') {
        res.send('어ㅓㅓ 3'); 
      }
      else {
        res.send(msg + 'v2');
      }
    }
    else {
      res.send('서버 작동 확인'); // 클라이언트에게 "서버 작동 확인" 응답
    }
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 작동 중입니다.`);
});
