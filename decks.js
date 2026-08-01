/* ============================================================
   配對高手 · 內建字庫資料
   來源：使用者提供的 ESL Word Bank（English Code L1 / L3 / L4）
   - 有老師英文定義的週次 → 單字 ↔ 英文定義
   - 只有單字的週表      → 單字 ↔ 中文（中文為補充翻譯）
   每個物件：{ emoji, name, pairs:[[左, 右], ...] }
   index.html 載入時會自動配上 id。
   ============================================================ */
window.BUILTIN_DECKS = [

/* ========== 定義配對（老師原始定義卷，單字 ↔ 英文定義） ========== */
{ emoji:"📝", name:"L3·W3 定義配對 (才藝/動物)", pairs:[
  ["talent show","a competition to find the best singer or dancer, performed on a stage"],
  ["do magic tricks","perform tricks that seem impossible, to entertain people"],
  ["spin around","to quickly turn your body to face the opposite direction"],
  ["do gymnastics","physical exercises for developing strength and balance"],
  ["do cartwheels","move sideways with hands on the ground and feet in the air"],
  ["stamping","to bring your foot down heavily and noisily"],
  ["waving","to move your hand in a repeated motion to signal or greet someone"],
  ["juggling","to keep several objects in the air by throwing and catching them"],
  ["clapping","to hit the palms of your hands together loudly"],
  ["acting","to perform the words and actions of a character in a play or movie"],
  ["dropping","to fall or to allow something to fall"],
  ["dolphin","a small usually gray sea mammal with a pointed nose"],
  ["whale","a very large mammal that lives in the ocean"],
  ["kangaroo","an Australian animal that moves by hopping on its back legs"],
  ["parrot","a tropical bird with a curved beak that can copy the human voice"]
]},
{ emoji:"📝", name:"L3·W5 定義配對 (動作/居家)", pairs:[
  ["practicing","to do something regularly in order to become skilled at it"],
  ["spinning","to turn around and around"],
  ["stepping","to move by lifting your foot and putting it down in a new place"],
  ["jumping","to push yourself suddenly off the ground into the air using your legs"],
  ["running","to move forward faster than walking"],
  ["taking photos","to create an image with a camera or phone"],
  ["avatar","an image that represents you in online games or chat rooms"],
  ["movement","a change of position"],
  ["in order","to make sure that it is neat or well organized"],
  ["man","an adult male human being"],
  ["elevator","a box-like device that moves up and down carrying people between floors"],
  ["blanket","a flat cover made of warm material, used on a bed"],
  ["basement","a part of a building below the level of the ground"],
  ["upstairs","towards or on a higher floor of a building"],
  ["address","the house number and road where a person lives and letters are sent"]
]},
{ emoji:"📝", name:"L3·W15 定義配對 (比較級/自然)", pairs:[
  ["the best","better than all others in quality or value"],
  ["the worst","worse than all others"],
  ["hungrier","more wanting or needing food"],
  ["incredible","difficult or impossible to believe"],
  ["adventure","an exciting or dangerous experience"],
  ["the most beautiful","more attractive than all others"],
  ["the shortest","smallest in length, distance, or height"],
  ["the craziest","very strange or unusual"],
  ["more","to a great degree"],
  ["the most","in or to the greatest degree"],
  ["rainbow","a curved line of colors in the sky when sun shines through rain"],
  ["treasure","something valuable that is hidden or kept in a safe place"],
  ["field","an open area of land without trees or buildings"],
  ["plant","a living thing that grows in the ground and needs sun and water"],
  ["leaves","flat, typically green parts of a plant that grow from a stem"]
]},
{ emoji:"📝", name:"L4·W8 定義配對 (形容詞/頻率)", pairs:[
  ["empty","having nothing inside; no things or people"],
  ["skill","an ability to do an activity or job well"],
  ["be full of","having a lot; having no empty space"],
  ["logo","a design or symbol used by a company to advertise its products"],
  ["costume","a set of clothes for a country, period, or specific activity"],
  ["bored","feeling unhappy because there's nothing engaging to do"],
  ["public","relating to or involving people in general"],
  ["organize","to make arrangements for something to happen"],
  ["competition","when people try to win or be more successful than others"],
  ["diary","a book in which you record your thoughts each day"],
  ["channel","a television station"],
  ["always","every time or all the time"],
  ["often","many times"],
  ["sometimes","on some occasions but not always or often"],
  ["never","not at any time or not on any occasion"]
]},

/* ========== L1 二年級（English Code Unit4-8）單字 ↔ 中文 ========== */
{ emoji:"🧍", name:"L1·身體與感官 Body", pairs:[
  ["arms","手臂"],["ears","耳朵"],["eyes","眼睛"],["face","臉"],["feet","腳（複數）"],
  ["nose","鼻子"],["head","頭"],["hair","頭髮"],["legs","腿"],["mouth","嘴巴"],
  ["hands","手"],["nail","指甲"],["smell","聞；嗅覺"],["taste","嚐；味覺"],
  ["hear","聽"],["touch","摸；觸覺"]
]},
{ emoji:"🐹", name:"L1·動物 Animals", pairs:[
  ["horse","馬"],["frog","青蛙"],["rabbit","兔子"],["mouse","老鼠"],["lizard","蜥蜴"],
  ["hamster","倉鼠"],["spider","蜘蛛"],["tortoise","陸龜"],["bee","蜜蜂"],["turtle","海龜"],
  ["bird","鳥"],["insect","昆蟲"],["tail","尾巴"]
]},
{ emoji:"🏃", name:"L1·動作 Verbs", pairs:[
  ["jump","跳"],["swim","游泳"],["climb","爬"],["fly","飛"],["run","跑"],
  ["drink","喝"],["walk","走"],["eat","吃"]
]},
{ emoji:"🍓", name:"L1·水果 Fruits", pairs:[
  ["mango","芒果"],["pear","梨子"],["grape","葡萄"],["banana","香蕉"],["watermelon","西瓜"],
  ["pineapple","鳳梨"],["kiwi","奇異果"],["strawberry","草莓"],["fruit","水果"],["lemon","檸檬"],
  ["orange","柳橙"],["papaya","木瓜"],["plum","李子"]
]},
{ emoji:"🥗", name:"L1·食物 Food", pairs:[
  ["smoothie","冰沙"],["lemonade","檸檬水"],["salad","沙拉"],["menu","菜單"],
  ["candy","糖果"],["bowl","碗"],["delicious","美味的"]
]},
{ emoji:"🎨", name:"L1·興趣活動 Activities", pairs:[
  ["activity","活動"],["dance","跳舞"],["draw","畫（素描）"],["paint","畫（著色）"],
  ["read a book","讀書"],["play soccer","踢足球"],["play music","演奏音樂"],["climb trees","爬樹"],
  ["ride a bike","騎腳踏車"],["ride a horse","騎馬"],["ride a scooter","騎滑板車"],
  ["play a board game","玩桌遊"],["play the drum","打鼓"],["play the piano","彈鋼琴"]
]},
{ emoji:"👕", name:"L1·衣物 Clothes", pairs:[
  ["clothes","衣服"],["T-shirt","T恤"],["hat","帽子"],["cap","鴨舌帽"],["dress","洋裝"],
  ["sweater","毛衣"],["shoes","鞋子"],["shorts","短褲"],["skirt","裙子"],["socks","襪子"],
  ["pants","長褲"],["gloves","手套"]
]},
{ emoji:"📍", name:"L1·位置介系詞 Prepositions", pairs:[
  ["on","在…上面"],["in","在…裡面"],["under","在…下面"],["near","在…附近"],
  ["next to","在…旁邊"],["between","在…之間"]
]},
{ emoji:"🌦️", name:"L1·時間與天氣 Time & Weather", pairs:[
  ["in the morning","在早上"],["in the afternoon","在下午"],["in the evening","在晚上"],
  ["weather","天氣"],["sunny","晴朗的"],["rainy","下雨的"],["windy","有風的"],
  ["snowy","下雪的"],["cloudy","多雲的"],["umbrella","雨傘"]
]},
{ emoji:"✨", name:"L1·更多常用字 More Words", pairs:[
  ["magic","魔法"],["perfect","完美的"],["favorite","最愛的"],["plant","植物"],["leaf","葉子"],
  ["grow","生長"],["robot","機器人"],["recycle","回收"],["garden","花園"],["moon","月亮"],
  ["night","夜晚"],["window","窗戶"],["elbow","手肘"],["boat","船"],["coat","外套"],
  ["life cycle","生命週期"],["tadpole","蝌蚪"],["circus","馬戲團"]
]},

/* ========== L3 中年級（2025-1 English Code）單字 ↔ 中文 ========== */
{ emoji:"🏫", name:"L3·W1 學校與科目", pairs:[
  ["welcome","歡迎"],["favorite","最愛的"],["subject","科目"],["history","歷史"],["geography","地理"],
  ["language","語言"],["technology","科技"],["music","音樂"],["math","數學"],["science","科學"],
  ["sports","運動"],["cafeteria","自助餐廳"],["playground","操場"],["classroom","教室"],["library","圖書館"]
]},
{ emoji:"🙋", name:"L3·W2 校園態度", pairs:[
  ["polite","有禮貌的"],["listen","聽"],["work hard","努力"],["be kind","友善"],["take turns","輪流"],
  ["remember","記得"],["forget","忘記"],["lose","失去；輸"],["yourself","你自己"],["learn","學習"],
  ["travel","旅行"],["jacket","夾克"],["backpack","背包"],["school","學校"],["English","英文"]
]},
{ emoji:"🎪", name:"L3·W3 才藝表演", pairs:[
  ["talent show","才藝表演"],["do magic tricks","變魔術"],["spin around","旋轉"],["do gymnastics","做體操"],["do cartwheels","側手翻"],
  ["stamping","跺腳"],["waving","揮手"],["juggling","拋接雜耍"],["clapping","拍手"],["acting","表演；演戲"],
  ["dropping","掉落"],["dolphin","海豚"],["whale","鯨魚"],["kangaroo","袋鼠"],["parrot","鸚鵡"]
]},
{ emoji:"🕺", name:"L3·W4 舞台動作", pairs:[
  ["step forward","向前一步"],["step backward","向後一步"],["step to the side","向旁邊一步"],["together","一起"],["routine","一套動作；例行"],
  ["perform","表演"],["tablet","平板電腦"],["play video games","打電動"],["stage","舞台"],["awesome","很棒的"],
  ["animation","動畫"],["stomach","胃；肚子"],["headache","頭痛"],["moustache","八字鬍"],["cough","咳嗽"]
]},
{ emoji:"🏢", name:"L3·W5 動作與居家", pairs:[
  ["practicing","練習"],["spinning","旋轉"],["stepping","踏步"],["jumping","跳"],["running","跑"],
  ["taking photos","拍照"],["avatar","虛擬化身"],["movement","動作；移動"],["in order","整齊有序"],["man","男人"],
  ["elevator","電梯"],["blanket","毯子"],["basement","地下室"],["upstairs","樓上"],["address","地址"]
]},
{ emoji:"🏞️", name:"L3·W6 副詞與地景", pairs:[
  ["badly","差勁地"],["quietly","安靜地"],["loudly","大聲地"],["well","好地"],["beautifully","美麗地"],
  ["carefully","小心地"],["really","真正地"],["slowly","慢慢地"],["quickly","快速地"],["drawing","繪畫"],
  ["actions","動作"],["helicopter","直升機"],["forest","森林"],["waterfall","瀑布"],["mountain","山"]
]},
{ emoji:"🦣", name:"L3·W8 冰河與城鎮", pairs:[
  ["frozen","結冰的"],["tusk","象牙"],["tail","尾巴"],["wing","翅膀"],["trunk","象鼻；樹幹"],
  ["Ice Age","冰河時期"],["scary","可怕的"],["hairy","多毛的"],["cuddly","惹人抱的"],["exhibit","展覽品"],
  ["repair","修理"],["town","城鎮"],["city centre","市中心"],["supermarket","超級市場"],["station","車站"]
]},
{ emoji:"⛈️", name:"L3·W9 天氣與外貌", pairs:[
  ["snowy","下雪的"],["windy","有風的"],["rainy","下雨的"],["icy","結冰的"],["cloudy","多雲的"],
  ["weather","天氣"],["heatwave","熱浪"],["hail","冰雹"],["thunderstorm","雷雨"],["hurricane","颶風"],
  ["alive","活著的"],["weak","虛弱的"],["straight","直的"],["blonde","金髮的"],["surprised","驚訝的"]
]},
{ emoji:"🦖", name:"L3·W10 遠古與醫院", pairs:[
  ["woolly mammoth","長毛象"],["dinosaur","恐龍"],["skeleton","骨骼"],["visit","參觀；拜訪"],["museum","博物館"],
  ["category","類別"],["extinct","絕種的"],["human","人類"],["was","是（過去）"],["were","是（過去複數）"],
  ["yesterday","昨天"],["hospital","醫院"],["doctor","醫生"],["nurse","護理師"],["curly","捲的"]
]},
{ emoji:"🏝️", name:"L3·W11 旅行與地形", pairs:[
  ["saber tooth tiger","劍齒虎"],["footprint","腳印"],["vacation","假期"],["restaurant","餐廳"],["country","國家；鄉下"],
  ["capital","首都"],["traditional","傳統的"],["thick","厚的"],["exchange","交換"],["local","當地的"],
  ["hop","單腳跳"],["island","島"],["jungle","叢林"],["lake","湖"],["river","河"]
]},
{ emoji:"🎆", name:"L3·W13 節慶", pairs:[
  ["festival","節慶"],["parade","遊行"],["noisy","吵鬧的"],["celebrate","慶祝"],["firework","煙火"],
  ["comfortable","舒適的"],["delicious","美味的"],["quiet","安靜的"],["thirsty","口渴的"],["lantern","燈籠"],
  ["float","漂浮；花車"],["holiday","假日"],["fishing","釣魚"],["texting","傳簡訊"],["camping","露營"]
]},
{ emoji:"🎬", name:"L3·W14 形容詞與電影", pairs:[
  ["amazing","驚人的"],["boring","無聊的"],["interesting","有趣的"],["disgusting","噁心的"],["exciting","刺激的"],
  ["relaxing","放鬆的"],["tasty","美味的"],["colorful","多彩的"],["happier","更快樂的"],["sadder","更難過的"],
  ["bigger","更大的"],["laughing","大笑"],["dress up","打扮"],["ticket","票"],["cinema","電影院"]
]},
{ emoji:"🌈", name:"L3·W15 比較級與自然", pairs:[
  ["the best","最好的"],["the worst","最差的"],["hungrier","更餓的"],["incredible","難以置信的"],["adventure","冒險"],
  ["the most beautiful","最美的"],["the shortest","最短的"],["the craziest","最瘋狂的"],["more","更多"],["the most","最（程度）"],
  ["rainbow","彩虹"],["treasure","寶藏"],["field","田野"],["plant","植物"],["leaves","葉子（複數）"]
]},
{ emoji:"🪁", name:"L3·W16 意見與生活", pairs:[
  ["mice","老鼠（複數）"],["opinion","意見"],["important","重要的"],["rise","上升"],["popular","受歡迎的"],
  ["famous","有名的"],["celebration","慶祝活動"],["agree","同意"],["cage","籠子"],["kite","風箏"],
  ["towel","毛巾"],["seat","座位"],["road","道路"],["street","街道"],["awake","醒著的"]
]},
{ emoji:"🚀", name:"L3·W22 太空啟航", pairs:[
  ["journey","旅程"],["launch","發射"],["rocket","火箭"],["floated","漂浮（過去）"],["traveled","旅行（過去）"],
  ["breathe","呼吸"],["space","太空"],["astronaut","太空人"],["satellite","衛星"],["space station","太空站"],
  ["blast off","升空發射"],["supper","晚餐"],["balcony","陽台"],["clever","聰明的"],["most famous","最有名的"]
]},
{ emoji:"👽", name:"L3·W23 太空任務", pairs:[
  ["alien","外星人"],["international","國際的"],["engineering","工程"],["decide","決定"],["mission","任務"],
  ["specialist","專家"],["shuttle","太空梭"],["American","美國的"],["university","大學"],["realistic","逼真的"],
  ["simulator","模擬器"],["handbag","手提包"],["trousers","長褲"],["mirror","鏡子"],["cupboard","櫥櫃"]
]},
{ emoji:"🔭", name:"L3·W24 探索宇宙", pairs:[
  ["huge","巨大的"],["explore","探索"],["telescope","望遠鏡"],["continent","大陸；洲"],["medicine","藥"],
  ["pancake","鬆餅"],["experience","經驗"],["social media","社群媒體"],["cute","可愛的"],["cube","立方體"],
  ["stone","石頭"],["shoulder","肩膀"],["neck","脖子"],["thin","瘦的；薄的"],["thicker","更厚的"]
]},

/* ========== L4 高年級（2024-1 English Code）單字 ↔ 中文 ========== */
{ emoji:"🏖️", name:"L4·W2 假期與序數", pairs:[
  ["beach","海灘"],["cousins","表／堂兄弟姊妹"],["delicious","美味的"],["Spain","西班牙"],["postcard","明信片"],
  ["vacation","假期"],["celebrate","慶祝"],["important","重要的"],["task","任務"],["grandparents","祖父母"],
  ["first","第一"],["second","第二"],["third","第三"],["fourth","第四"],["fifth","第五"]
]},
{ emoji:"🔢", name:"L4·W3 序數與溝通", pairs:[
  ["sixth","第六"],["seventh","第七"],["eighth","第八"],["ninth","第九"],["tenth","第十"],
  ["eleventh","第十一"],["twelfth","第十二"],["thirteenth","第十三"],["twentieth","第二十"],["thirtieth","第三十"],
  ["agree","同意"],["confused about","對…感到困惑"],["explain","解釋"],["invitation","邀請函"],["include","包含"]
]},
{ emoji:"🧭", name:"L4·W4 露營探險", pairs:[
  ["balance","平衡"],["collect","收集"],["make a camp","紮營"],["swing","盪；擺動"],["branch","樹枝"],
  ["explore","探索"],["adventure","冒險"],["lighthouse","燈塔"],["shipwreck","沉船"],["whistle","哨子"],
  ["compass","指南針"],["search","搜尋"],["flash","閃光"],["blow","吹"],["get lost","迷路"]
]},
{ emoji:"🎒", name:"L4·W5 裝備與訊息", pairs:[
  ["blanket","毯子"],["matches","火柴"],["wheel","輪子"],["boots","靴子"],["gloves","手套"],
  ["cross","穿越"],["stream","小溪"],["flow","流動"],["equipment","裝備"],["dictionary","字典"],
  ["crash","撞毀"],["message","訊息"],["location","位置"],["useful","有用的"],["item","物品"]
]},
{ emoji:"🏠", name:"L4·W6 樹屋與方向", pairs:[
  ["tree house","樹屋"],["bridge","橋"],["plans","計畫"],["partner","夥伴"],["knife","刀"],
  ["describe","描述"],["pirate","海盜"],["follow","跟隨"],["cable","纜繩"],["imagine","想像"],
  ["opposite","相反的"],["direction","方向"],["outdoors","戶外"],["sailboat","帆船"],["local","當地的"]
]},
{ emoji:"🔺", name:"L4·W7 手作與實驗", pairs:[
  ["triangle","三角形"],["bottle","瓶子"],["connect","連接"],["popsicle sticks","冰棒棍"],["clay","黏土"],
  ["strength","力量"],["schedule","時間表"],["press","按壓"],["information","資訊"],["accident","意外"],
  ["smash","打碎"],["took out","拿出"],["communication","溝通"],["go sailing","去航行"],["experiment","實驗"]
]},
{ emoji:"🏛️", name:"L4·W9 古文明", pairs:[
  ["exhibition","展覽"],["century","世紀"],["capital","首都"],["empire","帝國"],["pyramid","金字塔"],
  ["jewelry","珠寶"],["invent","發明"],["calendar","日曆"],["create","創造"],["built","建造（過去）"],
  ["backyard","後院"],["pottery","陶器"],["metal","金屬"],["treasure","寶藏"],["middle","中間"]
]},
{ emoji:"🗿", name:"L4·W10 遺跡與設計", pairs:[
  ["sandals","涼鞋"],["system","系統"],["belong to","屬於"],["meter","公尺"],["ruins","遺跡"],
  ["ancient","古老的"],["building","建築物"],["maize","玉米"],["keyhole","鑰匙孔"],["summary","摘要"],
  ["fair","公平的；展覽會"],["square","正方形；廣場"],["feather","羽毛"],["design","設計"],["statue","雕像"]
]},
{ emoji:"⚽", name:"L4·W11 方位與運動", pairs:[
  ["compare","比較"],["northern","北方的"],["southern","南方的"],["central","中央的"],["weigh","秤重"],
  ["protection","保護"],["score","得分"],["goal","目標；球門"],["goalkeeper","守門員"],["court","球場"],
  ["aim","瞄準；目標"],["through","穿過"],["go bowling","去打保齡球"],["fantasy","幻想"],["daily life","日常生活"]
]},
{ emoji:"🏰", name:"L4·W12 宮殿與發現", pairs:[
  ["material","材料"],["palace","宮殿"],["position","位置"],["outskirts","郊區"],["article","文章"],
  ["amazing","驚人的"],["discovery","發現"],["probably","可能"],["symbol","符號"],["Egypt","埃及"],
  ["vertical","垂直的"],["horizontal","水平的"],["represent","代表"],["historian","歷史學家"],["director","導演；主任"]
]},
{ emoji:"🪐", name:"L4·W15 太空生活", pairs:[
  ["space","太空"],["gravity","重力"],["astronaut","太空人"],["float","漂浮"],["experience","經驗"],
  ["handle","把手；處理"],["colony","殖民地"],["pollute","污染"],["control","控制"],["panel","面板"],
  ["radio","收音機"],["planet","行星"],["promise","承諾"],["return","返回"],["orbit","軌道"]
]},
{ emoji:"🛰️", name:"L4·W16 太空船", pairs:[
  ["commander","指揮官"],["oxygen","氧氣"],["fuel","燃料"],["screen","螢幕"],["engine","引擎"],
  ["breathe","呼吸"],["solution","解決方法"],["secret","秘密"],["spacecraft","太空船"],["percentage","百分比"],
  ["tourist","遊客"],["research","研究"],["vehicle","車輛"],["waste","浪費；廢物"],["another","另一個"]
]},
{ emoji:"♻️", name:"L4·W17 能源與建議", pairs:[
  ["seat","座位"],["energy","能量"],["recycle","回收"],["uniform","制服"],["electric","電動的"],
  ["feature","特色"],["present","禮物；現在"],["improvement","改善"],["suggestion","建議"],["brochure","手冊"],
  ["signature","簽名"],["tight","緊的"],["impossible","不可能的"],["destroy","破壞"],["adult","成人"]
]},
{ emoji:"🧊", name:"L4·W18 物質與未來", pairs:[
  ["navigator","導航員"],["distance","距離"],["source","來源"],["echo","回音"],["object","物體"],
  ["normally","通常"],["outer space","外太空"],["transportation","交通運輸"],["liquid","液體"],["solid","固體"],
  ["project","專案"],["in the future","在未來"],["length","長度"],["weight","重量"],["suddenly","突然"]
]},
{ emoji:"🎏", name:"L4·W23 文化與慶典", pairs:[
  ["wise","有智慧的"],["helpful","有幫助的"],["celebration","慶祝活動"],["culture","文化"],["routine","例行公事"],
  ["forwards","向前"],["backwards","向後"],["burn","燃燒"],["village","村莊"],["scream","尖叫"],
  ["stamp","郵票；蓋章"],["remember","記得"],["technology","科技"],["magical","神奇的"],["noise","噪音"]
]},
{ emoji:"🪸", name:"L4·W24 環境與細節", pairs:[
  ["quality","品質"],["instruction","指示"],["label","標籤"],["colorful","多彩的"],["environment","環境"],
  ["shining","閃耀的"],["coral reef","珊瑚礁"],["detail","細節"],["ceremony","典禮"],["dart","飛鏢"],
  ["edge","邊緣"],["eclipse","日／月食"],["jet plane","噴射機"],["flight","飛行"],["average","平均"]
]},
{ emoji:"⚖️", name:"L4·W25 起源與品德", pairs:[
  ["origin","起源"],["continue","繼續"],["equal","相等的"],["liter","公升"],["supper","晚餐"],
  ["event","事件"],["witness","目擊者"],["statement","陳述"],["push into","推入"],["greedy","貪心的"],
  ["scared","害怕的"],["traditional","傳統的"],["dangerous","危險的"],["brave","勇敢的"],["price","價格"]
]}

];
