import { pets, PATH, isMining, lastExecutedTime, minerals, shopItems, userData } from './globalData.js'
import fs from 'fs'; // fs 모듈 임포트

export function response(room, msg, sender, igc, replier, data) {
  if (msg === "*광질 시작") {
    if (isCooldown(sender)) return;
    checkUser(sender);
    if (!isMining[sender]) {
      if (!hasPickaxe(sender)) {
        replier.reply("곡괭이가 없으므로 광질을 시작할 수 없습니다. 상점에서 곡괭이를 구입하세요.");
        return;
      }
      let pickaxe = getPickaxe(sender);
      if (pickaxe.durability <= 0) {
        replier.reply("곡괭이가 부서졌습니다. 새로운 곡괭이를 구입하세요.");
        return;
      }
      startMining(sender, userData[sender], replier, pickaxe);
    } else {
      replier.reply("이미 광물을 캐고 있습니다");
    }
  }

  if (msg === "*상점") {
    getShopItems(replier);
  }

  if (msg.startsWith('*구매 ')) {
    let itemName = msg.slice(4);
    checkUser(sender);
    buyItem(sender, itemName, replier);
  }


  // (중략) 기존 코드 유지
  if (msg === '*광산 레벨') {
    checkUser(sender);
    replier.reply(sender + "\u202d님의 광산 레벨은 " + userData[sender].level + "입니다\n" +
      "다음 레벨까지 필요한 경험치: " + userData[sender].point + "/" + getPoint(userData[sender].level));
  }
  if (msg === "*인벤토리") {
    checkUser(sender);
    replier.reply(getInventory(sender));
  }
  if (msg === "*광물 랭킹") {
    replier.reply("광물 랭킹입니다\n" + "\u200b".repeat(1000) + getRank());
  }
  if (msg.startsWith('*판매 ')) {
    checkUser(sender);
    let mineralName = msg.slice(4); // !판매 뒤에 있는 광물 이름을 가져옴
    sellMineral(sender, mineralName, replier);
  }
  if (msg.startsWith('*일괄 판매 ')) { // 일괄 판매 기능 추가
    checkUser(sender);
    let mineralName = msg.slice(7); // !일괄 판매 뒤에 있는 광물 이름을 가져옴
    sellAllMinerals(sender, mineralName, replier); // 일괄 판매 함수 호출
  }
  if (msg === "*내 돈") {
    checkUser(sender);
    replier.reply(sender + "\u202d님의 총 금액은 " + userData[sender].money + "원입니다.");
  }
  if (msg === "*펫 뽑기") {
    if (isCooldown(sender)) return;
    checkUser(sender);
    petDraw(sender, replier);
  }
  // *내 펫 명령어로 사용자가 보유한 펫을 확인
  if (msg === "*내 펫") {
    checkUser(sender);
    showPets(sender, replier);
  }
  // *펫 장착 (펫이름) 명령어 처리
  if (msg.startsWith("*펫 장착")) {
    checkUser(sender);
    let petName = msg.slice(6).trim();  // 명령어 뒤에 있는 펫 이름을 가져옴
    equipPet(sender, petName, replier);
  }
  // *펫 판매 (펫이름) 명령어 처리
  if (msg.startsWith("*펫 판매")) {
    checkUser(sender);
    let petName = msg.slice(6).trim();  // 명령어 뒤에 있는 펫 이름을 가져옴
    sellPet(sender, petName, replier);
  }




  function isCooldown(sender) {
    const currentTime = new Date().getTime();
    if (lastExecutedTime[sender]) {
      const elapsedTime = currentTime - lastExecutedTime[sender];
      if (elapsedTime < 1000) { // 120000ms = 2분
        const remainingTime = Math.ceil((1000 - elapsedTime) / 1000); // 남은 시간(초)
        replier.reply(sender + "님 쿨타임이" + remainingTime + "초 남았습니다.");
        return true;
      }
    }
    lastExecutedTime[sender] = currentTime; // 현재 시간을 마지막 실행 시간으로 설정
    return false;
  }
  // 펫 판매 함수
  function sellPet(name, petName, replier) {
    if (!userData[name].pets || userData[name].pets.length === 0) {
      replier.reply("펫을 보유하고 있지 않습니다. 펫을 뽑아보세요!");
      return;
    }

    // 사용자가 선택한 펫이 보유한 펫 목록에 있는지 확인
    let petIndex = userData[name].pets.findIndex(pet => pet.name === petName);

    if (petIndex === -1) {
      replier.reply("보유한 펫 목록에 " + petName + "이(가) 없습니다.");
      return;
    }

    // 판매할 펫의 능력치에 따라 금액을 계산 (예: 능력치가 판매 금액에 반영됨)
    let pet = userData[name].pets[petIndex];
    let petPrice = calculatePetPrice(pet);  // 펫의 능력치를 기반으로 판매 금액 계산

    // 판매 후 금액 증가
    userData[name].money += petPrice;

    // 판매된 펫 인벤토리에서 제거
    userData[name].pets.splice(petIndex, 1);

    // 데이터를 저장
    saveData();

    replier.reply(name + "님이 " + petName + "을(를) " + petPrice + "원에 판매하여 총 금액이 " + userData[name].money + "원이 되었습니다.");
  }

  // 펫의 판매 가격을 능력치를 기반으로 계산하는 함수
  function calculatePetPrice(pet) {
    // 펫의 능력치에서 판매 금액을 계산 (여기서는 능력치의 숫자 부분을 가져와서 가격을 설정)
    let abilityValue = parseInt(pet.ability.match(/\d+/)[0]);
    return abilityValue * 100;  // 능력치의 값에 100을 곱해서 가격 설정
  }

  function showPets(name, replier) {
    if (!userData[name].pets || userData[name].pets.length === 0) {
      replier.reply("보유한 펫이 없습니다. 펫을 뽑아보세요!");
      return;
    }

    let petsList = name + "님의 보유한 펫 목록:\n" + "\u200b".repeat(500) + "\n";
    userData[name].pets.forEach(pet => {
      petsList += pet.name + " - 능력치: " + pet.ability + "\n";
    });

    replier.reply(petsList);
  }


  // *내 펫 명령어 처리
  if (msg === "*내 펫") {
    checkUser(sender);
    showCurrentPet(sender, replier);
  }

  // 사용자가 착용 중인 펫을 출력하는 함수
  function showCurrentPet(name, replier) {
    if (userData[name].equippedPet) {
      replier.reply(name + "님이 장착 중인 펫은 " + userData[name].equippedPet.name + "입니다.");
    } else {
      replier.reply(name + "님은 현재 장착 중인 펫이 없습니다.");
    }
  }




  // 펫 장착 함수
  function equipPet(name, petName, replier) {
    if (!userData[name].pets || userData[name].pets.length === 0) {
      replier.reply("펫을 보유하고 있지 않습니다. 펫을 뽑아보세요!");
      return;
    }

    // 사용자가 선택한 펫이 보유한 펫 목록에 있는지 확인
    let pet = userData[name].pets.find(pet => pet.name === petName);

    if (!pet) {
      replier.reply("보유한 펫 목록에 " + petName + "이(가) 없습니다.");
      return;
    }

    // 펫을 착용했는지 확인 (기존 펫이 있으면 교체)
    userData[name].equippedPet = pet;  // 장착한 펫을 기록

    // 데이터를 저장
    saveData();

    replier.reply(name + "님이 " + petName + "을(를) 장착했습니다!\n능력치: " + pet.ability);
  }

  // 펫 장착 상태 확인 함수 (현재 장착된 펫을 확인)
  function getEquippedPet(name) {
    if (userData[name].equippedPet) {
      return userData[name].equippedPet;
    }
    return null;
  }


}

