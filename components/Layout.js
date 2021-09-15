import Head from "next/head";
import { Alert, Container, Nav, Navbar } from "react-bootstrap";

import { useContext } from "react";
import { UserContext } from "../pages/_app";
import { useRouter } from "next/router";
import axios from "axios";

export default function Layout({ children, home }) {
  const { user, message } = useContext(UserContext);
  const router = useRouter();
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicons/favicon.ico" />
        <meta name="description" content="土鳖奇迹" />
      </Head>
      <header>
        <Navbar variant="light" bg="white" expand="md" fixed="top">
          <Container>
            <Navbar.Brand href="/">土鳖奇迹</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto" navbarScroll>
                <Nav.Link href="/">首页</Nav.Link>
                <Nav.Link href="/MyHomePage">账号管理</Nav.Link>
                <Nav.Link href="/RankPage">排行榜</Nav.Link>
                <Nav.Link href="/GameDownloadPage">游戏下载</Nav.Link>
              </Nav>
              {!user ? (
                <Nav>
                  <Nav.Link href="/LoginPage">登录</Nav.Link>
                  <Nav.Link href="/RegisterPage">注册</Nav.Link>
                </Nav>
              ) : (
                <Nav>
                  <Nav.Link href="/">
                    {user["memb___id"]}({user["jf"]})
                  </Nav.Link>
                  <Nav.Link href="/MyAccountStatus">账号状态</Nav.Link>
                  <Nav.Link
                    href="/"
                    onClick={(e) => {
                      axios.get("/api/users/logout").then((r) => {
                        e.preventDefault();
                        localStorage.removeItem("user");
                        router.push("/LoginPage");
                      });
                    }}
                  >
                    退出
                  </Nav.Link>
                </Nav>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <main style={{ marginTop: "5rem" }}>
        <Container className="mt-4">
          {message && <Alert variant="danger">{message}</Alert>}
          {children}
        </Container>
      </main>
    </div>
  );
}
