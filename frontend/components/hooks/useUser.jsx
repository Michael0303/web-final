import { createContext, useContext, useState, useEffect } from 'react'
import { message } from 'antd'

const UserContext = createContext({
    username: "",
    password: "",
    signedIn: false,
    status: {},

    setUsername: () => { },
    setPassword: () => { },
    setSignedIn: () => { },
    setStatus: () => { },
    displayStatus: () => { },
})

const UserProvider = (props) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [signedIn, setSignedIn] = useState(false)
    const [status, setStatus] = useState({})
    // const [messageApi, contextHolder] = message.useMessage()

    const displayStatus = (s) => {
        if (s.msg) {
            const { type, msg } = s
            const content = {
                content: msg,
                duration: 1
            }
            switch (type) {
                case 'success':
                    message.success(content)
                    break
                case 'error':
                    message.error(content)
                    break
                default:
                    message.error(content)
                    break
            }
        }
    }

    useEffect(() => {
        displayStatus(status)
    }, [status])

    return (
        <UserContext.Provider
            value={{
                username,
                password,
                signedIn,
                status,
                setUsername,
                setPassword,
                setSignedIn,
                setStatus,
                displayStatus
            }}
            {...props}
        />
    )
}

const useUser = () => {
    return useContext(UserContext)
}

export { UserProvider, useUser }
