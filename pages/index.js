import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/HomePage/Header'
import heroImage from '../assets/heroImage.png'
import { useContext, useEffect } from 'react'
import { UserContext } from '../Contexts/UserContext'
import {
	checkMetamaskConnected,
	connectMetamask,
} from '../functions/metamaskFunctions'
// import Image from 'next/image'

export default function Home() {
	const { userAddr, setUserAddr } = useContext(UserContext)

	return (
		<div className=''>
			<Head>
				<title>Dao Reviews</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className=' bg-gradient-to-r from-[#3913B8] to-[#8352FD] h-[90vh] rounded-b-2xl'>
				<Header />

				{/* hero area  */}
				<div className='flex mx-auto max-w-6xl px-2 justify-between items-center h-[80%] space-x-5'>
					{/* left side text  */}
					<div className=' space-y-12 text-white max-w-[47%] my-auto'>
						<div className=' text-6xl font-bold font-sans'>
							Review Daos
						</div>
						<div className=' text-2xl'>
							Help the community by giving a review about daos you
							are part of.
						</div>
						<button className='btn font-mono'>Review</button>
					</div>

					{/** right side image */}
					<div className='w-1/2 rounded-2xl overflow-hidden'>
						<div className='-mb-2'>
							<Image
								src={heroImage}
								className='scale-150'
								alt='hero-image'
							/>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
