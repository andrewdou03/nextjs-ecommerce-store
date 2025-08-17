export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "NextStore";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_DESCRIPTION || "Modern ecommerce store built with Next.js, Tailwind CSS, and TypeScript.";
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT = Number(process.env.NEXT_LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
	email: "",
	password: "",
}

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
};

export const ShippingAddressDefaultValues = {
  fullName: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(",") : ["PayPal", "Stripe", "Cash on Delivery"];

export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || "PayPal";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 2;

export const PRODUCT_DEFAULT_VALUES = {
  name: "",
  slug: "",
  price: "0",
  images: [],
  category: "",
  brand: "",
  description: "",
  rating:"0",
  numReviews: "0",
  stock: 0,
  isFeatured: false,
  banner: null,
};

export const USER_ROLES = process.env.USER_ROLES ? process.env.USER_ROLES.split(",") : ["user", "admin"];

export const reviewFormDefaultValues = {
  title: "",
  rating: 0,
  comment: "",
};

export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev'