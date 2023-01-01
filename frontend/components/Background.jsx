import styled from "styled-components"

const BackgroundWrapper = styled.div`
    height: 75vh;
    background-color: pink;
    display:flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
`

export default function Background(props) {
    return (
        <BackgroundWrapper {...props} />
    )
}
