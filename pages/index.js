import Layout from "../components/Layout";

const qqLink = `https://qm.qq.com/cgi-bin/qm/qr?k=tu3jYFHFGwpHNddGX8gQ_Skk-Qr1B51C&jump_from=webapi`;
export default function IndexPage() {
  return (
    <Layout>
      <h5>游戏特色</h5>
      <ul>
        <li>游戏官网: http://mu.yoursoups.com</li>
        <li>
          QQ群:{" "}
          <a target="_blank" href={qqLink} rel="noreferrer">
            835949656
          </a>
        </li>
        <li>该私服基于好易全1.03H</li>
        <li>自带登录器有F8右键挂机功能</li>
        <li>有好的建议随时跟我说我修改</li>
        <li>出生送1000点, 升级每级50点</li>
        <li>经验5000倍, 大师经验1000倍</li>
        <li>
          设置 100 次转生, 每次转生 600 点, 400级转, 总点数 `1000 + 100*600 +
          400*50 = 81000`
        </li>
        <li>所有物品合成概率统一设置为 80%</li>
        <li>装备交易无限制</li>
        <li>练级地点, 勇者大陆东门, 古战场门口</li>
        <li>三转在网站上进行转职</li>
        <li>首饰掉落随机+5到+13</li>
        <li>生命宝石可追加到+28</li>
      </ul>

      <h5>X商店</h5>
      <ul>
        <li>强化的恶魔跟天使</li>
        <li>所有职业翅膀2代翅膀</li>
        <li>所有职业翅膀3代翅膀</li>
      </ul>

      <h5>积分</h5>
      <ul>
        <li>创造宝石 一个20积分</li>
        <li>玛雅之石 一个10积分</li>
        <li>生命宝石 一个10积分</li>
        <li>洛克之羽 一个10积分</li>
        <li>守护宝石 一个100积分</li>
      </ul>

      <h5>魔王困顿</h5>
      <ul>
        <li>魔王困顿 5 分钟刷新一次</li>
        <li>刷新地点古战场, 亚特兰蒂斯, 天空之城, 每个地方刷新 4 只</li>
        <li>掉落所有套装物品以及所有首饰</li>
      </ul>

      <h5>冰霜蜘蛛</h5>
      <ul>
        <li>爆所有高等级的装备, 包括380/400</li>
      </ul>

      <h5>常用操作</h5>
      <ul>
        <li>在线加点 `/加力量 32767`, 最大限制 32767</li>
        <li>在线洗红 `/洗红`</li>
        <li>删除角色, 删除战盟, 请输入 7 个 1</li>
        <li>
          转生后如果需要自动加点, 点击 **自动加点**,
          自动加点会平均所有点数到4个属性上, 如果想手动加点,
          进游戏自己通过命令加点
        </li>
        <li>积分兑换, 玛雅,创造,洛克之羽, 卖商店, 每个兑换 100 点积分</li>
      </ul>
    </Layout>
  );
}
