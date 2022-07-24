import { useRouter } from 'next/router'
import React from 'react'

function Logo() {
	const router = useRouter()
	return (
		<div
			className='text-3xl text-white bg-black h-[3.5rem] w-[3.5rem] items-center flex justify-center font-dotted rounded-2xl border-2 border-blue-600 cursor-default rotate-45 tracking-tighter cursor-pointer'
			onClick={() => router.push('/')}
		>
			<span className=' -rotate-45'>DR</span>
		</div>
	)
}

export default Logo
