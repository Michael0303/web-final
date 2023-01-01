import { useRouter } from "next/router"
import { Button } from "antd"

export default function DashBoard() {
    const router = useRouter()

    const handler = () => {
        router.push("/admin")
    }

    return (
        <Button onClick={() => handler()}>DashBoard</Button>
    )
}
