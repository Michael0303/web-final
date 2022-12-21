import { Inter } from '@next/font/google'
import { ScoreCardProvider } from '../components/hooks/useScoreCard'
import App from '../components/Containers/App'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    return (
        <ScoreCardProvider>
            <App />
        </ScoreCardProvider>
    )
}
