import Button from "react-bootstrap/Button";
import Layout from "../components/Layout";
import { Form, Alert, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "./_app";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

export default function AccountPage() {
  const { user, updateUser } = useContext(UserContext);
  const router = useRouter();
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    if (!user) {
      return;
    }
    axios
      .get(`/api/users/getCharacters?username=${user.memb___id}`)
      .then((r) => {
        console.log(r.data);
        setCharacters(r.data);
      });
  }, [user]);

  if (!user) {
    return (
      <Layout>
        <Alert variant="danger">请先登陆</Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <h4>角色管理</h4>
      <div className="characters">
        {characters.map((item) => (
          <Character item={item} key={item["Name"]} />
        ))}
      </div>
    </Layout>
  );
}

function getRoleNameByCode(code) {
  let rs = "未知";
  switch (code) {
    case 0:
      rs = "魔法师";
      break;
    case 1:
      rs = "魔导师";
      break;
    case 16:
      rs = "剑士";
      break;
    case 19:
      rs = "神骑士";
      break;
    case 48:
      rs = "魔剑士";
      break;
    case 81:
      rs = "巫师";
      break;
  }

  return rs;
}

function RenderImg({ roleName }) {
  let imgSrc = "/mofashi.jpg";

  switch (roleName) {
    case "魔法师":
    case "魔导师":
      imgSrc = "/mofashi.jpg";
      break;
    case "剑士":
    case "神骑士":
      imgSrc = "/jianshi.jpg";
      break;
    case "弓箭手":
      imgSrc = "/gongjianshou.jpg";
      break;
    case "魔剑士":
      imgSrc = "/mojianshi.jpg";
      break;
    case "巫师":
      imgSrc = "/zhaohuanshi.jpg";
      break;
    case "圣导师":
      imgSrc = "/shendaoshi.jpg";
      break;
  }

  return <Image src={imgSrc} width={88} height={88} alt="icon" />;
}

function Character({ item }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const roleName = getRoleNameByCode(item["Class"]);

  return (
    <Card style={{ width: "100%" }} key={item["Name"]}>
      <Card.Header>
        <div className="c-header">
          <RenderImg roleName={roleName} />
          <div className="name-role">
            <h5>{item["Name"]}</h5>
            <div>{roleName}</div>
          </div>
        </div>
      </Card.Header>
      <ListGroup className="list-group-flush">
        <ListGroupItem>转生次数: {item["ResetLife"]}</ListGroupItem>
        <ListGroupItem>当前等级: {item["cLevel"]}</ListGroupItem>
        <ListGroupItem>剩余点数: {item["LevelUpPoint"]}</ListGroupItem>
      </ListGroup>
      <Card.Body>
        {message && <Alert variant="danger">{message}</Alert>}
        <Button
          variant="outline-primary"
          style={{ marginRight: ".5rem" }}
          onClick={() => {
            const resetLife = item["ResetLife"];
            const cLevel = item["cLevel"];

            if (resetLife > 100) {
              setMessage("你已经满转了");
              return;
            }

            if (cLevel < 349) {
              setMessage("当前角色等级不到350");
              return;
            }

            setLoading(true);
            axios
              .get(
                `/api/users/resetLife?username=${item["AccountID"]}&characterName=${item["Name"]}`
              )
              .then((r) => {
                console.log(r.data);
              })
              .catch((err) => {
                console.log(err.response.data);
                setMessage(err.response.data.message);
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          {loading ? "Loading..." : "转生"}
        </Button>
        <Button
          variant="outline-primary"
          onClick={() => {
            setMessage("这个功能还没做完！");
          }}
        >
          洗点
        </Button>
      </Card.Body>
    </Card>
  );
}
