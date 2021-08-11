import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from "../components/Layout";

export default function Home() {
    return (
        <Layout>
            <h5>游戏特色</h5>
            <ul>
                <li>每个职业套装属性一致，多样选择，告别令人厌倦的一套顶级，外观任选，装B耍帅，打架泡妞随心所欲</li>
                <li>所有装备均可合成PVP属性（除380级跟400级装备），网站高级技师合成加13追24全属性，自己打造超屌装备</li>
                <li>1.03H装备合成镶嵌PVP属性，全职业爆光，游戏里打命令"/爆光"，全职业自由骑黑马，全职业2技能连击</li>
                <li>新角色建立直接去网站转生既送50转，开放200转，每转300点，350级转生，满点84000点</li>
                <li>开放高级技师，合成+13追24全属性卓越装备，合成需把装备放仓库左上角定格位置，合成失败装备会消失</li>
                <li>大陆骷髅门→→古战场→→天空之城→→坎特鲁1，2，3→→坎特鲁遗址→→冰霜之城，超多刷怪，轻松练级</li>
                <li>本服最爱掉宝的BOSS，掉所有顶级装备，所有套装，大天，大天首饰，创造宝石等顶级装备</li>
                <li>爆所有套装跟守护宝石，爆10件物品，每小时刷新一次，移动到冰霜之城往回走就到巨蛛巢穴</li>
            </ul>
        </Layout>
    )
}
