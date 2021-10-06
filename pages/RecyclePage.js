import Layout from "../components/Layout";
import { Alert, Button } from "react-bootstrap";
import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./_app";
import RecycleItems from "../lib/recycle-items.json";
import { getUserData } from "../lib/client-utils";
import { getWarehouseFirstItem } from "../lib/utils";
import { ENABLE_RECYCLE } from "../lib/config";

export default function RecyclePage() {
  const [warehouse, setWarehouse] = useState(null);
  const { user, updateUser, updateMessage } = useContext(UserContext);
  const [firstItemInfo, setFirstItemInfo] = useState({
    rawItem: null,
    info: { name: "未知" },
  });

  const [loading, setLoading] = useState(false);

  return (
    <Layout>
      <Alert variant="primary">
        <h4 className="alert-heading">可回收物品</h4>
        <p>
          请将要回收的物品放到<i>仓库左上角</i>, 支持回收的物品有,
          {RecycleItems.map((item) => (
            <span key={`${item.category}${item.index}`}>
              {item.name}({item.price}),{" "}
            </span>
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
            setLoading(true);
            axios
              .get(url)
              .then((r) => {
                let { Items } = r.data;
                Items = Items.toUpperCase();
                const firstInfo = getWarehouseFirstItem(Items, RecycleItems);
                if (!firstInfo.info) {
                  updateMessage(`当前仓库左上角没有物品或者物品不支持回收`);
                  return;
                }
                setFirstItemInfo(firstInfo);
                setWarehouse(r.data);
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
          <h4 className="text-primary">{firstItemInfo.info.name}</h4>
          <p className="text-muted">回收可得 {firstItemInfo.info.price} 积分</p>
          <div className="mt-4">
            <Button
              disabled={loading}
              variant="outline-primary"
              type="submit"
              onClick={(e) => {
                e.preventDefault();

                if (!ENABLE_RECYCLE) {
                  alert(`暂不支持回收`);
                  return;
                }

                const { price } = firstItemInfo.info;

                const _confirm = confirm(
                  `回收会获得 ${price} 积分,你确定要回收吗?`
                );
                if (!_confirm) {
                  return;
                }
                const { Items } = warehouse;
                const updated = `FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF`;
                const updatedItems = `0x${updated}${Items.substr(32)}`;

                setLoading(true);
                axios
                  .post(`/api/users/recyle`, {
                    username: user.memb___id,
                    items: updatedItems,
                    itemInfo: firstItemInfo.info,
                  })
                  .then((r) => {
                    alert(`回收成功! 获得 ${price} 积分`);
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
              {loading ? "loading..." : "确认回收"}
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}
