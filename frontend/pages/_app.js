import { UserProvider } from '../components/hooks/useUser'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    )
}
