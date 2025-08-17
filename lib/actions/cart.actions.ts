'use server'

import { cookies } from 'next/headers'
import { convertToPlainObject, formatError, round2 } from '@/lib/utils'
import { CartItem } from "@/types"
import { auth } from '@/auth'
import { prisma } from '@/db/prisma'; // Import the Prisma Client instance from the db directory
import { cartItemSchema, insertCartSchema } from '@/lib/validators' // Import the cart item schema for validation
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client';


const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2), // string
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error("Product not found");

    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        productId: item.productId,
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // Add to database
      await prisma.cart.create({
        data: newCart,
      });

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // Check if item is already in cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );

      if (existItem) {
        // Check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }

        // Increase the quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existItem.qty + 1;
      } else {
        // If item does not exist in cart
        // Check stock
        if (product.stock < 1) throw new Error("Not enough stock");

        // Add item to the cart.items
        cart.items.push(item);
      }

      // Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (error) {
    console.log("Add to cart error: ", error);
    return {
      success: false,
      message: formatError(error),
    };
  }
}



export async function getMyCart() {
	const sessionCartId = (await cookies()).get("sessionCartId")?.value;
	if (!sessionCartId) {
		throw new Error("Session cart ID not found. Please try again.");
	}

	const session = await auth();
	const userId = session?.user?.id ? (session.user.id as string) : undefined;

	const cart = await prisma.cart.findFirst({
		where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
	})

	if (!cart) return undefined;

	return convertToPlainObject({
		...cart,
		items: cart.items as CartItem[],
		itemsPrice: cart.itemsPrice.toString(),
		totalPrice: cart.totalPrice.toString(),
		shippingPrice: cart.shippingPrice.toString(),
		taxPrice: cart.taxPrice.toString(),
		});
}

export async function removeItemFromCart(productId:string) {
	try {
		const sessionCartId = (await cookies()).get("sessionCartId")?.value;
		if (!sessionCartId) throw new Error ('Cart session not found')

		const product = await prisma.product.findFirst({
		where: { id: productId },})
		if (!product) throw new Error('Product not found')
		
		const cart = await getMyCart();
		if (!cart) throw new Error('Cart not found or empty');

		const exist = (cart.items as CartItem[]).find((x) => x.productId === productId)
		if (!exist) throw new Error('Item not found')

		let updatedItems2: CartItem[];
		if (exist.qty === 1) {
			updatedItems2 = (cart.items as CartItem[]).filter((x) => x.productId !== exist.productId)
		} else {
			updatedItems2 = (cart.items as CartItem[]).map((x) =>
        	x.productId === productId ? { ...x, qty: x.qty - 1 } : x
      	);
		}
		await prisma.cart.update({
		where: { id: cart.id },
		data: {
			items: updatedItems2, // ✅ now accessible
			...calcPrice(updatedItems2),
		},
    });
	revalidatePath(`/product/${product.slug}`);

	return {
		success: true,
		message: `${product.name} was removed from cart`
	}
	} catch (error) {
		return {success: false, message: formatError(error)};
	}
}