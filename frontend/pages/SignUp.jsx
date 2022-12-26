import React, { useEffect, useState } from 'react'
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router'
import styled from 'styled-components';
// import PasswordChecklist from "react-password-checklist"
import dynamic from 'next/dynamic';
const PasswordChecklist = dynamic(() => import('react-password-checklist'), {
    ssr: false,
});
import { Form, Button, Space, Input, Tooltip } from 'antd';
import { useUser } from '../components/hooks/useUser';
import Title from '../components/Title';
import axios from '../components/api';
import Link from 'next/link';

const IconWrapper = styled.div`
    /* background-color: green; */
    display: flex;
    align-items: center;
    justify-content: center;
`
const ListWrapper = styled.div`
    li {
        /* background-color: purple; */
        display: flex;
        align-items: center;
    }
`
const PageWrapper = styled.div`
    height: 70vh;
    background-color: pink;
    display: flex;
    /* align-items: center; */
    justify-content: center;
`


export default function SignUp() {
    const { setStatus } = useUser()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordAgain, setPasswordAgain] = useState("")
    const [loading, setLoading] = useState(false)
    const [valid, setValid] = useState(false)
    const router = useRouter()


    const handleSignUp = async (name, pwd) => {
        if (!name || !pwd) {
            setStatus({
                type: 'error',
                msg: 'please enter username and password!'
            })
        } else {
            setLoading(true)
            // call API -> POST /api/user/signup
            try {
                const { data: { status } } = await axios.post('/api/user/signup', {
                    username: name,
                    password: pwd
                })
                console.log(status)
                console.log("go to login page")
                setStatus({
                    type: 'success',
                    msg: 'redirect to login page'
                })
                router.push("/signin")
            } catch (e) {
                console.log(e)
                const { data: { error } } = e.response
                setStatus({
                    type: 'error',
                    msg: error
                })
                setLoading(false)
            }

        }
    }


    return (
        <>
            <Title title={"Sign Up"} />
            <PageWrapper>
                <Form>
                    <Form.Item
                        name="username"
                        rules={[{
                            required: true,
                            message: "Please enter your username"
                        }]}
                    >
                        <Input
                            placeholder="Enter your username"
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            suffix={
                                <Tooltip title="Why don't you input your name right now!!">
                                    <InfoCircleOutlined
                                        style={{
                                            color: 'rgba(0,0,0,.45)',
                                        }}
                                    />
                                </Tooltip>
                            }
                            onChange={(e) => {
                                setUsername(e.target.value)
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{
                            required: true,
                            message: "Please enter your password"
                        }]}
                    >
                        <Input.Password
                            placeholder="Enter your password"
                            prefix={<KeyOutlined />}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="passwordAgain"
                        rules={[{
                            required: true,
                            message: "Please enter your password again"
                        }]}
                    >
                        <Input.Password
                            placeholder="Enter your password again"
                            prefix={<KeyOutlined />}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            onChange={(e) => {
                                setPasswordAgain(e.target.value)
                            }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <ListWrapper>
                            <PasswordChecklist
                                rules={["minLength", "specialChar", "number", "capital", "match"]}
                                minLength={5}
                                value={password}
                                valueAgain={passwordAgain}
                                onChange={(isValid) => {
                                    if (isValid) { setValid(true) } else { setValid(false) }
                                }}
                                style={{ fontSize: "1.5vw" }}
                            />
                        </ListWrapper>
                    </Form.Item>
                    <Form.Item>
                        <IconWrapper>
                            <Button
                                type="primary"
                                loading={loading}
                                onClick={() => handleSignUp(username, password)}
                                disabled={!valid}
                            >
                                Submit
                            </Button>
                        </IconWrapper>
                    </Form.Item>
                    <p>Already signed up? <Link href={"/signin"} style={{ color: "blue" }}>Sign in</Link></p>
                </Form>
            </PageWrapper>
        </>
    )
}
