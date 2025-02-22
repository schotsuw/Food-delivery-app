
import './App.css'
import Button from '@mui/material/Button'
import Header from './components/Header'
import OrderList from './components/OrderList'
import OrderDetails from './components/OrderDetails'
import Map from './components/Map'
function App() {


  return (
    <>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <title>Delivery App</title>
      <Header/>
      <OrderList/>
      <OrderDetails orderId={1}/>
      <Map/>
    </>
  )
}

export default App
