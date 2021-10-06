import Layout from "../components/Layout";
import { Alert, Button, Form } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";

import axios from "axios";
import { UserContext } from "./_app";
import socketItemProperties from "../lib/socket-item-properties.json";
import SocketItems from "../lib/socket-items.json";
import { parseItem, replaceAt } from "../lib/utils";
import { SOCKET_NEED_JF } from "../lib/config";
import { getUserData } from "../lib/client-utils";

function getWarehouseFirstItem(Items) {
  const rawItem = Items.substr(0, 32);
  const parsedInfo = parseItem(rawItem);
  const it = SocketItems.find(
    (item) =>
      item.category === parsedInfo.category && item.index === parsedInfo.index
  );

  return {
    rawItem,
    info: it,
  };
}

export default function RankPage() {
  const [warehouse, setWarehouse] = useState(null);
  const { user, updateUser, updateMessage } = useContext(UserContext);
  const [firstItemInfo, setFirstItemInfo] = useState({
    rawItem: null,
    info: { name: "未知" },
  });

  const [loading, setLoading] = useState(false);
  const [socket1, setSocket1] = useState("FF");
  const [socket2, setSocket2] = useState("FF");
  const [socket3, setSocket3] = useState("FF");
  const [socket4, setSocket4] = useState("FF");
  const [socket5, setSocket5] = useState("FF");
  const [yg, setYg] = useState("F");

  const { puTongShuXing, yingGuangShuXing } = socketItemProperties;

  return (
    <Layout>
      <Alert variant="primary">
        <h4 className="alert-heading">可镶嵌物品</h4>
        <p>
          请将要镶嵌的物品放到<i>仓库左上角</i>,
          支持镶嵌的物品包括400级物品以及部分自定镶嵌物品.
        </p>
        <p>
          {SocketItems.map((item) => (
            <span key={`${item.category}${item.index}`}>{item.name}, </span>
          ))}
        </p>
        <hr />
        <Button
          disabled={false}
          variant="outline-primary"
          type="submit"
          onClick={(e) => {
            if (!user) {
              updateMessage(`用户未登录, 请重新登录`);
              return;
            }
            updateMessage(``);
            const url = `/api/users/getWarehouseInfo?username=${user.memb___id}`;
            const devUrl = `/json/warehouse.json`;
            setLoading(true);
            axios
              .get(url)
              .then((r) => {
                let { Items } = r.data;
                Items = Items.toUpperCase();
                const firstInfo = getWarehouseFirstItem(Items);
                if (!firstInfo.info) {
                  updateMessage(`当前仓库左上角没有物品或者物品不支持镶嵌`);
                  return;
                }
                setFirstItemInfo(firstInfo);
                setWarehouse(r.data);

                setYg(Items.charAt(21));
                setSocket1(Items.substring(22, 24));
                setSocket2(Items.substring(24, 26));
                setSocket3(Items.substring(26, 28));
                setSocket4(Items.substring(28, 30));
                setSocket5(Items.substring(30, 32));
              })
              .catch((err) => {
                console.log(err);
                updateMessage(err.response.data.message);
              })
              .finally(() => {
                setLoading(false);
              });

            getUserData(user.memb___id)
              .then((r) => {
                updateUser(r.data);
                localStorage.setItem("user", JSON.stringify(r.data));
              })
              .catch((err) => {
                updateMessage(err.response.data.message);
              });
          }}
        >
          {loading ? "loading..." : "检测物品"}
        </Button>
      </Alert>

      {warehouse && !loading && (
        <div className="socket mb-5" style={{ maxWidth: "500px" }}>
          <h6 className="text-center text-primary">
            {firstItemInfo.info.name}
          </h6>
          <Form>
            <Form.Select
              value={socket1}
              onChange={(e) => {
                setSocket1(e.target.value);
              }}
            >
              {puTongShuXing.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.category} {item.name}
                </option>
              ))}
            </Form.Select>
            <Form.Select
              value={socket2}
              onChange={(e) => {
                setSocket2(e.target.value);
              }}
            >
              {puTongShuXing.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.category} {item.name}
                </option>
              ))}
            </Form.Select>
            <Form.Select
              value={socket3}
              onChange={(e) => {
                setSocket3(e.target.value);
              }}
            >
              {puTongShuXing.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.category} {item.name}
                </option>
              ))}
            </Form.Select>
            <Form.Select
              value={socket4}
              onChange={(e) => {
                setSocket4(e.target.value);
              }}
            >
              {puTongShuXing.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.category} {item.name}
                </option>
              ))}
            </Form.Select>
            <Form.Select
              value={socket5}
              onChange={(e) => {
                setSocket5(e.target.value);
              }}
            >
              {puTongShuXing.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.category} {item.name}
                </option>
              ))}
            </Form.Select>

            <h6 className="my-2 text-center">荧光属性</h6>
            <Form.Select
              value={yg}
              onChange={(e) => {
                setYg(e.target.value);
              }}
            >
              {yingGuangShuXing.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.category} {item.name}
                </option>
              ))}
            </Form.Select>

            <div className="mt-4">
              <Button
                disabled={loading}
                variant="outline-primary"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  const currentJF = user.JF;
                  const _confirm = confirm(
                    `镶嵌要收取额外的 ${SOCKET_NEED_JF} 积分, 你同意吗?`
                  );

                  if (!_confirm) {
                    return;
                  }

                  if (currentJF - SOCKET_NEED_JF < 0) {
                    updateMessage(
                      `镶嵌需要 ${SOCKET_NEED_JF} 积分,你当前的积分还不够.`
                    );
                    return;
                  }

                  const { rawItem } = firstItemInfo;
                  const { Items } = warehouse;

                  let updated = rawItem;
                  updated = replaceAt(updated, 21, yg);
                  updated = replaceAt(updated, 22, socket1);
                  updated = replaceAt(updated, 24, socket2);
                  updated = replaceAt(updated, 26, socket3);
                  updated = replaceAt(updated, 28, socket4);
                  updated = replaceAt(updated, 30, socket5);

                  setLoading(true);
                  const updatedItems = `0x${updated}${Items.substr(32)}`;
                  axios
                    .post(`/api/users/updateItemsSockets`, {
                      username: user.memb___id,
                      items: updatedItems,
                      itemName: firstItemInfo.info.name,
                    })
                    .then((r) => {
                      alert("成功镶嵌!");
                      location.reload();
                    })
                    .catch((err) => {
                      console.log(err.response.data);
                      alert(err.response.data.message);
                      location.reload();
                    })
                    .finally(() => {
                      setLoading(false);
                    });
                }}
              >
                {loading ? "loading..." : "确认镶嵌"}
              </Button>
            </div>
          </Form>
        </div>
      )}
    </Layout>
  );
}
