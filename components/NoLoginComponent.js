import Layout from "./Layout";
import { useContext, useEffect } from "react";
import { UserContext } from "../pages/_app";

export default function NoLoginComponent() {
  const { updateMessage } = useContext(UserContext);
  useEffect(() => {
    updateMessage("请先登录");
  });
  return <Layout />;
}
