import Button from "react-bootstrap/Button";
import Layout from "../components/Layout";
import { Alert, Card, ListGroup, ListGroupItem, Form } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "./_app";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

export default function MyHomePage() {
  const { user, updateUser } = useContext(UserContext);
  const router = useRouter();
  const [characters, setCharacters] = useState([]);

  const memb___id = user ? user["memb___id"] : 1;

  useEffect(() => {
    if (!user) {
      return;
    }

    axios
      .get(`/api/users/getCharacterByUsername?username=${user.memb___id}`)
      .then((r) => {
        setCharacters(r.data);
      });

    axios.get(`/api/users/${user.memb___id}`).then((r) => {
      updateUser(r.data);
    });
  }, [memb___id]);

  if (!user) {
    return (
      <Layout>
        <Alert variant="danger">请先登陆</Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <h5>角色管理</h5>
      <hr />
      <div className="characters">
        {characters.map((item) => (
          <Character item={item} key={item["Name"]} />
        ))}
      </div>
    </Layout>
  );
}

export function getRoleNameByCode(code) {
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

export function RenderImg({ roleName }) {
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
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [Strength, setStrength] = useState(item["Strength"]);
  const [Dexterity, setDexterit] = useState(item["Dexterity"]);
  const [Vitality, setVitality] = useState(item["Vitality"]);
  const [Energy, setEnergy] = useState(item["Energy"]);
  const [LevelUpPoint, setLevelUpPoint] = useState(item["LevelUpPoint"]);

  const totalPoints =
    item["ResetLife"] * 600 + 1000 + item["cLevel"] * 50 + 30 * 4;

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
        <ListGroupItem>剩余点数: {LevelUpPoint}</ListGroupItem>
        <ListGroupItem>
          <div className="add-points-row">
            <span>力量</span>
            <Form.Control
              type="text"
              placeholder="力量"
              value={Strength}
              onChange={(e) => {
                const v = e.target.value;
                setStrength(v);
                setLevelUpPoint((pre) => {
                  return totalPoints - v - Dexterity - Vitality - Energy;
                });
              }}
            />
          </div>
        </ListGroupItem>
        <ListGroupItem>
          <div className="add-points-row">
            <span>敏捷</span>
            <Form.Control
              type="text"
              placeholder="敏捷"
              value={Dexterity}
              onChange={(e) => {
                const v = e.target.value;
                setDexterit(v);
                setLevelUpPoint((pre) => {
                  return totalPoints - Strength - v - Vitality - Energy;
                });
              }}
            />
          </div>
        </ListGroupItem>
        <ListGroupItem>
          <div className="add-points-row">
            <span>体力</span>
            <Form.Control
              type="text"
              placeholder="体力"
              value={Vitality}
              onChange={(e) => {
                const v = e.target.value;
                setVitality(v);
                setLevelUpPoint((pre) => {
                  return totalPoints - Strength - Dexterity - v - Energy;
                });
              }}
            />
          </div>
        </ListGroupItem>
        <ListGroupItem>
          <div className="add-points-row">
            <span>智力</span>
            <Form.Control
              type="text"
              placeholder="智力"
              value={Energy}
              onChange={(e) => {
                const v = e.target.value;
                setEnergy(v);
                setLevelUpPoint((pre) => {
                  return totalPoints - Strength - Dexterity - Vitality - v;
                });
              }}
            />
          </div>
        </ListGroupItem>
      </ListGroup>
      <Card.Body>
        {message && <Alert variant="danger">{message}</Alert>}
        <Button
          variant="outline-primary"
          style={{ marginRight: ".5rem" }}
          onClick={() => {
            const resetLife = item["ResetLife"];
            const cLevel = item["cLevel"];

            if (resetLife > 99) {
              setMessage("你已经满转了");
              return;
            }

            if (cLevel < 399) {
              setMessage("当前角色等级不到400");
              return;
            }

            setLoading1(true);
            axios
              .get(
                `/api/users/resetLife?username=${item["AccountID"]}&characterName=${item["Name"]}`
              )
              .then((r) => {
                console.log(r.data);
                setMessage("成功转职");
                setTimeout(() => {
                  location.reload();
                }, 1000);
              })
              .catch((err) => {
                console.log(err.response.data);
                setMessage(err.response.data.message);
              })
              .finally(() => {
                setLoading1(false);
              });
          }}
        >
          {loading1 ? "Loading..." : "转生"}
        </Button>

        <Button
          variant="outline-primary"
          style={{ marginRight: ".5rem" }}
          onClick={() => {
            setLoading3(true);
            axios
              .get(
                `/api/users/clearPoints?username=${item["AccountID"]}&characterName=${item["Name"]}`
              )
              .then((r) => {
                console.log(r.data);
                setMessage("洗点成功");
                setTimeout(() => {
                  location.reload();
                }, 1000);
              })
              .catch((err) => {
                console.log(err.response.data);
                setMessage(err.response.data.message);
              })
              .finally(() => {
                setLoading3(false);
              });
          }}
        >
          {loading3 ? "Loading..." : "洗点"}
        </Button>

        <Button
          variant="outline-primary"
          onClick={() => {
            if (LevelUpPoint < 0) {
              setMessage("剩余点数不能为负数");
              return;
            }

            setLoading2(true);
            axios
              .post(`/api/users/addPoints`, {
                username: item["AccountID"],
                characterName: item["Name"],
                Strength: Strength,
                Dexterity: Dexterity,
                Vitality: Vitality,
                Energy: Energy,
                LevelUpPoint: LevelUpPoint,
              })
              .then((r) => {
                console.log(r.data);
                setMessage("加点成功");
                setTimeout(() => {
                  location.reload();
                }, 1000);
              })
              .catch((err) => {
                console.log(err.response.data);
                setMessage(err.response.data.message);
              })
              .finally(() => {
                setLoading2(false);
              });
          }}
        >
          {loading2 ? "Loading..." : "加点"}
        </Button>
      </Card.Body>
    </Card>
  );
}
