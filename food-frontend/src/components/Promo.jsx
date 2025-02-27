import { LocationOn} from '@mui/icons-material';
import { Button } from '@mui/material';
const Promo = () => {
  return (
    <div className="bg-white py-2 px-4 flex justify-between items-center text-sm border-b">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">✨</span>
          <span>Get 5% Off your first order, <span className="text-red-500">Promo: ORDER5</span></span>
        </div>
        <div className="flex items-center gap-2">
          <LocationOn className="text-gray-600" />
          <span>Regent Street, E12 345, Fredericton</span>
          <Button color="primary" size="small">
            <span className='underline'>Change Location</span>
            </Button>
        </div>
      </div>
  )
}

export default Promo