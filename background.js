import { PRESET_APIS } from "./config.js";

// === 内置笑话池 ===

const JOKE_POOL = [
  { setup: "为什么程序员不用眼镜？", punchline: "因为他 C#（看不清）" },
  { setup: "一个 bug 走进了酒吧，酒保说：", punchline: "「这不是 bug，这是 feature」" },
  { setup: "我的植物死了，我给它听了好多音乐", punchline: "后来我才知道它只是需要浇水，不是需要演唱会" },
  { setup: "我问我妈：我是不是你亲生的？", punchline: "我妈说：你看看你自己，像吗？" },
  { setup: "为什么我的代码跑不了？", punchline: "因为它懒得动" },
  { setup: "老板问我：你最大的缺点是什么？", punchline: "我说：太诚实。老板说：我不觉得这是缺点。我说：我不在乎你怎么觉得" },
  { setup: "去面试，面试官问：你有什么特长？", punchline: "我说：我特别擅长把简单的事情搞复杂" },
  { setup: "我养了一条鱼，它死了", punchline: "我怀疑它是被我盯死的" },
  { setup: "为什么电脑不会感冒？", punchline: "因为它有 Windows 但没有 immune system" },
  { setup: "我告诉朋友我失眠了", punchline: "朋友说：你可以数羊啊。我数了，现在我想吃烤全羊" },
  { setup: "医生说：你需要戒掉手机。我说：好的", punchline: "然后用手机搜了一下「如何戒掉手机」" },
  { setup: "为什么猫不跟狗玩？", punchline: "因为猫觉得狗的品味太低了，还追自己的尾巴" },
  { setup: "我跟我爸说我要当网红", punchline: "我爸说：你先当个网不红试试" },
  { setup: "老师问：如果你有5块钱，你妈又给了你5块，你有多少？", punchline: "5块。因为我的钱就是我的，不存在的" },
  { setup: "为什么冰箱会说话？", punchline: "因为它有冰口（病口）" },
  { setup: "我跟室友说：你能不能安静点？", punchline: "室友说：不能。然后他安静了。他搬走了" },
  { setup: "为什么小明总是迟到？", punchline: "因为他每次出门前都要确认自己帅不帅。确认完了发现不帅，就又回去换衣服" },
  { setup: "今天在公司哭了一下午", punchline: "同事都来安慰我，我说没事就是洋葱切多了。其实我是项目经理" },
  { setup: "女朋友问我：你觉得我胖吗？", punchline: "我说：在我心里你永远占很大空间。然后我被打了" },
  { setup: "为什么数学书很忧伤？", punchline: "因为它的问题太多了，而且都没人想解它" },
  { setup: "同事说他减肥很成功", punchline: "我问他怎么减的，他说：把秤调轻了2公斤" },
  { setup: "我去算命，大师说我命里缺金", punchline: "我说：那能不能先借我500？大师收摊走了" },
  { setup: "为什么WiFi信号那么弱？", punchline: "因为它社恐，不好意思太强" },
  { setup: "我跟老板说：我要加薪。老板说：为什么？", punchline: "我说：因为我穷。老板说：这不是理由。我说：这就是理由" },
  { setup: "为什么空调总是嗡嗡响？", punchline: "因为它在抱怨：外面35度我还要工作，你们人类坐着享受" },
  { setup: "我妈说：你看看别人家的孩子", punchline: "我说：你看看别人家的妈。然后我挨打了" },
  { setup: "为什么程序员总是分不清万圣节和圣诞节？", punchline: "因为 Oct 31 = Dec 25。不好笑？没事，程序员的笑点本来就很低" },
  { setup: "我问我妈：我帅不帅？", punchline: "我妈看了我三秒说：你问问你爸。我爸看了我三秒说：你问你妈" },
  { setup: "为什么我的手机永远充不满电？", punchline: "因为它跟我一样，上班永远充不满干劲" },
  { setup: "我跟朋友说：我最近在减肥", punchline: "朋友说：哦？怎么减的？我说：把体重秤的电池扣了" },
  { setup: "有人问我：你最怕什么？", punchline: "我说：明天。因为明天又是周一" },
  { setup: "为什么洗衣机会转？", punchline: "因为它看到你的衣服太丑了，转过头去不想看" },
  { setup: "医生：你这个病要忌口。我：忌什么？", punchline: "医生：忌讳一直吃。我：那我还能吃什么？医生：吃亏" },
  { setup: "为什么键盘上的 F 和 J 有凸起？", punchline: "因为它们想让你知道，就算闭着眼也能摸到它。不像你的人生" },
  { setup: "我问我妈：为什么我这么黑？", punchline: "我妈说：因为你爸也是。那为什么你爸也这么黑？因为他妈也是。所以这是家族遗产" },
  { setup: "今天看到一只蜗牛在墙上爬", punchline: "我把它拿下来放回地面。它看了我一眼，又爬上去了。可能它也讨厌周一" },
  { setup: "为什么我总是忘记密码？", punchline: "因为我的大脑跟浏览器一样，建议清缓存但从来不备份" },
  { setup: "同学聚会，有人问我工资多少", punchline: "我说：够活。他又问：活的怎样？我说：勉强。他就不问了" },
  { setup: "为什么我的闹钟越来越响？", punchline: "因为它发现轻声叫不起我，已经开始生气了" },
  { setup: "我问Siri：我帅吗？", punchline: "Siri说：让我帮你搜一下「自恋怎么治」" },
  { setup: "为什么外卖总是送错？", punchline: "因为外卖员跟你的代码一样，99%的时间在调试路线" },
  { setup: "我去买鞋，店员问我穿多大", punchline: "我说：42。店员说：这是38的。我说：那行，我忍一下" },
  { setup: "为什么我不能早起？", punchline: "因为被子和我是真爱，枕头是证婚人" },
  { setup: "领导说：这个项目很急。我说：好的", punchline: "然后领导说：那就交给你了。我才知道「急」的意思是「你来急」" },
  { setup: "为什么我不想上班？", punchline: "因为上班的本质是用8小时的自由换取8小时的不自由" },
  { setup: "我跟我爸说：我要创业", punchline: "我爸说：好，你先创业，创完了告诉我创在哪" },
  { setup: "为什么电梯里总有镜子？", punchline: "让你看看自己加班加成什么样了" },
  { setup: "今天面试，HR问我：你抗压能力强吗？", punchline: "我说：强，我中午吃的方便面，捏都捏不碎" },
  { setup: "我跟朋友说：我好穷。朋友说：你还有我啊", punchline: "我说：那你借我100？朋友说：你看，你又穷了" },
  { setup: "为什么打工人喜欢奶茶？", punchline: "因为人生已经很苦了，需要加糖。但奶茶也要钱，所以更苦了" },
  { setup: "我妈问我：你什么时候结婚？", punchline: "我说：等。等什么？等一个不想结婚的人" },
  { setup: "为什么跑步机上的人看起来都很痛苦？", punchline: "因为他们花钱买罪受，而且还是在室内" },
  { setup: "我告诉我妈我减肥成功了", punchline: "我妈说：是秤坏了吧。我说没有。她说：那你站上来" },
  { setup: "为什么我总是打错字？", punchline: "因为我的手指有自己的想法，而且它比我聪明" },
  { setup: "我问老板：我能早退吗？", punchline: "老板说：你能早起吗？我说不能。老板说：那你能早退吗？也不能" },
  { setup: "我去银行取钱，柜员问我取多少", punchline: "我说：全部。柜员说：您余额为3.72元。我说：那就3块吧，2毛别找了" },
  { setup: "为什么我的手机屏幕碎了还在用？", punchline: "因为换屏幕的钱够我吃一个月泡面，我选择看裂痕" },
  { setup: "老师说：小明，你长大想当什么？", punchline: "小明说：想当咸鱼。老师说：咸鱼有什么好当的？小明说：不用翻身啊" },
  { setup: "我跟我妈说：我决定躺平了", punchline: "我妈说：你躺得够平吗？你看看你的肚腩，再躺就成球了" },
  { setup: "为什么我总是加班？", punchline: "因为白天的工作用8小时做不完，所以用加班来证明白天确实做不完" },
  { setup: "我跟朋友说：我存款有六位数", punchline: "朋友说：哇！我说是的，包含小数点后两位" },
  { setup: "为什么周一总是来那么快？", punchline: "因为周末会时区膨胀，周一会时间压缩。科学解释：你不想来的时候它就来" },
  { setup: "我告诉老板我要请假", punchline: "老板问：理由？我说：活着。老板说：这不是理由。我说：活着已经很辛苦了" },
  { setup: "为什么我的工位越来越乱？", punchline: "因为乱是宇宙的终极状态，我在顺应自然规律" },
  { setup: "我问同事：你觉得我怎样？", punchline: "同事说：你很努力。我问：真的吗？同事说：你很努力地活着" },
  { setup: "为什么我的外卖还没到？", punchline: "因为外卖员在来的路上看了眼你的备注，被吓到了，在犹豫要不要送" },
  { setup: "今天被问了三个问题：吃了吗？睡了吗？在吗？", punchline: "我统一回答：没有，没有，不在。对方说：那你什么时候有空？我说：下辈子" },
  { setup: "我问我爸：你年轻的时候是什么样？", punchline: "我爸说：跟你一样。我说：帅？我爸说：穷" },
  { setup: "为什么我总是最后一个走？", punchline: "因为我是第一个到的人，走的时候得关灯关空调关梦想" },
  { setup: "我去相亲，对方问我有车吗", punchline: "我说有。她问什么车？我说：购物车" },
  { setup: "为什么不能在早上叫醒一个装睡的人？", punchline: "因为他不是在装睡，他是真的不想上班" },
  { setup: "我问我妈：为什么我们家这么穷？", punchline: "我妈说：因为你还没出名啊。我说：那你怎么没出名？我妈说：我在等你啊" },
  { setup: "同事说他找到了人生的方向", punchline: "我问他什么方向，他说：下班的那个方向" },
  { setup: "为什么空调26度是最佳温度？", punchline: "因为那是你老板觉得最省电的温度" },
  { setup: "我告诉我妈我升职了", punchline: "我妈说：升了什么？我说：血压" },
  { setup: "为什么我总是说「马上到」？", punchline: "因为「马上到」的「马上」指的是马跑起来之前，也就是还没动" },
  { setup: "领导问我：你对公司有什么建议？", punchline: "我说：多发工资。领导说：除了这个呢？我说：多放假。领导说：还有呢？我说：没了" },
  { setup: "我跟我妈说：我要离家出走", punchline: "我妈说：等等，我帮你收拾行李。我就没走" },
  { setup: "为什么蚊子只咬我？", punchline: "因为我的血型是O型，蚊子觉得这是优质房源" },
  { setup: "我问房东能不能降房租", punchline: "房东说：可以啊，你降降体重，我降降房租。我们都有进步空间" },
  { setup: "为什么我总是丢东西？", punchline: "因为我的东西觉得跟我在一起没什么前途，自己走了" },
  { setup: "我问我妈：我是从哪里来的？", punchline: "我妈说：充话费送的。我问：那能退货吗？我妈说：过了7天无理由了" },
  { setup: "为什么我不爱运动？", punchline: "因为我算过了，跑步机的电费+我的卡路里消耗，亏本" },
  { setup: "我去医院，医生说：你这是职业病", punchline: "我问什么职业病。医生说：穷病" },
  { setup: "为什么我不能发财？", punchline: "因为发财需要胆量，而我的胆量只够我按掉闹钟继续睡" },
  { setup: "我问我妈：为什么别人家那么有钱？", punchline: "我妈说：因为别人家的孩子会赚钱。我说：所以是我不行？我妈说：你说呢" },
  { setup: "为什么我不谈恋爱？", punchline: "因为谈恋爱需要两个人，而我能凑齐的只有我一个人" },
  { setup: "我跟我爸说：我想当富二代", punchline: "我爸说：那你得先投胎。我说：来得及吗？我爸说：下辈子吧" },
  { setup: "为什么我写的代码总有bug？", punchline: "因为如果代码没有bug，那我就没有工作了。所以bug是我工作的保障" },
  { setup: "我问我妈：人生的意义是什么？", punchline: "我妈说：你先把你房间收拾了再说人生意义" },
  { setup: "今天跟朋友打赌，我输了", punchline: "赌的是「你今天会不会加班」。我赌不会。我输了。因为我在加班" },
  { setup: "为什么我总是忍不住刷手机？", punchline: "因为我的手指有自己的人格，而且它是社牛" },
  { setup: "为什么我不喜欢周一？", punchline: "因为周一是一周的开幕式，而我连观众席都不想坐" },
  { setup: "我去算命，大师说我今年有大劫", punchline: "我问什么劫，大师说：上班劫" },
  { setup: "为什么我的快递总是被偷？", punchline: "因为小偷也觉得我买的东西不错。我们品味一致" },
  { setup: "我跟我妈说：我要自由", punchline: "我妈说：自由是你自己说的不算的，得我说了算" },
  { setup: "为什么我不喜欢开会？", punchline: "因为开会是把一个可以在邮件里说清楚的事，用一个小时再说一遍" },
  { setup: "我的猫看我的眼神越来越不屑了", punchline: "我怀疑它在背着我考研" },
  { setup: "我问Siri：我什么时候能发财？", punchline: "Siri打开了日历，翻到了3014年" },
  { setup: "我跟我妈说我想出家", punchline: "我妈说：你先把卧室出了再说" },
  { setup: "为什么我的代码在本地能跑，上线就不行？", punchline: "因为代码社恐，人多了就不愿意工作" },
  { setup: "今天看到一只鸽子在马路上走路", punchline: "我按了喇叭它不走。我想它可能是北京来的，以为这是它的车" },
  { setup: "我跟老板说：我需要有挑战性的工作", punchline: "老板说：好，那明天你来发工资" },
  { setup: "我问我爸：为什么我总是被拒绝？", punchline: "我爸说：因为你申请的都是地球上存在的岗位" },
  { setup: "凌晨三点我还在刷手机", punchline: "不是不想睡，是怕一闭眼就到周一了" },
  { setup: "为什么蚊子咬的包越挠越痒？", punchline: "因为蚊子在包里装了痒痒传感器，你挠一次它充一次电" },
  { setup: "我去算命，大师说你命里缺木", punchline: "我说那我养盆绿萝？大师说：你缺的是头脑" },
  { setup: "我同事说他从来不加班", punchline: "因为他把加班叫「自愿奋斗时间」" },
  { setup: "为什么我不爱看恐怖片？", punchline: "因为我打开银行卡余额就够吓人了" },
  { setup: "面试官问：你期望薪资多少？", punchline: "我说：你们能给多少？面试官说：你先说。我说：你先给" },
  { setup: "为什么我总是手滑买一堆没用的东西？", punchline: "因为我的手指被淘宝收买了，脑子不知道" },
  { setup: "我问我妈：我是不是你捡来的？", punchline: "我妈说：哪有捡来的这么丑的，我捡都会挑好看的" },
  { setup: "为什么周一的早晨特别冷？", punchline: "因为太阳也不想上班，它缩在被窝里多赖了10分钟" },
  { setup: "我跟我爸说我想当网红", punchline: "我爸说：你先把脸打开美颜试试，看处理器能不能带得动" },
  { setup: "为什么我总是把事情拖到最后一刻？", punchline: "因为最后一刻的我才是最强的我，前面的都是菜鸡" },
  { setup: "我的植物又死了", punchline: "我怀疑它是在我睡着的时候偷偷打游戏打到天亮，然后猝死了" },
  { setup: "为什么我不能像猫一样每天睡16个小时？", punchline: "因为猫不用交房租，而我的房东不收猫币" },
  { setup: "我跟朋友说：我觉得我有选择困难症", punchline: "朋友说：你不是选择困难，你是选择不起" },
  { setup: "为什么我总是忘记要说什么？", punchline: "因为我的大脑运行在2G网络上，刚想到就超时了" },
  { setup: "我问我妈：为什么别人都有对象我没有？", punchline: "我妈说：因为垃圾桶不能自己走过来，你总得去丢一次" },
  { setup: "今天公司开会说要提高幸福感", punchline: "然后把茶水间的纸杯从一次性换成了环保可降解的。感受到了" },
  { setup: "为什么我每次说「我就玩5分钟」？", punchline: "因为5分钟之后的我已经不是5分钟之前的我了，那个我说的不算" },
  { setup: "我问我爸：为什么我们这么穷？", punchline: "我爸想了想说：可能是因为我们太实诚，骗子都嫌我们没价值" },
  { setup: "我去医院，医生让我多运动", punchline: "我说：我每天都要按好几次闹钟的关闭键，手指运动量很大的" },
  { setup: "为什么我总是忍不住吃宵夜？", punchline: "因为我的胃在凌晨会自动切换到「深夜食堂」模式，大脑管不了它" },
  { setup: "今天有人跟我说「你看起来很累」", punchline: "我说：我看起来不累的时候才是真的累，现在只是常态" },
  { setup: "我告诉我妈我要断舍离", punchline: "我妈说：好的，从你自己开始。然后我就不停了" },
  { setup: "为什么我的WiFi总是在关键时刻断？", punchline: "因为WiFi也是个社恐，人一多它就社交疲劳断线休息了" },
  { setup: "我跟我妈说我要躺平", punchline: "我妈说：你躺平了也占地方，能不能把自己卷起来放角落" },
  { setup: "为什么我走路总是撞到桌角？", punchline: "因为桌角觉得我不够痛，需要教育我走路看路" },
  { setup: "我跟朋友说：我想中彩票", punchline: "朋友说：你先买一张试试。我说：万一不中呢？他说：放心，一定不中" },
  { setup: "我的手机每天都提醒我屏幕使用时间过长", punchline: "我怀疑它是嫉妒我玩别的手机，我只有它一个它还管我" },
  { setup: "为什么我洗澡的时候灵感最多？", punchline: "因为淋浴头是全宇宙最强的灵感喷射器，但没办法带纸笔进去" },
  { setup: "我问我妈：人为什么要上班？", punchline: "我妈说：因为不上班就没钱，没钱就没饭吃，没饭吃就上不了班。闭环了" },
  { setup: "为什么我的体重只增不减？", punchline: "因为脂肪跟我一样，也是一旦住下了就不想搬走" },
  { setup: "我跟同事说：我已经到极限了", punchline: "同事说：你上个月的极限比这个高。我说：那是上个月的我，他已经不在了" },
  { setup: "为什么我不能像电视剧里一样转身就走？", punchline: "因为电视剧不用回头拿忘带的钥匙手机充电宝工牌雨伞" },
  { setup: "我问我妈：你后悔生我吗？", punchline: "我妈说：后悔。我说：那你为什么不退货？我妈：你过期了" },
];

