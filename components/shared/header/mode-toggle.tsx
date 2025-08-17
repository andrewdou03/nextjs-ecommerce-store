'use client'
import { useState, useEffect } from 'react'
import { DropdownMenu, 
	DropdownMenuTrigger, 
	DropdownMenuLabel, 
	DropdownMenuSeparator, 
	DropdownMenuContent,
	DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu'
import { useTheme } from 'next-themes'
import {Button} from '@/components/ui/button'
import { SunIcon, MoonIcon, SunMoon } from 'lucide-react'

const ModeToggle = () => {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null // Prevents hydration mismatch
	}
  return (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button variant='ghost' className='focus-visible:ring-0 focus-visible:ring-offset-0 hover:cursor-pointer'>
				{theme === 'system' ? (<SunMoon/>) : theme === 'dark' ? (<MoonIcon />) : (<SunIcon />)}
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent>
			<DropdownMenuLabel>Appearance</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuCheckboxItem checked={theme === 'system'} onClick={
				() => setTheme('system')} className='cursor-pointer'>
				System
			</DropdownMenuCheckboxItem>
			<DropdownMenuCheckboxItem checked={theme === 'dark'} onClick={
				() => setTheme('dark')} className='cursor-pointer'>
				Dark
			</DropdownMenuCheckboxItem>
			<DropdownMenuCheckboxItem checked={theme === 'light'} onClick={
				() => setTheme('light')} className='cursor-pointer'>
				Light
			</DropdownMenuCheckboxItem>
			<DropdownMenuSeparator />

		</DropdownMenuContent>
	</DropdownMenu>
  )
}

export default ModeToggle