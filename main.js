const express = require('express');
const app = express();
const PORT = 3000;

function removeHtmlTags(html) {
    // HTML 태그를 제거하고 텍스트만 반환
    return html.replace(/<[^>]*>/g, '');
}

app.get('/', (req, res) => {
    const msg = req.query.msg;
    if (msg) {
      if(msg == '1') return res.send('1번 매크로');
      if(msg == '2') return res.send('2번 맼');
      if(msg == '3') return res.send('어ㅓㅓ 3');
    }
    else {
      res.send('서버 작동 확인'); // 클라이언트에게 "서버 작동 확인" 응답
    }
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 작동 중입니다.`);
});
