import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    height: 30vh;
    background-color: pink;
    display: flex;
    align-items: center;
    justify-content: center;
    h1 {
        margin: 0;
        margin-right: 20px;
        font-size: 3vw;
    }
`

export default function Title({ title }) {
    return (
        <Wrapper>
            <h1>{title}</h1>
        </Wrapper>
    )
}
