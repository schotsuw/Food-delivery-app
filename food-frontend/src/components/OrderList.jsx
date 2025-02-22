import React from 'react'

const OrderList = () => {
    //data
    const orders = [
        { id: 1, customer: 'John Doe', items: ['Burger', 'Fries'], total: 19.99 },
        { id: 2, customer: 'Jane Smith', items: ['Pizza', 'Salad'], total: 24.99 },
        { id: 3, customer: 'Bob Johnson', items: ['Tacos', 'Soda'], total: 14.99 },
      ];
  return (
    <div>
        <h2>Order List</h2>
        <ul>
            {orders.map(order => (
                <li key={order.id}>
                    <p>Customer: {order.customer}</p>
                    <p>Items: {order.items.join(', ')}</p>
                    <p>Total: ${order.total}</p>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default OrderList