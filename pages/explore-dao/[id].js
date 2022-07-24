import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import { contractAddress } from '../../config'
import contractJson from '../../artifacts/contracts/DaoReview.sol/DaoReview.json'

function Dao() {
	const ipfsUri = 'https://ipfs.io/ipfs/'
	const ipfsclient = create('https://ipfs.infura.io:5001/api/v0')
	const router = useRouter()
	const { id } = router.query

	return <div>{id}</div>
}

export default Dao
