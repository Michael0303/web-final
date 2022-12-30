import axios from "../components/api"
import Title from "../components/Title"
import User from "../components/User"
import styled from "styled-components"
import { Button } from "antd"
import Link from "next/link"
import { useUser } from "../components/hooks/useUser"
import Function from "../components/Function"
import Logout from "../components/Logout"
import Background from "../components/Background"

const UsersBox = styled.div`
    height: 70vh;
    width: 90%;
    background-color: pink;
    display: flex;
    align-items: flex-start;
    justify-content: space-evenly;
`

export default function admin({ users }) {
    const { privileged } = useUser()

    const handleTest = async () => {
        try {
            let { data: { status } } = await axios.post("/api/user/usage_refresh")
            console.log(status)
        } catch (e) {
            const { data: { error } } = e.response
            console.log(error)
        }
    }

    return (
        <>
            {privileged ?
                <>
                    <Title title={"Administrater DashBoard"} />
                    <Background>
                        <Function>
                            <Button onClick={() => handleTest()} >Test</Button>
                            <Link href={"/"}>Home</Link>
                            <Logout />
                        </Function>
                        <UsersBox>
                            {users.map((user, index) => <User key={index + "-" + user.username} user={user} />)}
                        </UsersBox>
                    </Background>
                </>
                : <Title title={"You are not administrater!"} />
            }
        </>
    )
}

export async function getStaticProps() {
    const { data: { users, status } } = await axios.get("/api/user/all")
    console.log(users)
    console.log(status)
    return {
        props: {
            users
        }
    }
}