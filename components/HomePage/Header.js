import React, { useContext, useEffect } from 'react'
import { UserContext } from '../../Contexts/UserContext'
import {
	checkMetamaskConnected,
	connectMetamask,
} from '../../functions/metamaskFunctions'
import Logo from './Logo'
import checkIcon from '../../assets/checkIcon.svg'
import listIcon from '../../assets/listIcon.svg'
import { useRouter } from 'next/router'
import Image from 'next/image'

function Header() {
	const { userAddr, setUserAddr } = useContext(UserContext)
	const router = useRouter()
	let isNotHomepage = router.pathname != '/'

	const connectWallet = async () => {
		const account = await connectMetamask()
		if (account) {
			setUserAddr(account)
		}
	}

	return (
		<div
			className={`${
				isNotHomepage && 'border-b-2 border-[#5A2FD7] '
			} px-2`}
		>
			<div className='headerContainer h-24 flex items-center max-w-7xl mx-auto'>
				<div className=' flex flex-grow'>
					<Logo />
				</div>
				{/** list between */}
				<div className='flex justify-center items-center space-x-8 mr-12'>
					<button
						className={`justify-center items-center space-x-2 py-2 px-3 flex rounded-full ${
							isNotHomepage &&
							'border-2 border-white hover:border-purple-600 transition-colors duration-150'
						}`}
					>
						<Image src={checkIcon} alt='' />
						<span
							className={`${
								isNotHomepage ? 'text-black' : 'text-white'
							} font-semibold`}
						>
							Add a review
						</span>
					</button>

					<button
						className={`justify-center items-center space-x-2 py-2 px-3 flex rounded-full ${
							isNotHomepage &&
							'border-2 border-white hover:border-purple-600 transition-colors duration-150'
						}`}
						onClick={() => router.push('AddDao')}
					>
						<Image src={listIcon} alt='' />
						<span
							className={`${
								isNotHomepage ? 'text-black' : 'text-white '
							} font-semibold`}
						>
							List your Dao
						</span>
					</button>
				</div>
				{userAddr === undefined ? (
					<button
						className={`btn font-mono my-auto ${
							isNotHomepage &&
							'border-2 border-black hover:bg-black hover:text-white transition-all duration-150'
						}`}
						onClick={connectWallet}
					>
						Connect Wallet{' '}
					</button>
				) : (
					<button
						className={`btn font-mono my-auto ${
							isNotHomepage &&
							'border-2 border-[#3913B8] hover:bg-[#3913B8] hover:text-white transition-all duration-150'
						}`}
						onClick={() => router.push('ExploreDaos')}
					>
						Explore Daos
					</button>
				)}
			</div>
		</div>
	)
}

export default Header
