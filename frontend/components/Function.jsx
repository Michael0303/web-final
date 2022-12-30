import styled from "styled-components"

const FunctionWrapper = styled.span`
    height: 30vh;
    width: 10%;
    /* border: 2px solid blue; */
    display: flex;
    /* flex-wrap: wrap; */
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    & > Button{
        height: 7vh;
        width: 10vw;
        margin:0px;
        /* border: 0.1vmin solid white; */
        box-shadow: inset 0px 0px 0px 0.2vmin white;
    }
    & > a{
        height: 7vh;
        width: 10vw;
        margin:0px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: black;
        box-shadow: inset 0px 0px 0px 0.2vmin white;
    }
`

export default function Function(props) {
    return (
        <FunctionWrapper {...props} />
    )
}