let jokeIndex = 0;
let shuffledJokes = [];

function getNextJoke() {
  if (shuffledJokes.length === 0 || jokeIndex >= shuffledJokes.length) {
    shuffledJokes = [...JOKE_POOL];
    for (let i = shuffledJokes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledJokes[i], shuffledJokes[j]] = [shuffledJokes[j], shuffledJokes[i]];
    }
    jokeIndex = 0;
  }
  return shuffledJokes[jokeIndex++];
}

function getTodayString() {
  return new Date().toLocaleDateString("sv-SE");
}

async function getSettings() {
  const { settings } = await chrome.storage.local.get("settings");
  return settings || {};
}

// === AI 响应解析 ===

const JOKE_PROMPT = `你是冷笑话生成器。生成一个好笑但冷的笑话。
严格按JSON格式输出：{"setup":"铺垫","punchline":"笑点"}
setup 20-80字，punchline 10-50字`;

function parseAIResponse(raw) {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  try { return JSON.parse(cleaned); } catch {}
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch {} }
  return { setup: cleaned, punchline: "" };
}

// === Gemini Nano (Chrome Built-in AI) ===

async function generateNanoStream(port) {
  if (!self.ai || !self.ai.languageModel) {
    throw new Error("NANO_NOT_AVAILABLE");
  }

  const capabilities = await self.ai.languageModel.capabilities();
  if (capabilities.available !== "readily") {
    throw new Error("NANO_NOT_AVAILABLE");
  }

  const session = await self.ai.languageModel.create({ systemPrompt: JOKE_PROMPT });

  const now = new Date();
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  const userPrompt = `今天是${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日，星期${weekDays[now.getDay()]}。请生成今天的冷笑话。`;

  const stream = session.promptStreaming(userPrompt);
  let fullText = "";

  for await (const chunk of stream) {
    fullText += chunk;
    port.postMessage({ type: "stream", text: fullText });
  }

  const result = parseAIResponse(fullText.trim());
  port.postMessage({ type: "done", data: result });
  session.destroy();
}

