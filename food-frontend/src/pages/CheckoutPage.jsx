import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import {
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
} from "@mui/material"
import { CreditCard } from "@mui/icons-material"

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

const steps = ["Delivery Address", "Payment Method", "Review Order"]

const CheckoutPage = ({ cartItems, total }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postcode: "",
    phone: "",
    email: "",
    paymentMethod: "card",
  })

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    // Handle payment processing here
  }

  const DeliveryAddressForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          name="firstName"
          label="First Name"
          fullWidth
          value={formData.firstName}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          name="lastName"
          label="Last Name"
          fullWidth
          value={formData.lastName}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="address"
          label="Delivery Address"
          fullWidth
          value={formData.address}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField required name="city" label="City" fullWidth value={formData.city} onChange={handleInputChange} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          name="postcode"
          label="Postcode"
          fullWidth
          value={formData.postcode}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          name="phone"
          label="Phone Number"
          fullWidth
          value={formData.phone}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField required name="email" label="Email" fullWidth value={formData.email} onChange={handleInputChange} />
      </Grid>
    </Grid>
  )

  const PaymentMethodForm = () => (
    <RadioGroup name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
      <Paper variant="outlined" className="p-4 mb-4">
        <FormControlLabel
          value="card"
          control={<Radio />}
          label={
            <div className="flex items-center gap-2">
              <CreditCard />
              <div>
                <Typography variant="subtitle1">Credit/Debit Card</Typography>
                <Typography variant="body2" color="text.secondary">
                  Pay securely with your card
                </Typography>
              </div>
            </div>
          }
        />
      </Paper>
      <Elements stripe={stripePromise}>
        {formData.paymentMethod === "card" && (
          <div className="p-4 border rounded-lg mb-4">{/* Stripe Card Element will be rendered here */}</div>
        )}
      </Elements>
    </RadioGroup>
  )

  const OrderReview = () => (
    <div>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      {cartItems.map((item) => (
        <div key={item.name} className="flex justify-between py-2">
          <Typography>
            {item.quantity}x {item.name}
          </Typography>
          <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
        </div>
      ))}
      <Divider className="my-4" />
      <div className="flex justify-between">
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6">${total.toFixed(2)}</Typography>
      </div>
    </div>
  )

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <DeliveryAddressForm />
      case 1:
        return <PaymentMethodForm />
      case 2:
        return <OrderReview />
      default:
        return "Unknown step"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Paper className="p-6 max-w-4xl mx-auto">
        <Typography variant="h4" className="mb-6">
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} className="mb-8">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {getStepContent(activeStep)}

          <div className="flex justify-between mt-8">
            <Button onClick={handleBack} disabled={activeStep === 0}>
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            >
              {activeStep === steps.length - 1 ? "Place Order" : "Next"}
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  )
}

export default CheckoutPage

