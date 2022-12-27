import { useUser } from '../components/hooks/useUser'
import Title from '../components/Title'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from '../components/api';
import { useEffect } from 'react'


export default function Home() {
    const { signedIn, privileged, setSignedIn } = useUser()
    const router = useRouter()

    const getFile = async () => {
        const stuff = await axios.post('/api/user/getPsps')
        console.log(stuff)
    }

    const handleLogout = () => {
        setSignedIn(false)
        axios.post('/api/user/logout')
    }

    useEffect(() => {
        if (!signedIn) {
            router.push("/signin")
        }
    }, [signedIn])

    return (
        <>
            {!signedIn ? <Title title={"Sign In First"} /> :
                <>
                    <Title title={"Hi I'm Homepage"} />
                    <button onClick={getFile}> testing</button>
                    <Link href={"/signin"} style={{ border: "2px solid blue" }} onClick={() => handleLogout()}>Log out</Link>
                    {privileged ?
                        <>
                            <h1>You are administrater</h1> <br />
                            <Link href={"/admin"}>Administrater Dashboard</Link>
                        </>
                        : null}
                </>
            }
        </>
    )
}