// === 远程 AI 流式生成 ===

async function generateAIStream(port) {
  const settings = await getSettings();
  const apiKey = settings.apiKey;
  const apiUrl = settings.apiUrl;
  const model = settings.model;

  if (!apiKey) throw new Error("NO_API_KEY");
  if (!apiUrl) throw new Error("NO_API_URL");

  const now = new Date();
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  const userPrompt = `今天是${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日，星期${weekDays[now.getDay()]}。请生成今天的冷笑话。`;

  const body = {
    messages: [
      { role: "system", content: JOKE_PROMPT },
      { role: "user", content: userPrompt }
    ],
    temperature: 1.0,
    max_tokens: 400,
    stream: true
  };
  if (model) body.model = model;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("API Key 无效，请在设置中检查你的 Key");
    if (response.status === 429) throw new Error("请求过于频繁，请稍后再试");
    throw new Error(`API 请求失败: ${response.status}`);
  }

  let fullText = "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") break;
      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) { fullText += delta; port.postMessage({ type: "stream", text: fullText }); }
      } catch {}
    }
  }

  const result = parseAIResponse(fullText.trim());
  port.postMessage({ type: "done", data: result });
}

// === 消息处理 ===

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "openOptions") {
    chrome.runtime.openOptionsPage();
    return false;
  }
  if (msg.action === "checkNano") {
    (async () => {
      const available = !!(self.ai && self.ai.languageModel);
      if (available) {
        const cap = await self.ai.languageModel.capabilities();
        sendResponse({ available: cap.available === "readily" });
      } else {
        sendResponse({ available: false });
      }
    })();
    return true;
  }
});

// 流式端口
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "jokeStream") {
    (async () => {
      const settings = await getSettings();

      // 1. 用户选了 Gemini Nano
      if (settings.apiUrl === "chrome-built-in-ai") {
        try { await generateNanoStream(port); return; }
        catch (err) { if (err.message !== "NANO_NOT_AVAILABLE") { port.postMessage({ type: "error", error: err.message }); return; } }
      }

      // 2. 用户配了远程 API
      if (settings.apiKey && settings.apiUrl && settings.apiUrl !== "chrome-built-in-ai") {
        try { await generateAIStream(port); return; }
        catch (err) { /* 远程 API 失败，fallback 到内置笑话池 */ }
      }

      // 3. 先试 Nano
      try {
        if (self.ai && self.ai.languageModel) {
          const cap = await self.ai.languageModel.capabilities();
          if (cap.available === "readily") { await generateNanoStream(port); return; }
        }
      } catch {}

      // 4. 内置笑话池
      const joke = getNextJoke();
      try { port.postMessage({ type: "done", data: joke }); } catch {}
    })();
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});