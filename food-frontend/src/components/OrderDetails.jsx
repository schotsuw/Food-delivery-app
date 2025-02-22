import React from 'react'

const OrderDetails = () => {
    //data
    const order = {
        id: 1,
        customer: 'John Doe',
        items: ['Burger', 'Fries'],
        total: 19.99,
      };
  return (
    <div>
        <h2>Order Details</h2>
        <p>Customer: {order.customer}</p>
        <p>Items: {order.items.join(', ')}</p>
        <p>Total: ${order.total}</p>
    </div>
  )
}

export default OrderDetails