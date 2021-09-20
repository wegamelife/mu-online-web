import Layout from "../components/Layout";
import Link from "next/link";

const qqLink = `https://qm.qq.com/cgi-bin/qm/qr?k=tu3jYFHFGwpHNddGX8gQ_Skk-Qr1B51C&jump_from=webapi`;
export default function IndexPage() {
  return (
    <Layout>
      <div className="p-4 mb-4 bg-white bg-jump">
        <div className="overlay" />
        <div className="container-fluid">
          <h1 className="display-5 fw-bold">一个有脾气的奇迹私服</h1>
          <p className="fs-4">
            基于<strong>1.03H+</strong>全扩展, 全职业平衡, 各职业二连击,
            经典设置, 长久耐玩, 装备+15, 祝福大天使,
            4D翅膀,玩家需求群内投票决定, 总之让大家玩的愉快就好.
          </p>
          <Link href="/RegisterPage">
            <a className="btn btn-primary btn-lg">快速注册</a>
          </Link>
          <Link href={qqLink}>
            <a
              className="btn btn-outline-primary btn-lg ms-2"
              target="_blank"
              rel="noreferrer"
            >
              添加QQ群
            </a>
          </Link>
        </div>
      </div>

      <div className="index-feature">
        <div className="box">
          <div className="overlay" />
          <h5>基本设定</h5>
          <ul>
            <li>1.03H+全扩展, +15装备, 4代翅膀, 祝福大天使</li>
            <li>自带登录器有F8右键挂机功能, F7一键连击</li>
            <li>经验3000倍, 大师经验1000倍</li>
            <li>角色最大等级8000级, 大师200级</li>
            <li>出生不送点, 升级每级10点</li>
            <li>总点数 10 * 8000 = 80000</li>
            <li>所有物品合成概率统一设置为 80%</li>
            <li>需求根据群内投票来修改</li>
          </ul>
        </div>

        <div className="box">
          <div className="overlay" />
          <h5>其他设定</h5>
          <ul>
            <li>所有物品合成概率统一设置为 80%</li>
            <li>生命宝石可追加到+28</li>
            <li>玛雅创造生命守护的掉落率非常高</li>
            <li>古战场加入的怪物生命值提升 10 倍</li>
            <li>练级地点, 勇者大陆东门, 古战场</li>
          </ul>
        </div>

        <div className="box">
          <div className="overlay" />
          <h5>魔王困顿</h5>
          <ul>
            <li>魔王困顿 5 分钟刷新一次</li>
            <li>刷新地点古战场, 亚特兰蒂斯, 天空之城</li>
            <li>每个地方刷新 4 只</li>
            <li>掉落所有套装物品</li>
          </ul>
        </div>
        <div className="box">
          <div className="overlay" />
          <h5>冰霜蜘蛛</h5>
          <ul>
            <li>蜘蛛掉落大天使以及高等级的武器盾牌</li>
            <li>包括 380/400 武器防具</li>
          </ul>
        </div>
        <div className="box">
          <div className="overlay" />
          <h5>X 商店</h5>
          <ul>
            <li>各种增益物品</li>
            <li>强化的恶魔跟天使,黑马王等</li>
            <li>出售七彩宝石</li>
            <li>所有职业翅膀 2 代翅膀</li>
            <li>所有职业翅膀 3 代翅膀</li>
            <li>纪念指环</li>
          </ul>
        </div>

        <div className="box">
          <div className="overlay" />
          <h5>积分</h5>
          <ul>
            <li>创造宝石 一个 10 积分</li>
            <li>玛雅之石 一个 10 积分</li>
            <li>生命宝石 一个 10 积分</li>
            <li>守护宝石 一个 10 积分</li>
          </ul>
        </div>

        <div className="box">
          <div className="overlay" />
          <h5>新增套装(未上线)</h5>
          <ul>
            <li>战士: 塞恩的愤怒 Thain's</li>
            <li>战士: 塞恩的勇气 Thain's</li>
            <li>魔法师: 尼古拉斯的审判 Nicolas's</li>
            <li>魔法师: 尼古拉斯的信念 Nicolas's</li>
            <li>圣导师: 塔拉夏的裁决 Tal Rasha's</li>
            <li>圣导师: 塔拉夏的外袍 Tal Rasha's</li>
          </ul>
        </div>

        <div className="box">
          <div className="overlay" />
          <h5>自定义连击设置</h5>
          <ul>
            <li>法师: 地狱火+黑龙波</li>
            <li>法师: 暴风雪+毒炎</li>
            <li>法师: 黑龙波强化+爆炎强化</li>
          </ul>
        </div>
      </div>

      <div className="mb-5 mt-4">
        <h4>常用操作</h4>
        <ul>
          <li>在线加点 `/加力量 32767`, 最大限制 32767</li>
          <li>在线洗红 `/洗红`</li>
          <li>删除角色, 删除战盟, 请输入 7 个 1</li>
          <li>积分兑换, 玛雅, 创造, 洛克之羽, 卖商店, 每个兑换 10 点积分</li>
          <li>升级到401级经验不动的时候请下线在上线</li>
          <li>变身:`/变身 275`</li>
          <li style={{ wordBreak: "break-all" }}>
            可变身怪物编号:
            7,14,16,236,372,373,374,275,361,386,502,493,494,497,490,450,361,360,465,468,469,470,471,472,473,474,475,476,477
          </li>
        </ul>
      </div>

      <div className="mb-5 mt-4">
        <h4>开源项目</h4>
        <ul>
          <li>
            <a
              href="https://github.com/buuug7/mu-login-app"
              target="_blank"
              rel="noreferrer"
            >
              土鳖私服登录器源码
            </a>
          </li>
          <li>
            <a
              href="https://github.com/buuug7/mu-online-web"
              target="_blank"
              rel="noreferrer"
            >
              土鳖私服网站源码
            </a>
          </li>
        </ul>
      </div>

      <div className="mb-5 mt-4">
        <h4>赞助玩家</h4>
        <ul>
          <li>啊语</li>
        </ul>
      </div>
    </Layout>
  );
}
