import Head from "next/head";
import {
  Container,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";

import { useContext } from "react";
import { UserContext } from "../pages/_app";

export default function Layout({ children, home }) {
  const { user, updateUser } = useContext(UserContext);
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="土鳖奇迹" />
      </Head>
      <header>
        <Navbar variant="dark" bg="primary" expand="lg">
          <Container>
            <Navbar.Brand href="/">土鳖奇迹</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto" navbarScroll>
                <Nav.Link href="/account-page">账号管理</Nav.Link>
                <Nav.Link href="/user-rank-page">排行榜</Nav.Link>
                <Nav.Link href="#action2">游戏下载</Nav.Link>
              </Nav>
              {!user ? (
                <Nav>
                  <Nav.Link href="/login-page">登录</Nav.Link>
                  <Nav.Link href="/register-page">注册</Nav.Link>
                </Nav>
              ) : (
                <Nav>
                  <Nav.Link href="/">{user["memb___id"]}({user["jf"]})</Nav.Link>
                  <Nav.Link
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      localStorage.removeItem("user");
                      location.reload("/");
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
      <main>
        <Container className="mt-4">{children}</Container>
      </main>
    </div>
  );
}
