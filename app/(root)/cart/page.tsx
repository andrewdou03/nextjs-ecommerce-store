import CartTable from './cartTable';
import { getMyCart } from '@/lib/actions/cart.actions';

export const metadata = {
	  title: 'Cart',
  description: 'Your shopping cart'
}

const CartPage = async () => {
	const cart = await getMyCart();
  return (
	<>
		<CartTable cart={cart}/>
	</>
  )
}

export default CartPage