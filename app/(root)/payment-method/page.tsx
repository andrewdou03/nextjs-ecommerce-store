import { Metadata } from 'next'
import { auth } from '@/auth'
import { getUserByID } from '@/lib/actions/user.actions'
import PaymentMethodForm from './payment-method-form'

export const metadata: Metadata = {
	  title: 'Payment Method',
  description: 'Your payment method'
}

const paymentMethodPage = async () => {
	const session = await auth();
	const userId = session?.user?.id;
	if (!userId) {
		throw new Error('User not authenticated');
	}
	const user = await getUserByID(userId);

  return (
	<>
		<PaymentMethodForm
			preferredPaymentMethod={user.paymentMethod}
		/>
	</>
  )
}

export default paymentMethodPage