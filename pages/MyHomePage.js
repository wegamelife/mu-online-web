import Button from "react-bootstrap/Button";
import Layout from "../components/Layout";
import { Card, ListGroup, ListGroupItem, Form, Modal } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "./_app";
import axios from "axios";
import RoleCodeMap from "../lib/RoleCodeMap";
import { CAN_RESET_LIFE } from "../lib/config";
import {
  checkName,
  checkNameLength,
  getCharacterAbbr,
  getMoreWarehouseNeedJF,
  getTotalPoints,
} from "../lib/utils";
import { getUserData } from "../lib/client-utils";
import RenderImg from "../components/RenderImg";

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

    getUserData(user.memb___id)
      .then((r) => {
        updateUser(r.data);
        localStorage.setItem("user", JSON.stringify(r.data));
      })
      .catch((err) => {
        updateMessage(err.response.data.message);
      });
  }, [memb___id]);

  return (
    <Layout>
      <h5>角色管理</h5>
      <div className="characters">
        {characters.map((item) => (
          <Character item={item} key={item["Name"]} />
        ))}
      </div>
      <h5 className="mt-4">扩展仓库</h5>
      {user && <WarehouseExt user={user} />}
    </Layout>
  );
}

function WarehouseExt({ user }) {
  const { updateMessage } = useContext(UserContext);
  const [warehouse, setWarehouse] = useState(null);
  const [warehouseExt, setWarehouseExt] = useState([]);

  const warehouseAndExtIsLoaded = warehouse && warehouseExt.length > 0;
  const username = user.memb___id;

  useEffect(() => {
    axios
      .get(`/api/users/getWarehouseInfo?username=${username}`)
      .then((r) => {
        setWarehouse(r.data);
      })
      .catch((err) => {
        updateMessage(err.response.data.message);
      });

    axios
      .get(`/api/users/getWarehouseExtInfo?username=${username}`)
      .then((r) => {
        setWarehouseExt(r.data);
      })
      .catch((err) => {
        updateMessage(err.response.data.message);
      });
  }, [username]);

  return (
    <div className="mb-5 warehouse-ext">
      {warehouseExt.length === 0 && (
        <div>
          <span className="me-2">要使用扩展仓库, 请先初始化</span>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => {
              const _confirm = confirm("确定要初始化扩展仓库吗?");

              if (!_confirm) {
                return;
              }

              axios
                .post(`/api/users/initWarehouseExt`, {
                  username: username,
                })
                .then((r) => {
                  updateMessage("扩展仓库初始化完毕");
                  setTimeout(() => {
                    location.reload();
                  }, 500);
                })
                .catch((err) => {
                  console.log(err.response.data);
                  updateMessage(err.response.data.message);
                })
                .finally(() => {});
            }}
          >
            初始化
          </Button>
        </div>
      )}
      {warehouseAndExtIsLoaded && (
        <p className="text-muted mb-2">
          开通第一个扩展仓库免费,
          额外在开通的扩展仓库所需要的积分是根据如下公式计算的{" "}
          <b>(n - 1) * (n - 1) * 5000</b>
        </p>
      )}
      {warehouseAndExtIsLoaded && (
        <div className="warehouse-ext-list">
          {warehouseExt.map((item) => (
            <Button
              variant={
                warehouse.UsedSlot === item.UsedSlot
                  ? "primary"
                  : "outline-primary"
              }
              key={item.UsedSlot}
              disabled={warehouse.UsedSlot === item.UsedSlot}
              onClick={() => {
                // 切换仓库
                if (warehouse.UsedSlot === item.UsedSlot) {
                  return;
                }
                axios
                  .post(`/api/users/switchWarehouse`, {
                    username: username,
                    targetUsedSlot: item.UsedSlot,
                  })
                  .then((r) => {
                    updateMessage("仓库切换成功");
                    setTimeout(() => {
                      location.reload();
                    }, 500);
                  })
                  .catch((err) => {
                    console.log(err.response.data);
                    updateMessage(err.response.data.message);
                  })
                  .finally(() => {});
              }}
            >
              仓库 {item.UsedSlot - 1}
            </Button>
          ))}
          <Button
            variant="outline-primary"
            key={999}
            onClick={() => {
              const extraWarehouseNum = warehouseExt.length;
              const needJF = getMoreWarehouseNeedJF(extraWarehouseNum);
              const currentJF = user.JF;

              if (currentJF - needJF < 0) {
                updateMessage(
                  `开通额外的扩展仓库需要 ${needJF} 积分,你当前的积分还不够.`
                );
                return;
              }

              let msg = `开通第 ${extraWarehouseNum} 个扩展仓库需要 ${needJF} 积分, 你同意吗?`;

              const _confirm = confirm(msg);

              if (!_confirm) {
                return;
              }

              axios
                .post(`/api/users/addNewWarehouseExt`, {
                  username: username,
                  needJF,
                })
                .then((r) => {
                  updateMessage("成功开通仓库");
                  setTimeout(() => {
                    location.reload();
                  }, 500);
                })
                .catch((err) => {
                  console.log(err.response.data);
                  updateMessage(err.response.data.message);
                })
                .finally(() => {});
            }}
          >
            开通更多
          </Button>
        </div>
      )}
    </div>
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

    if (item["cLevel"] < 400) {
      updateMessage("貌似你还没有400级");
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
  const abbr = getCharacterAbbr(item["Class"]);
  return (
    <Card
      style={{ width: "100%" }}
      key={item["Name"]}
      className={`rank-card ${abbr} shadow-sm`}
    >
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
