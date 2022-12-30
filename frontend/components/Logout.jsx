import Link from "next/link"
import axios from "./api"
import { useUser } from "./hooks/useUser"

export default function Logout() {
    const { setSignedIn } = useUser()

    const handleLogout = () => {
        setSignedIn(false)
        axios.post('/api/user/logout')
    }

    return (
        <Link href={"/signin"} onClick={() => handleLogout()}>Log out</Link>
    )
}
