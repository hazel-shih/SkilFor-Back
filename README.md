## 簡介

這是 Skilfor 後端原始碼，採用 Express + Sequelize 開發。

[網站連結](https://skilfor.netlify.app/#/)

## 建置

### 前置作業

複製`.env.example`並改名成`.env`，並且設置裡面的環境變數：

* 資料庫資訊
  * DB_USERNAME
  * DB_PASSWORD
  * DB_DATABASE
  * DB_HOST
* jwt 資訊
  * PW_SALTROUNDS
  * MB_SECRETKEY
* 學生初始點數
  * MB_INITIALPOINTS

完成後 `npm install` 安裝所需套件，最後 `npx sequelize-cli db:migrate` 建立所有資料表。

### 開發

1. `npm run dev`

### 部署

1. `npm run pm2`

### 其他資源

* [Skilfor 前端原始碼](https://github.com/hazel-shih/SkilFor-Front)
* [API 文件](https://skilfor.docs.apiary.io/#reference/0/api-place-orders)
* [資料庫藍圖](https://dbdiagram.io/d/618def4b02cf5d186b526854)
 
