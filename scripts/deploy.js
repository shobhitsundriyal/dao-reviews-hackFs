const hre = require('hardhat')
const fs = require('fs')

async function main() {
	const DaoReview = await hre.ethers.getContractFactory('DaoReview')
	const daoReview = await DaoReview.deploy()

	await daoReview.deployed()
	console.log('DaoReview deployed to:', daoReview.address)

	const Erc1 = await hre.ethers.getContractFactory('TestToken')
	const erc1 = await Erc1.deploy(
		20,
		'0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
	) //hardhat2 in metamask

	await erc1.deployed()
	console.log('erc1 deployed to:', erc1.address)

	fs.writeFileSync(
		'./config.js',
		`
  export const DRcontractAddress = "${daoReview.address}"
  export const ownerAddress = "${daoReview.signer.address}"
  export const erc1 = "${erc1.address}"
  `
	)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
