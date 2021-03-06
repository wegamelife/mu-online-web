import Layout from "../components/Layout";
import { Form, Alert, Button } from "react-bootstrap";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "./_app";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useContext(UserContext);

  return (
    <Layout>
      <h5 className="mb-3">用户登录</h5>
      <hr />
      {message && <Alert variant="danger">{message}</Alert>}

      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>用户名</Form.Label>
          <Form.Control
            type="text"
            placeholder="请输入你的用户名"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>密码</Form.Label>
          <Form.Control
            placeholder="请输入密码"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Group>
        <Button
          disabled={loading}
          variant="primary"
          type="submit"
          onClick={(e) => {
            e.preventDefault();

            if (!username || !password) {
              setMessage("用户名跟密码不能为空");
              return;
            }

            setLoading(true);
            axios
              .post("/api/users/login", {
                username: username,
                password: password,
              })
              .then((res) => {
                const user = res.data;
                delete user["memb__pwd"];
                localStorage.setItem("user", JSON.stringify(user));
                updateUser(user);
                router.replace("/MyHomePage");
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
          {loading ? "loading..." : "确认"}
        </Button>
      </Form>
    </Layout>
  );
}
