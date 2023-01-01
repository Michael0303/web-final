import styled from "styled-components"
import { Layout, Space } from "antd"
const { Sider } = Layout

const FunctionWrapper = styled(Sider)`
    height: 30vh;
    /* width: 10%; */
    /* background-color: aliceblue; */
    display: flex;
    flex-direction: column;
    align-items: center;
    /* & > button {
        background-color: green;
        height: 7vh;
        width: 10vw;
        margin:0px;
        border: 0.1vmin solid white;
        box-shadow: inset 0px 0px 0px 0.2vmin white;
    } */
    /* & > a{
        height: 7vh;
        width: 10vw;
        margin:0px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: black;
        box-shadow: inset 0px 0px 0px 0.2vmin white;
    } */
`

export default function Function(props) {
    return (
        // <Sider {...props} />
        <FunctionWrapper width="auto">
            <Space.Compact direction="vertical" size="large" {...props} />
        </FunctionWrapper>
    )
}
