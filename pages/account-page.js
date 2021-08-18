import Button from "react-bootstrap/Button";
import Layout from "../components/Layout";
import { Form, Alert } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "./_app";
import { useRouter } from "next/router";
import axios from "axios";

export default function AccountPage() {
  const { user, updateUser } = useContext(UserContext);
  const router = useRouter();

  console.log(user);
  return (
    <Layout>
      {user ? (
        <div>
          <h5 className="mb-3">账号管理</h5>
          <p>用户名: {user['memb__id']}</p>
          <p>积分: {user['jf']}</p>
          <p>modi_days: {user['modi_days']}</p>
        </div>
      ) : (
        <div>Login first</div>
      )}
    </Layout>
  );
}
