import Layout from "../components/Layout";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { getRoleNameByCode, RenderImg } from "./account-page";

export default function UserRankPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`/api/users/getCharacters`).then((res) => {
      setUsers(res.data);
    });
  }, []);

  return (
    <Layout>
      <h5 className="mb-3">玩家排行榜</h5>
      <div className="rank">
        {users.map((item, index) => (
          <Character item={item} key={item["Name"]} index={index} />
        ))}
      </div>
    </Layout>
  );
}

function Character({ item, index }) {
  const roleName = getRoleNameByCode(item["Class"]);
  return (
    <Card style={{ width: "20rem", marginBottom: "1rem" }} key={item["Name"]}>
      <Card.Header>
        <div className="c-header">
          <RenderImg roleName={roleName} />
          <div className="name-role">
            <h5>
              {item["Name"]}({index})
            </h5>
            <div>{roleName}</div>
          </div>
        </div>
      </Card.Header>
      <ListGroup className="list-group-flush">
        <ListGroupItem>转生次数: {item["ResetLife"]}</ListGroupItem>
        <ListGroupItem>当前等级: {item["cLevel"]}</ListGroupItem>
        <ListGroupItem>剩余点数: {item["LevelUpPoint"]}</ListGroupItem>
        <ListGroupItem>力量: {item["Strength"]}</ListGroupItem>
        <ListGroupItem>敏捷: {item["Dexterity"]}</ListGroupItem>
        <ListGroupItem>体力: {item["Vitality"]}</ListGroupItem>
        <ListGroupItem>智力: {item["Energy"]}</ListGroupItem>
      </ListGroup>
    </Card>
  );
}
