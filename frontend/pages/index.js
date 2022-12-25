import { Inter } from '@next/font/google'
import { ScoreCardProvider } from '../components/hooks/useScoreCard'
import App from '../components/Containers/App'
import { useUser } from '../components/hooks/useUser'
import Title from '../components/Title'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const { signedIn, setSignedIn } = useUser()
    const router = useRouter()

    // useEffect(() => {
    //     if (!signedIn) {
    //         router.push("/SignIn")
    //     }
    // }, [])
    if (!signedIn && process.browser) {
        router.push("/SignIn")
    }

    return (
        // <ScoreCardProvider>
        //     <App />
        // </ScoreCardProvider>
        <>
            {!signedIn ? <Title title={"Sign In First"} /> :
                <>
                    <Title title={"Hi I'm Homepage"} />
                    <Link href={"/SignIn"} onClick={() => setSignedIn(false)}>Log out</Link>
                </>
            }
        </>
    )
}

