import Layout from "../components/Layout";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { useState, useEffect } from "react";
import { RenderImg } from "./MyHomePage";
import RoleCodeMap from "../lib/RoleCodeMap";
import axios from "axios";
import { getTotalPoints } from "../lib/utils";

export default function RankPage() {
  const [users, setUsers] = useState([]);
  const [userOnlineStatus, setUserOnlineStatus] = useState([]);

  useEffect(() => {
    const url = `/api/users/getCharacters`;
    const devUrl = `/json/1.json`;
    axios
      .get(url)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });

    axios
      .get(`/api/users/getUserOnlineStatus`)
      .then((res) => {
        setUserOnlineStatus(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  const onlineUserIds = userOnlineStatus
    .filter((it) => it.ConnectStat === 1)
    .map((it) => it["memb___id"]);

  return (
    <Layout>
      <h5
        className="mb-3"
        title="根据玩家转生次数, 大师等级, 普通等级, 完成转数时间, 相同转生次数的按照最早完成该次数的优先"
      >
        玩家排行榜({onlineUserIds.length}/{userOnlineStatus.length})
      </h5>
      <div className="rank">
        {users.map((item, index) => (
          <Character
            item={item}
            key={item["Name"]}
            index={index}
            online={onlineUserIds.includes(item["AccountID"])}
          />
        ))}
      </div>
    </Layout>
  );
}

function Character({ item, index, online }) {
  const roleName = RoleCodeMap[item["Class"]];
  const totalPoints = getTotalPoints(item);

  return (
    <Card style={{ width: "100%" }} key={item["Name"]} className="rank-card">
      <Card.Header>
        <div
          className={index < 3 ? "c-header rank-card-top-style" : "c-header"}
        >
          <RenderImg roleName={roleName} />
          <div className="name-role">
            <h5>{item["Name"]}</h5>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                color={online ? "#0d6efd" : ""}
                fill="currentColor"
                className="bi bi-reception-4"
                viewBox="0 0 16 16"
              >
                <path d="M0 11.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-5zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-8zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-11z" />
              </svg>{" "}
              {roleName}
            </div>
            <div title="排名">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-sort-alpha-down"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"
                />
                <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z" />
              </svg>{" "}
              {index + 1}
            </div>
          </div>
        </div>
      </Card.Header>
      <ListGroup className="list-group-flush">
        <ListGroupItem>转生次数: {item["ResetLife"]}</ListGroupItem>
        <ListGroupItem>大师等级: {item["MASTER_LEVEL"]}</ListGroupItem>
        <ListGroupItem>当前等级: {item["cLevel"]}</ListGroupItem>
        <ListGroupItem>总共点数: {totalPoints}</ListGroupItem>
      </ListGroup>
    </Card>
  );
}
