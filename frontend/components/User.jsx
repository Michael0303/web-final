import styled from "styled-components"

const UserWrapper = styled.div`
    width: 15vw;
    height: 10vh;
    background-color: white;
    color: black;
    border-radius: 1vmin;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export default function User({ user }) {
    const { username, role, usage } = user
    return (
        <UserWrapper>
            <p>{username}</p>
            <p>{role}</p>
            <p>Usage: {usage / 1000000} MB</p>
        </UserWrapper>
    )
}
