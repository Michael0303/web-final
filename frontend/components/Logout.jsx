import { useRouter } from "next/router"
import axios from "./api"
import { useUser } from "./hooks/useUser"
import { Button } from "antd"

export default function Logout() {
    const { setSignedIn } = useUser()
    const router = useRouter()

    const handleLogout = () => {
        setSignedIn(false)
        axios.post('/api/user/logout')
        router.replace("/")
    }

    return (
        <Button onClick={() => handleLogout()}>Log out</Button>
    )
}
