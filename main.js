const express = require('express');
const app = express();
const PORT = 3000;

// 주 코드
app.get('/', (req, res) => {
    console.log(req);
    let msg = req.query.msg; // 쿼리 매개변수로 메시지 받기
    let message = `받은 메시지: ${msg}`;
    res.send(message); // 채팅 메시지를 보냄
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 작동 중입니다.`);
});
