import { PRESET_APIS } from "./config.js";

// === 内置笑话池 ===

const JOKE_POOL = [
  { setup: "为什么程序员总分不清万圣节和圣诞节？", punchline: "因为 Oct 31 = Dec 25" },
  { setup: "一只鹿失去了方向，变成了什么？", punchline: "迷路" },
  { setup: "我问朋友：你知道什么动物最容易摔倒吗？", punchline: "狐狸，因为它很狡猾（脚滑）" },
  { setup: "为什么数学书总是很忧伤？", punchline: "因为它有太多问题" },
  { setup: "小明对小红说：我可以亲你一下吗？", punchline: "小红：不行，我还要留着嘴吃饭" },
  { setup: "世界上最短的笑话是什么？", punchline: "笑话" },
  { setup: "为什么大海是蓝色的？", punchline: "因为鱼在里面吐泡泡：blue blue blue" },
  { setup: "什么鱼最白？", punchline: "鳄鱼，因为鳄鱼（鱼）= 饿鱼 = 白鱼（白挨饿）" },
  { setup: "有一天绿豆跳楼了，流了很多血，变成了什么？", punchline: "红豆" },
  { setup: "一只北极熊在发呆，突然说了一句话，说了什么？", punchline: "好冷啊" },
  { setup: "为什么蜘蛛侠不适合当程序员？", punchline: "因为他只会 web 开发" },
  { setup: "什么门永远关不上？", punchline: "球门" },
  { setup: "橡皮擦对铅笔说：我每天都在擦你写的东西。铅笔说：", punchline: "你真会擦" },
  { setup: "谁最喜欢帮人拍照？", punchline: "观世音（观世音=关快门）" },
  { setup: "猫为什么不跟狗玩？", punchline: "因为猫不想狗（够）了" },
  { setup: "什么动物最容易被贴在墙上？", punchline: "海豹（海报）" },
  { setup: "一颗星星掉了会变成什么？", punchline: "猩猩（星掉地上=星猩）" },
  { setup: "豆腐为什么能打伤人？", punchline: "因为是冻豆腐" },
  { setup: "什么情况下1+1不等于2？", punchline: "算错的情况下" },
  { setup: "世界上最长的车是什么车？", punchline: "堵车" },
  { setup: "把大象装进冰箱需要几步？", punchline: "三步：打开冰箱，装进去，关上冰箱" },
  { setup: "把长颈鹿装进冰箱需要几步？", punchline: "四步：打开冰箱，把大象拿出来，装长颈鹿，关上冰箱" },
  { setup: "有一天小明走在路上，突然觉得脚好酸，为什么？", punchline: "因为他踩到柠檬了" },
  { setup: "什么老鼠用两只脚走路？", punchline: "米老鼠" },
  { setup: "什么鸭子用两只脚走路？", punchline: "所有鸭子都用两只脚走路" },
  { setup: "为什么小偷不开热水壶的盖子？", punchline: "因为他怕热（热=壶盖下面有蒸汽）" },
  { setup: "从前有个人叫小蔡，被扔进油锅炸了，变成了什么？", punchline: "菜饼（蔡饼）" },
  { setup: "什么鱼不能吃？", punchline: "木鱼" },
  { setup: "老板说：你被开除了。员工说：为什么？老板说：", punchline: "因为你不是开关" },
  { setup: "猪圈里跑出来一头猪，打一明星", punchline: "王力宏（往里轰）" },
  { setup: "又跑出来一头猪，再打一明星", punchline: "韩红（还轰）" },
  { setup: "有个鸡蛋跑到了山东，变成了什么？", punchline: "鲁（卤）蛋" },
  { setup: "有个鸡蛋跑到了花丛中，变成了什么？", punchline: "花旦" },
  { setup: "有个鸡蛋跑到河里游泳，变成了什么？", punchline: "滚蛋" },
  { setup: "为什么飞机飞这么高都不会撞到星星？", punchline: "因为星星会闪" },
  { setup: "为什么企鹅只有肚子是白的？", punchline: "因为手短洗不到后背" },
  { setup: "医生问：你感冒了吗？病人说：没有。医生说：", punchline: "那请你把口罩戴好" },
  { setup: "什么布剪不断？", punchline: "瀑布" },
  { setup: "小白加小白等于什么？", punchline: "小白兔（TWO）" },
  { setup: "哪个月有28天？", punchline: "每个月都有28天" },
  { setup: "小明说：爸，我回来了。爸爸说：", punchline: "你谁啊？我不认识你" },
  { setup: "一个包子走在路上觉得很饿，于是就把自己吃了", punchline: "这个包子叫什么？自食其力" },
  { setup: "老师：小明，请用「也许」造句。小明：", punchline: "也许有三升水" },
  { setup: "小红对小明说：你看我新买的帽子好看吗？小明说：", punchline: "好看，就是头有点大" },
  { setup: "世界上最老的花是什么花？", punchline: "校花" },
  { setup: "蛇为什么要脱皮？", punchline: "因为皮痒" },
  { setup: "哪颗牙齿最后长出来？", punchline: "假牙" },
  { setup: "有一个白猫和一个黑猫，白猫掉水里了，黑猫说了什么？", punchline: "喵" },
  { setup: "为什么白猫不理黑猫？", punchline: "因为白猫掉水里了正在生黑猫的气" },
  { setup: "什么官不发工资却要给别人钱？", punchline: "新郎官" },
  { setup: "爸爸问小明：你的袜子怎么一个正一个反？小明说：", punchline: "因为另一双也是这样穿的" },
  { setup: "从前有一颗棉花糖，去打球，变成了什么？", punchline: "棉花糖→糖棉→糖丸" },
  { setup: "世界上最没原则的动物是什么？", punchline: "变色龙" },
  { setup: "什么时候4-3=5？", punchline: "算错的时候" },
  { setup: "什么人一年只工作一天？", punchline: "圣诞老人" },
  { setup: "红豆打死了绿豆，绿豆变成什么？", punchline: "绿豆沙（杀）" },
  { setup: "什么动物最讲规矩？", punchline: "乌龟，因为龟（规）定" },
  { setup: "什么最干净？", punchline: "白纸，因为它一尘不染" },
  { setup: "小王走路从来不看路，为什么他从不摔倒？", punchline: "因为他在跑步机上走" },
  { setup: "世上什么人最快？", punchline: "曹操（说曹操曹操到）" },
  { setup: "一加一等于什么？", punchline: "等于王" },
  { setup: "什么字全世界通用？", punchline: "阿拉伯数字" },
  { setup: "什么水永远用不完？", punchline: "泪水" },
  { setup: "什么海没有水？", punchline: "辞海" },
  { setup: "什么路最窄？", punchline: "冤家路窄" },
  { setup: "什么火看不见？", punchline: "无名火" },
  { setup: "什么笔不能写？", punchline: "电笔" },
  { setup: "什么牛不吃草？", punchline: "蜗牛" },
  { setup: "什么门没有门扇？", punchline: "球门" },
  { setup: "什么桥下面没有水？", punchline: "立交桥" },
  { setup: "谁天天去看病？", punchline: "医生" },
  { setup: "铅笔姓什么？", punchline: "萧，削（萧）铅笔" },
  { setup: "什么样的路不能走？", punchline: "电路" },
  { setup: "如何让饮料变大杯？", punchline: "念大悲（大杯）咒" },
  { setup: "什么水果最懒？", punchline: "香蕉，因为它总躺着（弯的）" },
  { setup: "怎样使麻雀安静下来？", punchline: "压它一下（鸦雀无声）" },
  { setup: "蜘蛛侠的颜色是什么？", punchline: "白的，因为spider-man（是白的人）" },
  { setup: "透明剑是什么剑？", punchline: "看不见（剑）" },
  { setup: "为什么包青天额头上有个月亮？", punchline: "因为白天不懂爷的黑" },
  { setup: "有十只羊，九只蹲在羊圈，一只蹲在猪圈，打一成语", punchline: "抑扬顿挫（一羊蹲错）" },
  { setup: "狼来了，猜一水果", punchline: "杨桃（羊逃）" },
  { setup: "又来了狼，再猜一水果", punchline: "草莓（草没=羊没了吃草）" },
  { setup: "小明对小华说：我可以坐在你从来坐不到的地方。小华说：不可能。然后小明：", punchline: "坐在了小华的腿上" },
  { setup: "你的爸爸的妹妹的堂弟的表哥的爸爸与你叔叔的儿子的嫂子是什么关系？", punchline: "没关系" },
  { setup: "谁是百兽之王？", punchline: "动物园园长" },
  { setup: "为什么喝醉的人总说自己没醉？", punchline: "因为醉了才说真话，没醉的人说没醉才是真话" },
  { setup: "什么鸡没有翅膀？", punchline: "田鸡" },
  { setup: "一根绳子对折再对折，然后从中间剪一刀，会变成几根？", punchline: "5根" },
  { setup: "什么动物天天熬夜？", punchline: "熊猫" },
  { setup: "为什么西瓜不能当船？", punchline: "因为它会自己翻（翻瓜）" },
  { setup: "前面有一片草地，猜一植物", punchline: "梅花（没花）" },
  { setup: "来了一群羊，猜一水果", punchline: "草莓（草没）" },
  { setup: "什么蛋打不烂煮不熟更不能吃？", punchline: "考试得的零蛋" },
  { setup: "为什么跳蚤不会被摔死？", punchline: "因为它会跳" },
  { setup: "一溜（七）棵树，拴八匹马，打一成语", punchline: "七零八落" },
  { setup: "两个人分五个苹果，怎么分最公平？", punchline: "榨汁" },
  { setup: "什么东西天气越热它爬得越高？", punchline: "温度计" },
  { setup: "什么越洗越脏？", punchline: "水" },
  { setup: "什么鸡最慢？", punchline: "尼克松（你磕松=慢慢磕）" },
  { setup: "一个离过五十次婚的女人，应该怎么形容她？", punchline: "前公尽弃（前功尽弃）" },
  { setup: "一只羊在吃草，一只狼从旁边经过没吃羊，猜一海产品", punchline: "虾（瞎）" },
  { setup: "又经过一只狼还是没吃羊，再猜一海产品", punchline: "海虾（还瞎）" },
  { setup: "第三只狼经过还是没有吃羊，再猜一海产品", punchline: "龙虾（聋瞎）" },
  { setup: "什么时候有人敲门你绝不会说请进？", punchline: "上厕所的时候" },
  { setup: "狗过了独木桥就不叫了，打一成语", punchline: "过目（木）不忘（汪）" },
  { setup: "蜜蜂停在日历上，打一成语", punchline: "风（蜂）和日丽（日历）" },
  { setup: "什么船最安全？", punchline: "停在港口的船" },
  { setup: "龟兔赛跑，猪做裁判，你猜谁赢了？", punchline: "你猜吧，因为猪也在猜" },
  { setup: "为什么冰箱会说话？", punchline: "因为它有冰（病）口" },
  { setup: "谁是世界上最有耐心的人？", punchline: "钓鱼的人" },
  { setup: "什么东西能装下整个世界却不能装下一粒沙子？", punchline: "地图" },
  { setup: "为什么电脑永远不会感冒？", punchline: "因为它有窗户（Windows）" },
  { setup: "两个人一起走，一人向左一人向右，他们是什么关系？", punchline: "背对背的关系" },
  { setup: "为什么雨伞总是不开心？", punchline: "因为它总是被撑着" },
  { setup: "什么地方人越少越好？", punchline: "厕所" },
  { setup: "怎样让一个停了的手表变准？", punchline: "看它停的时候，一天至少有两次是完全准的" },
  { setup: "什么鱼不能吃还能走？", punchline: "木鱼走（木鱼经）→ 其实是甲鱼（假鱼）" },
  { setup: "锅里有五碗面，小明吃了两碗还剩几碗？", punchline: "还剩三碗（不是剩三碗面，是碗还在）" },
  { setup: "什么刀不锋利？", punchline: "胶刀（交刀=递刀）→ 剪刀" },
  { setup: "什么时候1=2？", punchline: "算错的时候" },
  { setup: "打什么东西不费力？", punchline: "打哈欠" },
  { setup: "什么人靠运气赚钱？", punchline: "运煤气的工人" },
  { setup: "从前有个人姓铁，他从小到大一根头发都没长过，请问他得了什么病？", punchline: "老铁没毛病" },
  { setup: "为什么椰子树长得那么高？", punchline: "因为它要够到太阳才能长椰子（光合作用）→ 因为它在热带" },
  { setup: "小明的爸爸有三个儿子，大儿子叫大毛，二儿子叫二毛，三儿子叫什么？", punchline: "小明" },
  { setup: "什么数字倒过来看还是原来的数字？", punchline: "0、1、8" },
  { setup: "一群女人在聊天，打一成语", punchline: "无稽之谈（无鸡之谈）" },
  { setup: "一群男人在聊天，打一成语", punchline: "胡言乱语（胡言=互咽）" },
  { setup: "世界上最小的岛是什么岛？", punchline: "马路上的安全岛" },
  { setup: "一个胖子从12楼掉下来会变成什么？", punchline: "死胖子" },
  { setup: "为什么蚕宝宝很有钱？", punchline: "因为它会结茧（节俭）" },
  { setup: "什么动物最讲义气？", punchline: "狗，因为够（狗）义气" },
  { setup: "一只公鸡和一只母鸡，谁比较高？", punchline: "公鸡，因为公鸡（高）打鸣" },
  { setup: "小白长得很像他的哥哥，打一句成语", punchline: "真相大白（真像大白）" },
  { setup: "谁最喜欢吃帮助？", punchline: "助人为乐（乐=喜欢吃）" },
  { setup: "世界上最长的英文单词是什么？", punchline: "smiles，因为首尾之间隔了一英里（mile）" },
  { setup: "什么人冬天最不怕冷？", punchline: "雪人" },
  { setup: "你知道盲人当什么最赚钱吗？", punchline: "盲人按摩" },
  { setup: "为什么老虎不吃草？", punchline: "因为它是肉食动物，它也吃不下啊" },
  { setup: "什么地方人进去后就变老了？", punchline: "照相馆（照片上显老）" },
  { setup: "什么人不怕冷？", punchline: "死人" },
  { setup: "哪两个英文字母最喜欢躲猫猫？", punchline: "O和P，因为OPPO（躲躲）" },
  { setup: "一杯牛奶倒进海里会变成什么？", punchline: "还是海" },
  { setup: "什么东西天气越冷它越长？", punchline: "冰柱" },
  { setup: "什么锅不能做饭？", punchline: "罗锅" },
  { setup: "世界上最硬的东西是什么？", punchline: "钻石…不，是穷人的骨头" },
  { setup: "为什么有些人会惧高？", punchline: "因为矮" },
  { setup: "什么鸟最喜欢问为什么？", punchline: "啄木鸟（啄=追着问）" },
  { setup: "一加一在什么情况下不等于二？", punchline: "在算错的情况下" },
  { setup: "什么花不会结果？", punchline: "烟花" },
  { setup: "谁是最懒的皇帝？", punchline: "万历（万粒=万无力）" },
  { setup: "打什么东西不用花力气？", punchline: "打瞌睡" },
  { setup: "什么布最怕剪？", punchline: "瀑布（剪了就没了）" },
  { setup: "鸡和鸭被关在冰箱里，鸡冻死了，鸭没死，为什么？", punchline: "因为那只鸭是北京烤鸭" },
  { setup: "最让人抓狂的两个字是什么？", punchline: "不是'没钱'，是'重做'" },
  { setup: "怎么让一个过路的人停下？", punchline: "叫他：'你钱掉了'" },
  { setup: "为什么说蚊子最有文艺范？", punchline: "因为它一开口就是吟诗（叮人=叮咛）" },
  { setup: "什么字去掉一点就飞了？", punchline: "乌字去掉一点就是鸟，鸟会飞" },
  { setup: "手机和充电器是什么关系？", punchline: "寄生关系" },
  { setup: "谁比黑猫警长还厉害？", punchline: "白猫，因为白猫洗了就变白猫了" },
  { setup: "什么帽不能戴？", punchline: "螺丝帽" },
  { setup: "为什么不能和科学家打牌？", punchline: "因为他们会算（算计）" },
  { setup: "一个糖掉到杯子里变成了什么？", punchline: "糖水" },
  { setup: "一个糖走到北极变成了什么？", punchline: "冰糖" },
  { setup: "什么书在书店买不到？", punchline: "遗书" },
  { setup: "哪个数字最勤劳哪个最懒？", punchline: "1最勤劳2最懒（一不做二不休）" },
  { setup: "哪个水果视力最差？", punchline: "芒果（忙果=看不见）" },
  { setup: "为什么老虎不吃人？", punchline: "因为遇见你之前它还没饿" },
  { setup: "什么人从来不洗头发？", punchline: "和尚" },
  { setup: "有一个鸡蛋去茶馆喝茶，变成了什么？", punchline: "茶叶蛋" },
  { setup: "有一个鸡蛋跑去松花江游泳，变成了什么？", punchline: "松花蛋" },
  { setup: "有一个鸡蛋跑到别人院子里，变成了什么？", punchline: "原子弹（院子蛋）" },
  { setup: "有一个鸡蛋无家可归，变成了什么？", punchline: "野鸡蛋" },
  { setup: "有一个鸡蛋在路上不小心摔了一跤，变成了什么？", punchline: "导弹（倒蛋）" },
  { setup: "什么动物最容易被贴在墙上？", punchline: "海豹（海报）" },
  { setup: "什么鸡最慢？", punchline: "烤鸡，因为被烤了跑不动" },
  { setup: "什么路最窄？", punchline: "冤家路窄" },
  { setup: "为什么小明能用一只手让一辆正在行驶的汽车停下来？", punchline: "因为他在拦出租车" },
  { setup: "什么地方只要进去就出不来？", punchline: "迷宫" },
  { setup: "什么蛋打不碎？", punchline: "零蛋" },
  { setup: "什么东西越热越爱出来？", punchline: "汗" },
  { setup: "世界上什么人一下子变老？", punchline: "新娘，因为今天是新娘明天是老婆" },
  { setup: "狗为什么不和猫打架？", punchline: "因为猫有九条命，狗只有一条" },
  { setup: "世界上最贵的蛋是什么蛋？", punchline: "脸蛋" },
  { setup: "最让人痛苦的三个字是什么？", punchline: "不是'我爱你'，是'加班吧'" },
  { setup: "什么花很烫？", punchline: "火花" },
  { setup: "什么猫不吃鱼？", punchline: "熊猫" },
  { setup: "世界上什么蛋跑得最快？", punchline: "坏蛋，因为做贼心虚跑得快" },
  { setup: "为什么仙人掌不需要浇水？", punchline: "因为它自己就有水（刺里存水）" },
  { setup: "怎样把大象装进冰箱？", punchline: "打开冰箱门，把大象塞进去，关上门" },
  { setup: "从前有个人叫阿爽，他死了，他的家人做什么？", punchline: "送葬（送爽=送他一程）" },
  { setup: "世界最后的笑话是什么？", punchline: "你看到这里以为还有更好的，其实没有了" },
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