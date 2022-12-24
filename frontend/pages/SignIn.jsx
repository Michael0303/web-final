import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import { Form, Button, Space, Input, Tooltip } from 'antd';
import { useState } from 'react';
import { useUser } from '../components/hooks/useUser';
import { useRouter } from 'next/router'
import styled from 'styled-components';
import bcrypt from 'bcryptjs'
import axios from '../components/api';
import Title from '../components/Title';


const PageWrapper = styled.div`
    height: 70vh;
    background-color: pink;
    display: flex;
    /* align-items: center; */
    justify-content: center;
`

const IconWrapper = styled.div`
    /* background-color: green; */
    display: flex;
    align-items: center;
    justify-content: center;
`

// const tailLayout = {
//     wrapperCol: {
//         offset: 8,
//         span: 16,
//     },
// };


export default function SignIn() {
    const { username, password, signedIn, status, setUsername, setPassword, setSignedIn, setStatus } = useUser()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (name, pwd) => {
        if (!name || !pwd) {
            console.log("please enter username and password!")
            setStatus({
                type: 'error',
                msg: 'please enter username and password!'
            })
        } else {
            setLoading(true)
            // let hashedPassword = bcrypt.hashSync(pwd)
            // call API -> POST /api/user/login 
            try {
                const { data: { status } } = await axios.post('/api/user/login', {
                    username: name,
                    password: pwd
                })
                console.log(status)
                console.log("go to mainpage")
                setStatus({
                    type: 'success',
                    msg: 'redirect to your homepage'
                })
                setSignedIn(true)
                router.push("/")
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

            <Title title={"Wellcome to NTU Cloud"} />
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
                    <Form.Item>
                        <IconWrapper>
                            <Space size='middle'>
                                <Button
                                    type="primary"
                                    loading={loading}
                                    onClick={() => handleLogin(username, password)}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => router.push("/SignUp")}
                                >
                                    Sign Up
                                </Button>
                            </Space>
                        </IconWrapper>
                    </Form.Item>
                </Form>

                {/* <Space direction="vertical">
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
                <Input.Password
                    placeholder="Enter your password"
                    prefix={<KeyOutlined />}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
                <IconWrapper>
                    <Space size='middle'>
                        <Button
                            type="primary"
                            loading={loading}
                            onClick={() => handleLogin(username, password)}
                        >
                            Sign In
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => router.push("/SignUp")}
                        >
                            Sign Up
                        </Button>
                    </Space>
                </IconWrapper>
            </Space> */}
            </PageWrapper>
        </>
    )
}
