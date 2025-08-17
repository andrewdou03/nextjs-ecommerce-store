"use server";

import { shippingAddressSchema, signInSchema, signUpFormSchema, paymentMethodSchema, updateUserSchema } from "@/lib/validators";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hash } from '../encrypt'
import {prisma} from "@/db/prisma";
import { formatError } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "@/lib/constants";
import { getMyCart } from "@/lib/actions/cart.actions";
import { redirect } from "next/navigation";

export async function signInWithCredentials(
  _prev: unknown,
  formData: FormData
) {
  try {
    const data = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // If you want a redirect on success:
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: "/", // or wherever
    });

    return { success: true, message: "Sign in successful" };
  } catch (error) {
    // Auth.js throws redirect errors to perform navigation—rethrow those.
    if (isRedirectError(error)) throw error;

    return { success: false, message: "Sign in failed" };
  }
}

// Sign user out
export async function signOutUser() {
  // get current users cart and delete it so it does not persist to next user;
  const currentCart = await getMyCart();
  if (currentCart?.id) {
    await prisma.cart.delete({ where: { id: currentCart.id } });
  } else {
    console.warn("No cart found for deletion.");
  }
  await signOut({ redirect: false }); // don’t let next-auth redirect
  redirect("/"); // force a page refresh by redirecting
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  try{
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    })
    const plainPassword = user.password;
    user.password = await hash (user.password);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    })
    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });
    return { 
      success: true, 
      message: "Sign up successful" 
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false, 
      message: formatError(error)
    }
  }
}

export async function getUserByID(userId: string){
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    address: user.address,
    paymentMethod: user.paymentMethod,
  };
}

export async function updateUserAddress(data: ShippingAddress) {
  try{
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if(!currentUser) {
      throw new Error("User not authenticated");
    }
    const address = shippingAddressSchema.parse(data)
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {address},
    });

    return {
      success: true,
      message: "Address updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function updatePaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    const paymentMethod = paymentMethodSchema.parse(data);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });
    return {
      success: true,
      message: "Payment method updated successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

// Update the user profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error('User not found');

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all the users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a user
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update a user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}