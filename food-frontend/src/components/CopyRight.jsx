
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
const CopyRight = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <Typography variant="body2" color="textSecondary">
        {'© '}
        {new Date().getFullYear()}
        {' '}
        <Link color="inherit" href="">
          FoodFetch
        </Link>
        {'. All rights reserved.'}
      </Typography>
    </div>
  )
}

export default CopyRight