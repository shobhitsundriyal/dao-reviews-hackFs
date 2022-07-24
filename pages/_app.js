import { useState } from 'react'
import Header from '../components/HomePage/Header'
import '../styles/globals.css'
import { UserContext } from '../Contexts/UserContext'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
	const [userAddr, setUserAddr] = useState()
	const router = useRouter()
	return (
		<>
			<UserContext.Provider value={{ userAddr, setUserAddr }}>
				{!(router.pathname == '/') && <Header />}
				<Component {...pageProps} />
			</UserContext.Provider>
		</>
	)
}

export default MyApp
