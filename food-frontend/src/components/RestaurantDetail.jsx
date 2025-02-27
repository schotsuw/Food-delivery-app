import { 
  AppBar, 
  Toolbar, 
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  ShoppingCart, 
  LocationOn, 
  Person,
  Search,
  Receipt,
  DirectionsBike,
  WatchLater,
  Star
} from '@mui/icons-material';

export default function RestaurantDetail() {
  return (
    <div className="min-h-screen bg-white">
      {/* Promo Banner */}
      <div className="bg-white py-2 px-4 flex justify-between items-center text-sm border-b">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">✨</span>
          <span>Get 5% Off your first order, <span className="text-red-500">Promo: ORDER5</span></span>
        </div>
        <div className="flex items-center gap-2">
          <LocationOn className="text-gray-600" />
          <span>Regent Street, A4, A4201, London</span>
          <Button color="warning" size="small">Change Location</Button>
        </div>
      </div>

      {/* Navigation */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar className="justify-between">
          <div className="text-2xl font-bold">
            Order<span className="text-red-500">.uk</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {['Home', 'Special Offers', 'Restaurants', 'Track Order'].map((item) => (
              <Button
                key={item}
                variant={item === 'Restaurants' ? 'contained' : 'text'}
                className={item === 'Restaurants' ? '!bg-primary !text-white' : ''}
              >
                {item}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg">
              <ShoppingCart />
              <span>23 Items</span>
              <span className="border-l pl-2">GBP 79.89</span>
            </div>
            <Button
              variant="contained"
              className="!bg-gray-900 !text-white"
              startIcon={<Person />}
            >
              Login/Signup
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      {/* Restaurant Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10"></div>
        <div className="absolute inset-0">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GvEmZA49i4HuUaiRRsUiyiqUfbLlqH.png"
            alt="McDonald's background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 py-12">
          <p className="text-gray-600 mb-2">Im loving it!</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            McDonald East London
          </h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-navy text-white px-4 py-2 rounded-full flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Minimum Order: 12 GBP
            </div>
            <div className="bg-navy text-white px-4 py-2 rounded-full flex items-center gap-2">
              <DirectionsBike className="w-5 h-5" />
              Delivery in 20-25 Minutes
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Button
              variant="contained"
              className="!bg-primary !text-white"
              startIcon={<WatchLater />}
            >
              Open until 3:00 AM
            </Button>

            <div className="flex items-center gap-2">
              <div className="bg-white rounded-lg p-4 flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-2xl font-bold">3.4</span>
                  <Star className="text-yellow-400 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-500">1,360 reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            All Offers from McDonald East London
          </h2>
          <TextField
            placeholder="Search from menu..."
            variant="outlined"
            className="w-full max-w-md"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="text-gray-400" />
                </InputAdornment>
              ),
              className: "bg-white rounded-full",
            }}
          />
        </div>
        
        {/* Menu items would go here */}
      </div>
    </div>
  );
}