import { createContext, useContext, useState, useEffect } from 'react'
import { message } from 'antd'
import axios from "../api"

const UserContext = createContext({
    username: "",
    password: "",
    signedIn: false,
    status: {},
    privileged: false,

    setUsername: () => { },
    setPassword: () => { },
    setSignedIn: () => { },
    setStatus: () => { },
    displayStatus: () => { },
})

const LOCALSTORAGE_KEY = 'save-user'

const UserProvider = (props) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [signedIn, setSignedIn] = useState(false)
    const [status, setStatus] = useState({})
    const [privileged, setPrivileged] = useState(false)
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

    useEffect(() => {
        const checkAdmin = async () => {
            let { data: { status } } = await axios.get("/api/user/admin")
            console.log("save username: " + username)
            if (status === "privileged") {
                setPrivileged(true)
            } else {
                setPrivileged(false)
            }
        }
        if (signedIn) {
            localStorage.setItem(LOCALSTORAGE_KEY, username)
            checkAdmin()
        }
    }, [username, signedIn])

    useEffect(() => {
        if (!signedIn) {
            const savedUser = localStorage.getItem(LOCALSTORAGE_KEY)
            if (savedUser) { setUsername(savedUser) }
        }
    }, [])

    return (
        <UserContext.Provider
            value={{
                username,
                password,
                signedIn,
                status,
                privileged,
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
