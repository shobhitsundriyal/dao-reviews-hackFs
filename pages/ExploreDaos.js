import Head from 'next/head'
import { ethers } from 'ethers'
import { contractAddress } from '../config'
import contractJson from '../artifacts/contracts/DaoReview.sol/DaoReview.json'
import { useEffect, useState } from 'react'
import { create } from 'ipfs-http-client'

const ExploreDaos = ({ data }) => {
	const [createEvents, setCreateEvents] = useState()
	const [DaosMetaData, setDaosMetadata] = useState()
	const [logo, setLogo] = useState()

	const ipfsUri = 'https://ipfs.io/ipfs/'
	const ipfsclient = create('https://ipfs.infura.io:5001/api/v0')

	useEffect(() => {
		setCreateEvents(getData())
	}, [])

	async function getData() {
		// Fetch data from external API
		let provider
		if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
			provider = new ethers.providers.JsonRpcProvider()
		} else if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'testnet') {
			provider = new ethers.providers.JsonRpcProvider(
				'https://rpc-mumbai.matic.today'
			)
		} else {
			provider = new ethers.providers.JsonRpcProvider(
				'https://polygon-rpc.com/'
			)
		}
		const contract = new ethers.Contract(
			contractAddress,
			contractJson.abi,
			provider
		)
		const data = await contract.queryFilter('DAOCreated')
		console.log(data, 'humba')
		return data
	}
	return (
		<div>
			<Head>
				<title>Explore Daos</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='mainContainer pt-8'>
				<h1 className=' font-serif font-bold text-2xl'>Daos List</h1>
				<hr />
			</main>
		</div>
	)
}

// export async function getServerSideProps() {
// 	// Fetch data from external API
// 	let provider
// 	if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
// 		provider = new ethers.providers.JsonRpcProvider()
// 	} else if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'testnet') {
// 		provider = new ethers.providers.JsonRpcProvider(
// 			'https://rpc-mumbai.matic.today'
// 		)
// 	} else {
// 		provider = new ethers.providers.JsonRpcProvider(
// 			'https://polygon-rpc.com/'
// 		)
// 	}
// 	const contract = new ethers.Contract(
// 		contractAddress,
// 		contractJson.abi,
// 		provider
// 	)
// 	const data = await contract.queryFilter('DAOCreated')
// 	console.log(data.length, 'humba')
// 	// Pass data to the page via props
// 	return { props: { data } }
// }

export default ExploreDaos
