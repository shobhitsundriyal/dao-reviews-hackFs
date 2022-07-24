import { useEffect, useState } from 'react'
import Header from '../components/HomePage/Header'
import '../styles/globals.css'
import { UserContext } from '../Contexts/UserContext'
import { useRouter } from 'next/router'
import { checkMetamaskConnected } from '../functions/metamaskFunctions'

function MyApp({ Component, pageProps }) {
	const [userAddr, setUserAddr] = useState()
	const router = useRouter()

	useEffect(() => {
		async function getaccount() {
			let account = await checkMetamaskConnected()
			if (account) {
				setUserAddr(account)
			}
			// console.log(account)
		}
		getaccount()
	}, [])

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
