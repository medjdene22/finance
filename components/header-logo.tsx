import Image from "next/image"
import Link from "next/link"
import logo from '@/public/logo.svg'
export default function HeaderLogo() {
  return (
    <Link href='/'>
        <div className="items-center hidden lg:flex">
            <Image src={logo} width={28} height={28} alt={""}/>
            <p className="font-semibold text-white ml-3 text-2xl">finance</p>
        </div>
    </Link>
  )
}
