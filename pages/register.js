import Button from "react-bootstrap/Button";
import Layout from "../components/Layout";
import {Form} from "react-bootstrap";

export default function RegisterPage() {
    return (
        <Layout>
            <h5 className="mb-3">用户注册</h5>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>用户名</Form.Label>
                    <Form.Control type="email" placeholder="请输入你的用户名"/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>密码</Form.Label>
                    <Form.Control type="password" placeholder="请输入密码"/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>密码确认</Form.Label>
                    <Form.Control type="password" placeholder="请确认密码"/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    注册
                </Button>
            </Form>
        </Layout>
    );
}
