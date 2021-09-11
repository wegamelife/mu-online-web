import Button from "react-bootstrap/Button";
import Layout from "../components/Layout";
import {
  Alert,
  Card,
  ListGroup,
  ListGroupItem,
  Form,
  Modal,
} from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "./_app";
import axios from "axios";
import Image from "next/image";
import RoleCodeMap from "../lib/RoleCodeMap";
import { CAN_RESET_LIFE, LEVEL_UP_POINTS } from "../lib/config";
import { checkName, checkNameLength, getTotalPoints } from "../lib/utils";

export default function MyHomePage() {
  const { user, updateUser } = useContext(UserContext);
  const [characters, setCharacters] = useState([]);
  const memb___id = user ? user["memb___id"] : -9999;

  useEffect(() => {
    if (!user) {
      return;
    }

    axios
      .get(`/api/users/getCharacterByUsername?username=${user.memb___id}`)
      .then((r) => {
        setCharacters(r.data);
      });

    axios.get(`/api/users/getUser?username=${user.memb___id}`).then((r) => {
      updateUser(r.data);
      localStorage.setItem("user", JSON.stringify(r.data));
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
      <div className="characters">
        {characters.map((item) => (
          <Character item={item} key={item["Name"]} />
        ))}
      </div>
    </Layout>
  );
}

export function RenderImg({ roleName }) {
  let imgSrc = "/mofashi.jpg";

  switch (roleName) {
    case "法师":
    case "魔导士":
    case "神导师":
      imgSrc = "/mofashi.jpg";
      break;
    case "剑士":
    case "骑士":
    case "神骑士":
      imgSrc = "/jianshi.jpg";
      break;
    case "弓箭手":
    case "圣射手":
    case "神射手":
      imgSrc = "/gongjianshou.jpg";
      break;
    case "召唤师":
    case "圣巫师":
    case "神巫师":
      imgSrc = "/zhaohuanshi.jpg";
      break;
    case "魔剑士":
    case "剑圣":
      imgSrc = "/mojianshi.jpg";
      break;
    case "圣导师":
    case "祭师":
      imgSrc = "/shendaoshi.jpg";
      break;
  }

  return <Image src={imgSrc} width={80} height={80} alt="icon" />;
}

function Character({ item }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [Strength, setStrength] = useState(item["Strength"]);
  const [Dexterity, setDexterit] = useState(item["Dexterity"]);
  const [Vitality, setVitality] = useState(item["Vitality"]);
  const [Energy, setEnergy] = useState(item["Energy"]);
  const [LevelUpPoint, setLevelUpPoint] = useState(item["LevelUpPoint"]);
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);

  const totalPoints = getTotalPoints(item);
  const roleName = RoleCodeMap[item["Class"]];

  const to3Zhuan = () => {
    if (loading) {
      return;
    }

    const _confirm = confirm("确定要转职?");

    if (!_confirm) {
      return;
    }

    if (item["cLevel"] < 4000) {
      setMessage("貌似你还没有4000级");
      return;
    }

    if (![1, 17, 33, 48, 64, 81].includes(item["Class"])) {
      setMessage("只有二转职业才能进行快速三转");
      return;
    }

    setLoading(true);
    axios
      .post(`/api/users/zhuanZhi3`, {
        username: item["AccountID"],
        characterName: item["Name"],
      })
      .then((r) => {
        console.log(r.data);
        setMessage("成功3次转职");
        setTimeout(() => {
          location.reload();
        }, 500);
      })
      .catch((err) => {
        console.log(err.response.data);
        setMessage(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const backTo2Zhuan = () => {
    if (loading) {
      return;
    }
    const _confirm = confirm(
      "你确定要恢复到二转吗?恢复2转请取下三代翅膀,不然会丢失"
    );

    if (!_confirm) {
      return;
    }

    if (![3, 19, 35, 83, 50, 66].includes(item["Class"])) {
      setMessage("貌似你还没有三转");
      return;
    }

    setLoading(true);
    axios
      .post(`/api/users/backTo2Zhuan`, {
        username: item["AccountID"],
        characterName: item["Name"],
      })
      .then((r) => {
        console.log(r.data);
        setMessage("成功恢复到二转");
        setTimeout(() => {
          location.reload();
        }, 500);
      })
      .catch((err) => {
        console.log(err.response.data);
        setMessage(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const is3Zhuan = [3, 19, 35, 83, 50, 66].includes(item["Class"]);
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
        {/*<ListGroupItem>转生次数: {item["ResetLife"]}</ListGroupItem>*/}
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
        <div className="characters-actions">
          {CAN_RESET_LIFE && (
            <Button
              disabled={loading}
              variant="outline-primary"
              size="sm"
              onClick={() => {
                if (loading) {
                  return;
                }

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

                setLoading(true);
                axios
                  .post(`/api/users/resetLife`, {
                    username: item["AccountID"],
                    characterName: item["Name"],
                  })
                  .then((r) => {
                    console.log(r.data);
                    setMessage("成功转职");
                    setTimeout(() => {
                      location.reload();
                    }, 200);
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
          )}
          <Button
            disabled={loading}
            variant="outline-primary"
            size="sm"
            onClick={() => {
              if (loading) {
                return;
              }

              setLoading(true);
              axios
                .post(`/api/users/clearPoints`, {
                  username: item["AccountID"],
                  characterName: item["Name"],
                })
                .then((r) => {
                  console.log(r.data);
                  setMessage("洗点成功");
                  setTimeout(() => {
                    location.reload();
                  }, 500);
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
            {loading ? "Loading..." : "在线洗点"}
          </Button>
          <Button
            disabled={loading}
            variant="outline-primary"
            size="sm"
            onClick={() => {
              if (loading) {
                return;
              }

              if (LevelUpPoint < 0) {
                setMessage("剩余点数不能为负数");
                return;
              }

              setLoading(true);
              axios
                .post(`/api/users/addPoints`, {
                  username: item["AccountID"],
                  characterName: item["Name"],
                  Strength: Strength,
                  Dexterity: Dexterity,
                  Vitality: Vitality,
                  Energy: Energy,
                })
                .then((r) => {
                  console.log(r.data);
                  setMessage("加点成功");
                  setTimeout(() => {
                    location.reload();
                  }, 500);
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
            {loading ? "Loading..." : "在线加点"}
          </Button>
          {is3Zhuan ? (
            <Button
              disabled={loading}
              variant="outline-primary"
              onClick={backTo2Zhuan}
              size="sm"
            >
              {loading ? "Loading..." : "退回二转"}
            </Button>
          ) : (
            <Button
              disabled={loading}
              variant="outline-primary"
              onClick={to3Zhuan}
              size="sm"
            >
              {loading ? "Loading..." : "三次转职"}
            </Button>
          )}
          <Button
            disabled={loading}
            variant="outline-primary"
            onClick={() => {
              setShowChangeNameModal(true);
            }}
            size="sm"
          >
            {loading ? "Loading..." : "在线改名"}
          </Button>
        </div>
      </Card.Body>
      {showChangeNameModal && (
        <ChangeNameComponent
          item={item}
          showChangeNameModal={showChangeNameModal}
          setShowChangeNameModal={setShowChangeNameModal}
        />
      )}
    </Card>
  );
}

function ChangeNameComponent({
  item,
  showChangeNameModal,
  setShowChangeNameModal,
}) {
  const [changedName, setChangedName] = useState(item["Name"]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      <Modal
        show={showChangeNameModal}
        onHide={() => {
          setShowChangeNameModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>在线改名</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="角色名称"
            value={changedName}
            onChange={(e) => {
              const v = e.target.value;
              setChangedName(v);
            }}
          />
          <div className="my-2">
            {message && <Alert variant="danger">{message}</Alert>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={() => {
              setShowChangeNameModal(false);
            }}
          >
            关闭
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (!checkName(changedName)) {
                setMessage("输入的数据包含系统所禁止的字符,请重新输入");
                return;
              }

              if (!checkNameLength(changedName)) {
                setMessage("角色名称太长");
                return;
              }

              const _confirm = confirm("确定要修改角色名称吗");
              if (!_confirm) {
                return;
              }
              setLoading(true);
              axios
                .post(`/api/users/changeCharacterName`, {
                  username: item["AccountID"],
                  characterName: item["Name"],
                  newName: changedName,
                })
                .then((r) => {
                  console.log(r.data);
                  setMessage("成功修改角色名称");
                  setTimeout(() => {
                    location.reload();
                  }, 500);
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
            保存
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
