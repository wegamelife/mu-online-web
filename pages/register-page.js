import Button from "react-bootstrap/Button";
import Layout from "../components/Layout";
import { Form, Alert } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <Layout>
      <h5 className="mb-3">用户注册</h5>
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
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>确认密码</Form.Label>
          <Form.Control
            type="password"
            placeholder="请输入确认密码"
            value={passwordConfirm}
            onChange={(e) => {
              setPasswordConfirm(e.target.value);
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

            if (password !== passwordConfirm) {
              setMessage("确认密码不一致");
              return;
            }

            setLoading(true);
            axios
              .post("/api/users/register", {
                username: username,
                password: password,
              })
              .then((res) => {
                // localStorage.setItem("user", JSON.stringify(res.data));
                alert("注册成功");
                router.replace("/login-page");
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
          {loading ? "loading..." : "注册"}
        </Button>
      </Form>
    </Layout>
  );
}
