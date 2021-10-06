import Head from "next/head";
import {
  Alert,
  Container,
  Nav,
  Navbar,
  Toast,
  ToastContainer,
} from "react-bootstrap";

import { useContext, useState } from "react";
import { UserContext } from "../pages/_app";
import { useRouter } from "next/router";

import axios from "axios";

export default function Layout({ children, home }) {
  const { user, message, updateMessage } = useContext(UserContext);
  const router = useRouter();
  return (
    <div>
      <Head>
        <link rel="icon" href={"/favicons/favicon.ico"} />
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
                <Nav.Link href="/SocketPage">高级镶嵌</Nav.Link>
                <Nav.Link href="/RecyclePage">物品回收</Nav.Link>
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
                  <Nav.Link href="/MyAccountStatus">
                    {user["memb___id"]}({user["JF"]})
                  </Nav.Link>
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
          {message && (
            <ToastContainer
              className="p-3"
              position="top-end"
              style={{ zIndex: 9999 }}
            >
              <Toast
                onClose={() => {
                  updateMessage("");
                }}
                show={true}
                animation={false}
                delay={3000}
                autohide
              >
                <Toast.Header>
                  <strong className="me-auto">消息</strong>
                  <small>just now</small>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
              </Toast>
            </ToastContainer>
          )}
          {children}
        </Container>
      </main>
    </div>
  );
}
