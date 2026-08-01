# 配對高手 Mobile App

這是原始配對遊戲的手機版 PWA。保留單人配對、雙人對戰、拼字、聽寫、自建字庫與最佳紀錄，並新增：

- Android／iPhone 主畫面安裝
- 全螢幕 App 顯示
- 離線遊玩
- 320px 起的雙欄觸控牌面
- iPhone 安全區與 Android 手勢列適配
- 鍵盤焦點與螢幕閱讀器標示

## 直接開啟

[https://linhercherng.github.io/quizlet-match-mobile-app/](https://linhercherng.github.io/quizlet-match-mobile-app/)

## 手機安裝

在手機瀏覽器開啟上方網址：

- Android Chrome：點頁面上的「安裝 App」，或瀏覽器選單 →「安裝應用程式」。
- iPhone Safari：分享 →「加入主畫面」→「新增」。

安裝後可直接從手機主畫面全螢幕啟動；第一次完整開啟後，沒有網路也能玩。

## 本機預覽

在此資料夾啟動任一靜態網站伺服器，不要直接雙擊 `index.html`，因為瀏覽器不允許 `file://` 頁面註冊離線服務。

例如已安裝 Node.js 時：

```powershell
npx serve .
```

## 驗證

```powershell
npm test
```
