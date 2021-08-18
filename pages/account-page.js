import Button from "react-bootstrap/Button";
import Layout from "../components/Layout";
import {Form, Alert, Card} from "react-bootstrap";
import {useState, useContext, useEffect} from "react";
import {UserContext} from "./_app";
import {useRouter} from "next/router";
import axios from "axios";

export default function AccountPage() {
    const {user, updateUser} = useContext(UserContext);
    const router = useRouter();

    console.log(user);
    return (
        <Layout>
            <Card style={{width: '18rem'}}>
                <Card.Body>
                    <Card.Title>红绿灯的黄 (魔法师)</Card.Title>
                    <Card.Text>
                        <p>转生次数: </p>
                        <p>当前等级: </p>
                        <p>当前等级: </p>
                    </Card.Text>
                    <Card.Link href="#">转生</Card.Link>
                    <Card.Link href="#">洗点</Card.Link>
                </Card.Body>
            </Card>
        </Layout>
    );
}
