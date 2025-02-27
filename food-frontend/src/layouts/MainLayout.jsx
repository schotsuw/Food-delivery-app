
import { Outlet } from 'react-router'
import CopyRight from '../components/CopyRight'
import Navbar from '../components/Navbar'
import Promo from '../components/Promo'

const MainLayout = () => {
  return (
    <div>
        <Promo/>
        <Navbar/>
        <Outlet/>
        <CopyRight/>
    </div>
  )
}

export default MainLayout