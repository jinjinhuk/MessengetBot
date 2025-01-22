import fs from 'fs';  // fs 모듈을 가져옵니다.

export const pets = [
  { name: "고양이", price: 1000, ability: "광물 크기 +5%" },
  { name: "강아지", price: 1500, ability: "광물 크기 +5%" },
  { name: "고양이", price: 1000, ability: "광물 크기 +5%" },
  { name: "강아지", price: 1500, ability: "광물 크기 +5%" },
  { name: "고양이", price: 1000, ability: "광물 크기 +5%" },
  { name: "강아지", price: 1500, ability: "광물 크기 +5%" },
  { name: "고양이", price: 1000, ability: "광물 크기 +5%" },
  { name: "강아지", price: 1500, ability: "광물 크기 +5%" },
  { name: "고양이", price: 1000, ability: "광물 크기 +5%" },
  { name: "강아지", price: 1500, ability: "광물 크기 +5%" },
  { name: "고양이", price: 1000, ability: "광물 크기 +5%" },
  { name: "강아지", price: 1500, ability: "광물 크기 +5%" },
  { name: "고양이", price: 1000, ability: "광물 크기 +5%" },
  { name: "강아지", price: 1500, ability: "광물 크기 +5%" },
  { name: "고양이", price: 1000, ability: "광물 크기 +5%" },
  { name: "강아지", price: 1500, ability: "광물 크기 +5%" },
  { name: "고양이", price: 1000, ability: "광물 크기 +5%" },
  { name: "강아지", price: 1500, ability: "광물 크기 +5%" },
  { name: "고양이", price: 1000, ability: "광물 크기 +5%" },
  { name: "강아지", price: 1500, ability: "광물 크기 +5%" },
  { name: "고양이", price: 1000, ability: "광물 크기 +5%" },
  { name: "강아지", price: 1500, ability: "광물 크기 +5%" },
  { name: "고양이", price: 1000, ability: "광물 크기 +5%" },
  { name: "강아지", price: 1500, ability: "광물 크기 +5%" },
  { name: "고양이", price: 1000, ability: "광물 크기 +5%" },
  { name: "강아지", price: 1500, ability: "광물 크기 +5%" },
  { name: "고양이", price: 1000, ability: "광물 크기 +5%" },
  { name: "강아지", price: 1500, ability: "광물 크기 +5%" },
  { name: "용", price: 5000, ability: "광물 크기 +7%" },
  { name: "페가수스", price: 8000, ability: "광물 크기 +10%" },
  { name: "용", price: 5000, ability: "광물 크기 +7%" },
  { name: "페가수스", price: 8000, ability: "광물 크기 +10%" },
  { name: "용", price: 5000, ability: "광물 크기 +7%" },
  { name: "페가수스", price: 8000, ability: "광물 크기 +10%" },
  { name: "용", price: 5000, ability: "광물 크기 +7%" },
  { name: "페가수스", price: 8000, ability: "광물 크기 +10%" },
  { name: "용", price: 5000, ability: "광물 크기 +7%" },
  { name: "페가수스", price: 8000, ability: "광물 크기 +10%" },
  { name: "용", price: 5000, ability: "광물 크기 +7%" },
  { name: "페가수스", price: 8000, ability: "광물 크기 +10%" },
  { name: "용", price: 5000, ability: "광물 크기 +7%" },
  { name: "페가수스", price: 8000, ability: "광물 크기 +10%" },
  { name: "용", price: 5000, ability: "광물 크기 +7%" },
  { name: "페가수스", price: 8000, ability: "광물 크기 +10%" },
  { name: "용", price: 5000, ability: "광물 크기 +7%" },
  { name: "페가수스", price: 8000, ability: "광물 크기 +10%" },
  { name: "용", price: 5000, ability: "광물 크기 +7%" },
  { name: "페가수스", price: 8000, ability: "광물 크기 +10%" },
  { name: "후띠", price: 15000, ability: "광물 크기 +25%" },
  { name: "프리미엄", price: 13000, ability: "광물 크기 +20%" }
];

export const shopItems = [
  { name: "흙 곡괭이", price: 0, durability: 50 },
  { name: "나무 곡괭이", price: 500, durability: 250 },
  { name: "돌 곡괭이", price: 1000, durability: 600 },
  { name: "철 곡괭이", price: 1900, durability: 1200 },
  { name: "다이아 곡괭이", price: 3600, durability: 2400 },
  { name: "에메랄드 곡괭이", price: 7000, durability: 4800 },
  { name: "무지개 곡괭이", price: 14000, durability: 10000 },
  { name: "2배 광물 아이템", price: 1000, durability: 1 },
  { name: "돈 낭비", price: 1000, durability: 0 }  // 2배 광물 획득 아이템 추가
];

export const minerals = [
  "철광석",
  "금광석",
  "다이아몬드",
  "청금석",
  "흑철",
  "에메랄드",
  "석탄",
  "구리광석",
  "마그네슘",
  "알루미늄",
  "석영",
  "청옥",
  "티타늄",
  "희귀광석",
  "백금",
  "우라늄",
  "바나듐",
  "리튬",
  "불사조의 광석",
  "엑소광석"
];

export const PATH = "./data/userData.json";

export const userData = (() => {
  if (!fs.existsSync(PATH)) {
    fs.writeFileSync(PATH, "{}");  // 파일이 없으면 빈 JSON 객체를 작성합니다.
  }
  return JSON.parse(fs.readFileSync(PATH, 'utf8'));  // 파일을 읽고 JSON으로 파싱합니다.
})();

export const isMining = {};

export const lastExecutedTime = {};