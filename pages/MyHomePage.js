import Button from "react-bootstrap/Button";
import Layout from "../components/Layout";
import { Card, ListGroup, ListGroupItem, Form, Modal } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "./_app";
import axios from "axios";
import RoleCodeMap from "../lib/RoleCodeMap";
import { CAN_RESET_LIFE } from "../lib/config";
import { checkName, checkNameLength, getTotalPoints } from "../lib/utils";
import RenderImg from "../components/RenderImg";
import NoLoginComponent from "../components/NoLoginComponent";

export default function MyHomePage() {
  const { user, updateUser, updateMessage } = useContext(UserContext);
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
      })
      .catch((err) => {
        updateMessage(err.response.data.message);
      });

    axios
      .get(`/api/users/getUser?username=${user.memb___id}`)
      .then((r) => {
        updateUser(r.data);
        localStorage.setItem("user", JSON.stringify(r.data));
      })
      .catch((err) => {
        updateMessage(err.response.data.message);
      });
  }, [memb___id]);

  if (!user) {
    return <NoLoginComponent />;
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

function Character({ item }) {
  const { updateMessage } = useContext(UserContext);
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

    if (item["cLevel"] < 2000) {
      updateMessage("貌似你还没有2000级");
      return;
    }

    if (![1, 17, 33, 48, 64, 81].includes(item["Class"])) {
      updateMessage("只有二转职业才能进行快速三转");
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
        updateMessage("成功3次转职");
        setTimeout(() => {
          location.reload();
        }, 500);
      })
      .catch((err) => {
        console.log(err.response.data);
        updateMessage(err.response.data.message);
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
      updateMessage("貌似你还没有三转");
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
        updateMessage("成功恢复到二转");
        setTimeout(() => {
          location.reload();
        }, 500);
      })
      .catch((err) => {
        console.log(err.response.data);
        updateMessage(err.response.data.message);
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
                  updateMessage("你已经满转了");
                  return;
                }

                if (cLevel < 399) {
                  updateMessage("当前角色等级不到400");
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
                    updateMessage("成功转职");
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
                  updateMessage("洗点成功");
                  setTimeout(() => {
                    location.reload();
                  }, 500);
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
                updateMessage("剩余点数不能为负数");
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
                  updateMessage("加点成功");
                  setTimeout(() => {
                    location.reload();
                  }, 500);
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
  const { updateMessage } = useContext(UserContext);

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
                updateMessage("输入的数据包含系统所禁止的字符,请重新输入");
                return;
              }

              if (!checkNameLength(changedName)) {
                updateMessage("角色名称太长");
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
                  updateMessage("成功修改角色名称");
                  setTimeout(() => {
                    location.reload();
                  }, 500);
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
            保存
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
