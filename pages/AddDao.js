import Head from 'next/head'
import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import { contractAddress } from '../config'
import contractJson from '../artifacts/contracts/DaoReview.sol/DaoReview.json'
import Image from 'next/image'
import { UserContext } from '../Contexts/UserContext'

const AddDao = () => {
	const ipfsUri = 'https://ipfs.io/ipfs/'
	const ipfsclient = create('https://ipfs.infura.io:5001/api/v0')
	const { userAddr } = useContext(UserContext)

	const [DaoMetadata, setDaoMetadata] = useState({
		daoName: '',
		description: '',
		url: '',
		gatingType: '',
		gatingAddr: '',
		logo: undefined,
	})
	const [image, setImage] = useState()

	async function saveFileToIpfs(data) {
		try {
			const added = await ipfsclient.add(JSON.stringify(data))
			return added.path
		} catch (err) {
			console.log('error: ', err)
		}
	}

	function isErc20Gated(val) {
		if (val == 'erc20') {
			return true
		} else if (val == 'erc721') {
			return false
		} else {
			return undefined
		}
	}

	async function handleLogoChange(e) {
		/* upload cover image to ipfs and save hash to state */
		const uploadedFile = e.target.files[0]
		if (!uploadedFile) return
		const added = await ipfsclient.add(uploadedFile)
		setDaoMetadata((state) => ({ ...state, logo: added.path }))
		setImage(URL.createObjectURL(uploadedFile))
		console.log(added.path, 'Logo on ipfs')
	}

	async function handleSubmit(e) {
		e.preventDefault()
		// dao hash
		const hash = await saveFileToIpfs(DaoMetadata)
		console.log(hash)
		if (typeof window.ethereum !== 'undefined') {
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner()
			const contract = new ethers.Contract(
				contractAddress,
				contractJson.abi,
				signer
			)
			try {
				const Txn = await contract.registerDao(
					userAddr,
					[userAddr],
					DaoMetadata.gatingAddr,
					isErc20Gated(DaoMetadata.gatingType),
					hash
				)
				/* optional - wait for transaction to be confirmed before rerouting */
				await provider.waitForTransaction(Txn.hash)
				console.log('Txn: ', Txn)
			} catch (err) {
				console.log('Error: ', err)
			}
		}
	}

	return (
		<div>
			<Head>
				<title>List your Dao</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='mainContainer py-8'>
				<h1 className=' font-serif font-bold text-2xl'>
					List your Dao
				</h1>
				<hr />
				<form
					className='flex flex-col space-y-6 pt-12'
					onSubmit={(e) => handleSubmit(e)}
				>
					{image && (
						<img
							src={image}
							alt={'upload Logo'}
							height={120}
							width={120}
						/>
					)}
					<input
						type='file'
						name='myImage'
						accept='image/png, image/gif, image/jpeg'
						className='input'
						placeholder='Dao Logo'
						onChange={
							(e) => handleLogoChange(e)
							// setDaoMetadata({
							// 	...DaoMetadata,
							// 	logo: e.target.files[0],
							// })
							// console.log(e.target.files[0])
						}
					/>

					<input
						type='text'
						placeholder="Dao's Name"
						className='input'
						required
						onChange={(e) =>
							setDaoMetadata({
								...DaoMetadata,
								daoName: e.target.value,
							})
						}
					/>
					<textarea
						placeholder='Description'
						className='inputArea'
						rows='5'
						required
						onChange={(e) =>
							setDaoMetadata({
								...DaoMetadata,
								description: e.target.value,
							})
						}
					/>
					<input
						type='text'
						placeholder="Dao's url"
						className='input'
						required
						onChange={(e) =>
							setDaoMetadata({
								...DaoMetadata,
								url: e.target.value,
							})
						}
					/>

					<select
						className='input'
						onChange={(e) =>
							setDaoMetadata({
								...DaoMetadata,
								gatingType: e.target.value,
							})
						}
					>
						<option value='' selected disabled hidden>
							Select Gating Token Type
						</option>
						<option value='erc20'>Erc 20</option>
						<option value='erc721'>NFTs (ERC-721)</option>
					</select>

					<input
						type='text'
						placeholder='Gating token address'
						className='input'
						required
						onChange={(e) =>
							setDaoMetadata({
								...DaoMetadata,
								gatingAddr: e.target.value,
							})
						}
					/>

					<input
						type='submit'
						className='btn border-2 border-black mr-auto outline-purple-700'
					/>
				</form>
			</main>
		</div>
	)
}

export default AddDao
