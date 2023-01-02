import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import axios from "../../components/api"

export default function Share() {
    const [load, setLoad] = useState(false)
    const [data, setData] = useState(undefined)
    const router = useRouter()
    const { sharedID } = router.query;
    useEffect(() => {
        if (sharedID) {
            setLoad(true)
        }
    })
    useEffect(() => {
        if (load) {
            const getLink = async () => {
                console.log(`try get link: ${sharedID}`)
                const { data: { link } } = await axios.get("/api/user/share", {
                    params: {
                        sharedID
                    }
                })
                setData(link)
            }
            getLink()
        }
    }, [load])
    return (
        <div>{data ? data.target : "loading..."}</div>
    )
}
