import React from 'react'
import Logo from './Logo'

function Header() {
	return (
		<div className=' h-24 flex items-center max-w-7xl mx-auto'>
			<div className=' flex flex-grow'>
				<Logo />
			</div>
			<button className='btn font-mono my-auto'>Connect Wallet </button>
		</div>
	)
}

export default Header
