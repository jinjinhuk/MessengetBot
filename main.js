const express = require('express');
const app = express();
const PORT = 3000;

const { response } = require('./app')

// 주 코드
app.get('/', (req, res) => {
    let query = req.query; // 쿼리 매개변수로 메시지 받기

    const replier = {
        reply(message) {
            // 채팅 메시지를 보냄
            res.send(message);
        }
    }

    response(query.room, query.content, query.name, query.isGroupChat, replier, null)
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 작동 중입니다.`);
});
