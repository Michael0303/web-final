import React from 'react'
import styled from 'styled-components'
import { Divider, Space, Tag } from 'antd'

const Wrapper = styled.div`
    height: 25vh;
    background-color: pink;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    h1 {
        margin: 0;
        margin-right: 20px;
        font-size: 3vw;
    }
`

export default function Title({ title, user }) {
    return (
        <Wrapper>
            <h1>{title}</h1>
            <Divider style={{ backgroundColor: "white" }} />
            {user ?
                <Space>
                    <Tag>{user.username}</Tag>
                    <Tag>{user.role}</Tag>
                    <Tag>{user.usage / 1000000} MB</Tag>
                </Space>
                : null}
        </Wrapper>
    )
}
