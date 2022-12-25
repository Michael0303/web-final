import { Inter } from '@next/font/google'
import { ScoreCardProvider } from '../components/hooks/useScoreCard'
import App from '../components/Containers/App'
import { useUser } from '../components/hooks/useUser'
import Title from '../components/Title'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect } from 'react'
import axios from '../components/api';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const { username,signedIn, setSignedIn } = useUser()
    const router = useRouter()

    // useEffect(() => {
    //     if (!signedIn) {
    //         router.push("/SignIn")
    //     }
    // }, [])

    const getFile = async()=>{
        const stuff = await axios.post('/api/user/getPsps')
        console.log(stuff)
    }


    if (!signedIn && process.browser) {
        router.push("/SignIn")
    }

    return (
        <>
            {!signedIn ? <Title title={"Sign In First"} /> :
                <>
                    <Title title={"Hi I'm Homepage"} />
                    <button onClick={getFile}> testing</button>
                    <Link href={"/SignIn"} style={{border:"2px solid blue"}} onClick={() => setSignedIn(false)}>Log out</Link>
                </>
            }
        </>
    )
}

