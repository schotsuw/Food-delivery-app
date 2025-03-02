
import { Outlet } from 'react-router'
import CopyRight from '../components/CopyRight'
import Navbar from '../components/Navbar'
import Promo from '../components/Promo'
import Footer from '../components/Footer'

const MainLayout = () => {
    
  return (
    <div>
        <Promo/>
        <Navbar/>
        <Outlet/>
        <Footer/>
        <CopyRight/>
    </div>
  )
}

export default MainLayout