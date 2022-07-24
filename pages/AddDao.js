import Head from 'next/head'
import React from 'react'

const AddDao = () => {
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
					onSubmit={(e) => {
						e.preventDefault()
						console.log('bak')
					}}
				>
					<input
						type='text'
						placeholder="Dao's Name"
						className='input'
						required
					/>
					<textarea
						placeholder='Description'
						className='inputArea'
						rows='5'
						required
					/>
					<input
						type='text'
						placeholder="Dao's url"
						className='input'
						required
					/>

					<select className='input' id=''>
						<option value='' selected disabled hidden>
							Gating Token Type
						</option>
						<option value='erc20'>Erc 20</option>
						<option value='erc721'>NFTs (ERC-721)</option>
					</select>

					<input
						type='text'
						placeholder='Gatingtoken address'
						className='input'
						required
					/>

					<input
						type='submit'
						className='btn border-2 border-black mr-auto hover:border-purple-700'
					/>
				</form>
			</main>
		</div>
	)
}

export default AddDao
