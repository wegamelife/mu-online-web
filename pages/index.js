import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from "../components/Layout";

export default function Home() {
    return (
        <Layout>
            <h5>游戏特色</h5>
            <ul>
                <li>该私服基于好易全1.03H</li>
                <li>出生送2w点, 升级每级50点</li>
                <li>经验5000倍, 大师经验1000倍</li>
                <li>设置100次转生, 每次转生 500 点, 总点数 `20000 + 100*500 + 400*50 = 90000`</li>
                <li>魔王困顿 3 分钟刷新一次, 每次 5 个, 刷新地点古战场, 掉落所有套装物品</li>
                <li>所有物品合成概率统一设置为 80%</li>
                <li>装备交易无限制</li>
                <li>在线加点 /加点 32767</li>
                <li>在线洗红 /洗红</li>
            </ul>
        </Layout>
    )
}
