import Layout from "../components/Layout";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { useState, useEffect } from "react";
import { getRoleNameByCode, RenderImg } from "./MyHomePage";
import axios from "axios";

export default function RankPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`/api/users/getCharacters`).then((res) => {
      setUsers(res.data);
    });
  }, []);

  return (
    <Layout>
      <h5 className="mb-3">玩家排行榜</h5>
      <hr />
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
    <Card style={{ width: "20rem" }} key={item["Name"]} className="rank-card">
      <span className="index">{index + 1}</span>
      <Card.Header>
        <div className="c-header">
          <RenderImg roleName={roleName} />
          <div className="name-role">
            <h5>
              {item["Name"]}({index + 1})
            </h5>
            <div>{roleName}</div>
          </div>
        </div>
      </Card.Header>
      <ListGroup className="list-group-flush">
        <ListGroupItem>转生次数: {item["ResetLife"]}</ListGroupItem>
        <ListGroupItem>当前等级: {item["cLevel"]}</ListGroupItem>
        <ListGroupItem>
          <span style={{ fontSize: "12px", opacity: 0.8 }}>
            力{item["Strength"]}/敏{item["Dexterity"]}/:{item["Vitality"]}/智
            {item["Energy"]}
          </span>
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
}
