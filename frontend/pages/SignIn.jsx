import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Space, Input, Tooltip } from 'antd';
import { useState } from 'react';
import { useUser } from '../components/hooks/useUser';
import { useRouter } from 'next/router'
import styled from 'styled-components';

const TitleWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    h1 {
        margin: 0;
        margin-right: 20px;
        font-size: 3em;
    }
`

export default function SignIn() {
    const { username, password, signedIn, setUsername, setPassword, setSignedIn } = useUser()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = (name, pwd) => {
        if (!name || !pwd) {
            console.log("please enter username and password!")
        } else {
            setLoading(true)
            // call API
            console.log("go to mainpage")
            setSignedIn(true)
            router.push("/")
        }
    }

    return (
        <div>
            <TitleWrapper>
                <h1>Wellcome to NTU cloud</h1>
            </TitleWrapper>

            <Space direction="vertical">
                <Input
                    placeholder="Enter your username"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    suffix={
                        <Tooltip title="Extra information">
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
                    placeholder="input password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
                <Button
                    type="primary"
                    loading={loading}
                    onClick={() => handleLogin(username, password)}
                >
                    Sign In
                </Button>
            </Space>
        </div>
    )
}