function petDraw(name, replier) {
  // 펫 뽑기 비용을 확인하고, 금액이 부족하면 메시지 출력
  const userMoney = userData[name].money;
  const petCost = 5000;  // 펫 뽑기 비용 설정

  if (userMoney < petCost) {
    replier.reply("펫을 뽑기 위해서는 " + petCost + "원이 필요합니다. 금액을 충전하세요.");
    return;
  }

  // 금액 차감
  userData[name].money -= petCost;

  // 랜덤으로 펫을 뽑음
  const pet = getRandomPet();

  // 뽑은 펫을 사용자 데이터에 추가
  if (!userData[name].pets) {
    userData[name].pets = [];  // 펫을 보유할 배열 생성
  }
  userData[name].pets.push(pet);

  // 데이터 저장
  saveData();

  // 펫 정보와 능력치 출력
  replier.reply(name + "님이 " + pet.name + "을(를) 뽑았습니다!\n" + "능력치: " + pet.ability + "\n현재 금액: " + userData[name].money + "원");
}

// 랜덤 펫 뽑기
function getRandomPet() {
  const randomIndex = Math.floor(Math.random() * pets.length);
  return pets[randomIndex];
}


function checkUser(name) {
  if (!Object.prototype.hasOwnProperty.call(userData, name)) {
    userData[name] = {
      inventory: [],
      level: 1,
      point: 0,
      money: 0 // 금액을 추적하는 변수 추가
    };
    saveData();
  }
  if (!Object.prototype.hasOwnProperty.call(isMining, name)) {
    isMining[name] = false;
  }
}

