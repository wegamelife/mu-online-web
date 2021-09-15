import Layout from "./Layout";
import { Alert } from "react-bootstrap";

export default function NoLoginComponent() {
  return (
    <Layout>
      <Alert variant="danger">请先登录</Alert>
    </Layout>
  );
}
