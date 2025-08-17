'use client';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { toast } from 'sonner';
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import {useTransition} from "react";

import { Cart, CartItem } from '@/types'

const AddToCart = ({cart, item}: { cart?: Cart; item: CartItem }) => {
	const router = useRouter();

  const [isPending, startTransition] = useTransition()

	const handleAddToCart = async() => {
		startTransition(async () => {
      const res = await addItemToCart(item);

		if (!res.success) {
			toast.error(res.message || 'Failed to add item to cart');
			return;
		}
		toast.success(
			`${item.name} added to cart successfully`,
			{
				description: `You can view your cart or continue shopping.`,
				action: {
					label: 'View Cart',
					onClick: () => router.push('/cart'),
				},
				classNames: {
					actionButton: 'bg-black text-white hover:cursor-pointer hover:bg-slate-800',
				}
			})
	  })
  }
	const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

  if (!res.success) {
    toast.error(res.message || 'Failed to remove item from cart');
    return;
  }

  toast.success(`${item.name} removed from cart`, {
    description: `You can view your cart or continue shopping.`,
    action: {
      label: 'View Cart',
      onClick: () => router.push('/cart'),
    },
    classNames: {
      actionButton: 'bg-black text-white hover:cursor-pointer hover:bg-slate-800',
    }
  });
    })
};
	
	const existItem = cart && cart.items.find((x) => x.productId === item.productId);
  return existItem ? (
    <div>
      <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
          {isPending ? (<Loader className="w-4 h-4 animate-spin"/>) : (<Minus className='w-4 h-4' />)}
      </Button>
      <span className='px-2'>{existItem.qty}</span>
      <Button type='button' variant='outline' onClick={handleAddToCart}>
          {isPending ? (<Loader className="w-4 h-4 animate-spin"/>) : (<Plus className='w-4 h-4' />)}
      </Button>
    </div>
  ) : (
    <Button className='w-full bg-black text-white cursor-pointer' type='button' onClick={handleAddToCart}>
        {isPending ? (<Loader className="w-4 h-4 animate-spin"/>) : (<Plus className='w-4 h-4' />)}{' '}Add to Cart
    </Button>
  );
}

export default AddToCart