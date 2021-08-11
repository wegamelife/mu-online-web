import Head from "next/head";
import {
  Container,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import Button from "react-bootstrap/Button";

export default function Layout({ children, home }) {
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
                <Nav.Link href="#action1">账号管理</Nav.Link>
                <Nav.Link href="#action2">游戏下载</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link href="/login">登录</Nav.Link>
                <Nav.Link href="/register">注册</Nav.Link>
              </Nav>
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