function saveData() {
  const fileStream = fs.createWriteStream(PATH); // PATH를 사용하여 FileStream 정의
  fileStream.write(JSON.stringify(userData)); // userData를 JSON 문자열로 변환하여 저장
  fileStream.end();
}

function startMining(name, data, send, pickaxe) {
  isMining[name] = true;

  // 광질을 시작하기 전에 곡괭이 내구도를 출력
  send.reply(name + "\u202d님이 광물을 캐기 시작했습니다. \n-⛏️-⛏️-⛏️-⛏️-\n사용 중인 곡괭이: " + pickaxe.name + "\n현재 내구도: " + pickaxe.durability);

  // 광질을 시작하기 전에 곡괭이 내구도가 충분한지 체크
  if (pickaxe.durability <= 0) {
    send.reply(name + "\u202d님의 " + pickaxe.name + "이(가) 부서졌습니다.\n☠️☠️☠️");
    isMining[name] = false;
    return;  // 광질을 시작하지 않음
  }

  // 곡괭이 내구도 감소
  pickaxe.durability -= 10; // 광질 할 때마다 내구도 10 감소

  // 내구도가 0 이하가 되지 않도록 방지
  if (pickaxe.durability < 0) {
    pickaxe.durability = 0;
  }

  // 내구도가 0 이하로 떨어지지 않도록 갱신
  updatePickaxeDurability(name, pickaxe);

  // 광질 수행 (내구도가 남아있는 경우)
  setTimeout(() => {
    send.reply(getRandomMineral(data, data.level, name));
  }, (10 + Math.floor(Math.random() * 20)) * 1000);

  // 광질이 끝난 후 상태를 갱신
  isMining[name] = false;
}

function updatePickaxeDurability(name, pickaxe) {
  // 곡괭이 내구도 갱신
  for (let i = 0; i < userData[name].inventory.length; i++) {
    if (userData[name].inventory[i][1] === pickaxe.name) {
      userData[name].inventory[i][0] = pickaxe.durability;
      break;
    }
  }
  saveData();
}

function hasDoubleMineralItem(name) {
  // 사용자의 아이템 중 '2배 광물 아이템'이 있는지 확인
  return userData[name].inventory.some(item => item[1] === "2배 광물 아이템");
}

function useDoubleMineralItem(name) {
  let inventory = userData[name].inventory;
  let itemIndex = inventory.findIndex(item => item[1] === "2배 광물 아이템");

  if (itemIndex !== -1) {
    // 2배 광물 아이템 사용 후 인벤토리에서 제거
    inventory.splice(itemIndex, 1);
    saveData();
    return true;
  }
  return false; // 아이템이 없으면 false 반환
}



