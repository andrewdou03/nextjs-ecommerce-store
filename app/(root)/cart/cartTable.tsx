'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { ArrowRight, Plus, Minus, Loader } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Cart } from '@/types';

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is Empty <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link href={`/product/${item.slug}`} className="flex items-center">
                        <Image src={item.image} alt={item.name} width={50} height={50} />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>

                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await removeItemFromCart(item.productId);
                            if (!res.success) {
                              toast.error(res.message || 'Failed to remove item from cart');
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className="animate-spin h-4 w-4" />
                        ) : (
                          <Minus className="h-4 w-4" />
                        )}
                      </Button>

                      <span>{item.qty}</span>

                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await addItemToCart(item);
                            if (!res.success) {
                              toast.error(res.message || 'Failed to add item to cart');
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className="animate-spin h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>

                    <TableCell className="text-right">
                      {formatCurrency(item.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl">
                Subtotal ({cart.items.reduce((acc, item) => acc + item.qty, 0)} items):
                <span className="font-bold"> {formatCurrency(cart.itemsPrice)}</span>
              </div>

              <Button
                className="w-full cursor-pointer bg-black text-white"
                disabled={isPending}
                onClick={() =>
                  startTransition(() => {
                    router.push('/shipping-address');
                  })
                }
              >
                {isPending ? (
                  <Loader className="animate-spin h-4 w-4" />
                ) : (
                  'Proceed to Checkout'
                )}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
