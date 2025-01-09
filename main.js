const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('서버 작동 확인'); // 클라이언트에게 "서버 작동 확인" 응답
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 작동 중입니다.`);
});