// 광물 크기를 계산하는 함수
function getMineralSize(name) {
  let baseSize = Math.random() * 10 + 5; // 기본 광물 크기 (예시로 5~15 사이)

  // 펫 능력치 반영
  const petBonus = getPetBonus(name);
  baseSize *= petBonus; // 펫 능력치가 반영된 크기

  return baseSize;
}

// 펫의 능력치 계산 함수 (광물 크기 증가 반영)
function getPetBonus(name) {
  if (!userData[name].pets || userData[name].pets.length === 0) return 1;  // 펫이 없으면 효과 없음

  let bonus = 1;
  userData[name].pets.forEach(pet => {
    if (pet.ability.includes("광물 크기")) {
      const bonusPercentage = parseInt(pet.ability.match(/\d+/)[0]); // 능력치에서 숫자만 추출
      bonus += bonusPercentage / 100; // 광물 크기 증가
    }
  });
  return bonus;
}

// 광물을 캐는 함수
function getRandomMineral(data, level, name) {
  var chance = Math.pow(level, 1 / 3) * 21;
  var baseSize = Math.random() * level * 10; // 기본 광물 크기

  // 펫 능력치 반영하여 광물 크기 증가
  const mineralSize = getMineralSize(name); // 펫 효과를 반영한 광물 크기
  baseSize *= mineralSize;  // 펫 능력에 따른 크기 증가

  while (chance < (Math.random() * 100)) {
    baseSize *= 1 + Math.random() * 0.04;
  }
  baseSize = Math.floor(baseSize);

  // 광물 정보 처리
  var mineral = randomName();
  data.inventory.push([baseSize, mineral]);
  data.point += baseSize;
  checkLevel(data);
  saveData();
  return name + "님이 " + baseSize + "g " + mineral + "을(를) 캐냈습니다.\n⛏️⛏️⛏️";
}



function getPickaxe(name) {
  const pickaxes = ["흙 곡괭이", "나무 곡괭이", "돌 곡괭이", "철 곡괭이", "다이아 곡괭이", "에메랄드 곡괭이", "무지개 곡괭기", "관리자 곡괭이"];
  for (let i = 0; i < userData[name].inventory.length; i++) {
    let item = userData[name].inventory[i];
    if (pickaxes.includes(item[1])) {
      return { name: item[1], durability: item[0] };
    }
  }
  return null; // 곡괭이가 없으면 null 반환
}

function hasPickaxe(name) {
  return getPickaxe(name) !== null;
}

function checkLevel(data) {
  while (data.level < 100) {
    if (data.point > getPoint(data.level)) {
      data.level++;
    } else {
      break;
    }
  }
  saveData();
}

function getPoint(level) {
  return level * level * level + level * 500;
}



function randomName() {
  return minerals[minerals.length * Math.random() | 0];
}

function getInventory(name) {
  let i1 = userData[name].inventory;
  return "\u200b".repeat(1000) + Object.keys(i1).sort((y, x) => i1[x][0] - i1[y][0]).map(x => i1[x][0] + "g " + i1[x][1]).join("\n");
}

function getRank() {
  return Object.keys(userData).sort(function (x, y) {
    let i2 = userData[x].inventory;
    let i1 = userData[y].inventory;
    if (!i1.length) {
      return true;
    }
    if (!i2.length) {
      return false;
    }
    return i1[Object.keys(i1).sort((y, x) => i1[x][0] - i1[y][0])[0]][0] - i2[Object.keys(i2).sort((y, x) => i2[x][0] - i2[y][0])[0]][0];
  }).map((x, xx) => (xx + 1) + "위 " + x + "\u202d" + getBigMineral(x)).join("\n\n");
}

function getBigMineral(name) {
  let i1 = userData[name].inventory;
  return i1.length === 0 ? "" : "(" + i1[Object.keys(i1).sort((y, x) => i1[x][0] - i1[y][0])[0]][0] + "g)";
}

