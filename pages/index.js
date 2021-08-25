import Layout from "../components/Layout";

const qqLink = `https://qm.qq.com/cgi-bin/qm/qr?k=tu3jYFHFGwpHNddGX8gQ_Skk-Qr1B51C&jump_from=webapi`;
export default function IndexPage() {
  return (
    <Layout>
      <div className="p-4 mb-4 bg-white bg-jump">
        <div className="overlay"></div>
        <div className="container-fluid">
          <h1 className="display-5 fw-bold">一个有脾气的奇迹私服</h1>
          <p className="fs-4">
            基于好易全1.03H, 全职业平衡, 各职业二连击, 经典设置, 长久耐玩,
            鄙视那些商业服的各种套路, 极度讨厌他们的行为,
            所有玩家需求群内投票决定. 目标只有一个, 玩的爽才是真的好私服.
          </p>
          <a className="btn btn-primary btn-lg" href="/RegisterPage">
            快速注册
          </a>
          <a
            className="btn btn-outline-primary btn-lg ms-2"
            href={qqLink}
            target="_blank"
            rel="noreferrer"
          >
            添加QQ群
          </a>
        </div>
      </div>

      <div className="index-feature">
        <div className="box">
          <div className="overlay" />
          <h5>基本设定</h5>
          <ul>
            <li>该私服基于好易全1.03H</li>
            <li>自带登录器有F8右键挂机功能</li>
            <li>有好的建议随时跟我说我修改</li>
            <li>出生送1000点, 升级每级50点</li>
            <li>经验5000倍, 大师经验1000倍</li>
            <li>装备交易无限制</li>
            <li>练级地点, 勇者大陆东门, 古战场</li>

            <li>三转在网站上进行转职</li>
          </ul>
        </div>

        <div className="box">
          <div className="overlay" />
          <h5>其他设定</h5>
          <ul>
            <li>设置 100 次转生, 每次转生 600 点, 400级转</li>
            <li>总点数 `1000 + 100*600 + 400*50 = 81000`</li>
            <li>所有物品合成概率统一设置为 80%</li>
            <li>首饰掉落随机+5到+13</li>
            <li>生命宝石可追加到+28</li>
            <li>玛雅创造生命守护的掉落率非常高</li>
          </ul>
        </div>

        <div className="box">
          <div className="overlay" />
          <h5>魔王困顿</h5>
          <ul>
            <li>魔王困顿 5 分钟刷新一次</li>
            <li>刷新地点古战场, 亚特兰蒂斯, 天空之城</li>
            <li>每个地方刷新 4 只</li>
            <li>掉落所有套装物品以及所有首饰</li>
          </ul>
        </div>
        <div className="box">
          <div className="overlay" />
          <h5>冰霜蜘蛛</h5>
          <ul>
            <li>爆所有高等级的装备</li>
            <li>包括 380/400 武器防具</li>
          </ul>
        </div>
        <div className="box">
          <div className="overlay" />
          <h5>X 商店</h5>
          <ul>
            <li>强化的恶魔跟天使</li>
            <li>所有职业翅膀 2 代翅膀</li>
            <li>所有职业翅膀 3 代翅膀</li>
          </ul>
        </div>

        <div className="box">
          <div className="overlay" />
          <h5>积分</h5>
          <ul>
            <li>创造宝石 一个20积分</li>
            <li>玛雅之石 一个10积分</li>
            <li>生命宝石 一个10积分</li>
            <li>洛克之羽 一个10积分</li>
            <li>守护宝石 一个100积分</li>
          </ul>
        </div>
      </div>

      <div className="mb-5 mt-4">
        <h4>常用操作</h4>
        <ul>
          <li>+ 在线加点 `/加力量 32767`, 最大限制 32767</li>
          <li>+ 在线洗红 `/洗红`</li>
          <li>+ 删除角色, 删除战盟, 请输入 7 个 1</li>
          <li>+ 积分兑换, 玛雅,创造,洛克之羽, 卖商店, 每个兑换 100 点积分</li>
        </ul>
      </div>
    </Layout>
  );
}
