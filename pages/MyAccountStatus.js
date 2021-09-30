import Layout from "../components/Layout";
import { Alert, Button } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./_app";

export default function MyAccountStatus() {
  const { user, updateMessage } = useContext(UserContext);
  const [latestUser, setLatestUser] = useState(null);
  const memb___id = user ? user["memb___id"] : -9999;

  useEffect(() => {
    console.log(`user`, user);
    if (!user) {
      return;
    }
    const devUrl = `/json/user.json`;
    const url = `/api/users/getUser?username=${user.memb___id}`;
    axios
      .get(url)
      .then((r) => {
        setLatestUser(r.data);
      })
      .catch((err) => {
        updateMessage(err.response.data.message);
      });
  }, [memb___id]);

  return (
    <Layout>
      <h5 className="mb-3">账号状态</h5>
      {latestUser && <AccountInfo user={latestUser} />}
    </Layout>
  );
}

const AlertIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
    viewBox="0 0 16 16"
    role="img"
    aria-label="Warning:"
  >
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
  </svg>
);

function AccountInfo({ user }) {
  const { updateMessage } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const isBlocked = user["bloc_code"] !== "0";
  const userAccount = user["memb___id"];
  const jf = user["JF"];
  const applyDays = user["appl_days"];
  const messageOk = <div>你当前的账号正常!</div>;
  const messageBlocked = (
    <div>
      <p>
        <AlertIcon />
        <span>当前账号异常, 请点击修复进行修复</span>
      </p>
      <Button
        variant="outline-primary"
        disabled={loading}
        onClick={(e) => {
          const url = `/api/users/unBlockAccount?username=${userAccount}`;
          setLoading(true);
          axios
            .post(url, {
              username: userAccount,
            })
            .then((r) => {
              console.log(r.data);
              updateMessage("修复成功");
              setTimeout(() => {
                location.reload();
              }, 200);
            })
            .catch((err) => {
              console.log(err.response.data);
              updateMessage(err.response.data.message);
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      >
        {loading ? "修复中..." : "修复"}
      </Button>
    </div>
  );

  return (
    <Alert variant={isBlocked ? "danger" : "success"}>
      <h4 className="alert-heading">{userAccount}</h4>
      <p>
        账号注册日期 <i>{applyDays}</i>, 当前积分 <i>{jf}</i>
      </p>
      <hr />
      {isBlocked ? messageBlocked : messageOk}
    </Alert>
  );
}