// 광물 일괄 판매 함수 (곡괭이는 판매하지 않도록 수정)
function sellAllMinerals(name, mineralName, replier, data) {
  let inventory = userData[name].inventory;
  let soldMineralCount = 0;
  let totalMoneyEarned = 0;

  // 인벤토리에서 해당 광물을 모두 찾아서 판매
  for (let i = inventory.length - 1; i >= 0; i--) {
    if (inventory[i][1] === mineralName) {
      let mineral = inventory[i];

      // 곡괭이인지 체크 (곡괭이는 판매할 수 없음)
      const pickaxes = ["흙 곡괭이", "나무 곡괭이", "돌 곡괭이", "철 곡괭이", "다이아 곡괭이", "에메랄드 곡괭이", "무지개 곡괭이"];
      if (pickaxes.includes(mineral[1])) {
        continue; // 곡괭이는 판매하지 않고 넘어감
      }

      let mineralSize = mineral[0];
      let mineralPrice = mineralSize * 10;
      userData[name].money += mineralPrice; // 팔고 얻은 금액을 더함
      inventory.splice(i, 1); // 광물 삭제
      soldMineralCount++;
      totalMoneyEarned += mineralPrice;
    }
  }

  if (soldMineralCount === 0) {
    replier.reply("소유한 광물 목록에 해당 광물이 없습니다.");
  } else {
    saveData();
    replier.reply(name + "님이 " + mineralName + "을(를) " + soldMineralCount + "개 판매하여 총 금액이 " + userData[name].money + "원이 되었습니다.💰💰\n" +
      "판매로 얻은 금액: " + totalMoneyEarned + "원💰💰");
  }
}

// 광물 판매 함수 (곡괭이는 판매하지 않도록 수정)
function sellMineral(name, mineralName, replier, data) {
  let inventory = userData[name].inventory;
  let mineralIndex = inventory.findIndex(mineral => mineral[1] === mineralName); // 광물 이름으로 찾기

  if (mineralIndex === -1) {
    replier.reply("소유한 광물 목록에 해당 광물이 없습니다.");
    return;
  }

  let mineral = inventory[mineralIndex];

  // 곡괭이인지 체크 (곡괭이는 판매할 수 없음)
  const pickaxes = ["흙 곡괭이", "나무 곡괭이", "돌 곡괭이", "철 곡괭이", "다이아 곡괭이", "에메랄드 곡괭이", "무지개 곡괭이"];
  if (pickaxes.includes(mineral[1])) {
    replier.reply("곡괭이는 판매할 수 없습니다.\n⚠️⚠️⚠️⚠️");
    return;
  }

  let mineralSize = mineral[0];
  let mineralPrice = mineralSize * 10; // 광물 가격을 크기의 10배로 설정
  userData[name].money += mineralPrice; // 팔고 얻은 금액을 더함
  inventory.splice(mineralIndex, 1); // 광물 삭제
  saveData();
  replier.reply(name + "님이 " + mineralName + "을(를) " + mineralPrice + "원에 판매하여 총 금액이 " + userData[name].money + "원이 되었습니다.");
}

function getShopItems(replier) {
  let shopList = "🏪🏪상점 목록🏪🏪:\n" + "\u200b".repeat(500) + "\n" + "내구도는 -10식 빠짐" + "\n";
  shopItems.forEach(item => {
    shopList += item.name + "--내구도: " + item.durability + "\n" + " - 가격: " + item.price + "원\n";
  });
  replier.reply(shopList);
}

function buyItem(name, itemName, replier) {
  const item = shopItems.find(item => item.name === itemName);
  if (!item) {
    replier.reply("해당 아이템은 상점에 없습니다.");
    return;
  }

  if (userData[name].money < item.price) {
    replier.reply("금액이 부족합니다. " + item.price + "원이 필요합니다.");
    return;
  }

  userData[name].money -= item.price;
  userData[name].inventory.push([item.durability, itemName]); // 구매한 아이템을 내구도와 함께 인벤토리에 추가
  saveData();
  replier.reply(itemName + "을(를) " + item.price + "원에 구매하셨습니다.");
}