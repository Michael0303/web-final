import { createContext, useContext, useState } from 'react'

const UserContext = createContext({
    username: "",
    password: "",
    signedIn: false,

    setUsername: () => { },
    setPassword: () => { },
    setSignedIn: () => { },
})

const UserProvider = (props) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [signedIn, setSignedIn] = useState(false)

    return (
        <UserContext.Provider
            value={{
                username,
                password,
                signedIn,
                setUsername,
                setPassword,
                setSignedIn
            }}
            {...props}
        />
    )
}

const useUser = () => {
    return useContext(UserContext)
}

export { UserProvider, useUser }
