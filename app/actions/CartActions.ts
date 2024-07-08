"use server";

import Product from "@/lib/database/models/ProductsModel";
import User from "@/lib/database/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import VariationOption from "@/lib/database/models/VariationOptionModel";
import Variation from "@/lib/database/models/VariationModel";

export async function addToCart(productId: string, variants?: string[]) {
  try {
    const session = await getServerSession(authOptions);
    console.log(session?.user.id);
    const user = await User.findById(session?.user.id);
    if (!user) throw new Error("User not found");
    user.cart.push({
      productId,
      variants,
    });
    console.log(productId, variants);
    console.log(user.cart);
    await user.save();
    console.log(user);
    return { success: "Product added to cart", status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

export async function removeFromCart(productId: string) {
  try {
    const session = await getServerSession(authOptions);
    const user = await User.findById(session?.user.id);
    if (!user) throw new Error("User not found");

    const productIndex = user.cart.findIndex((item: any) => item.productId.toString() === productId);
    console.log(productIndex);
    if (productIndex !== -1) {
      user.cart.splice(productIndex, 1);
      await user.save();
    }

    return { success: "Product removed from cart", status: 200 };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}

export async function clearCart(userId: string) {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    user.cart = [];
    await user.save();
    return { success: "Cart cleared", status: 200 };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}
export async function getCart() {
  try {
    const session = await getServerSession(authOptions);
    const user = await User.findById(session?.user.id)
      .populate({
        path: "cart.productId",
        model: Product,
        select: "name variations images price sale stock _id salePrice isOnSale",
        populate: {
          path: "variations",
          model: Variation,
          populate: {
            path: "variationOptions",
            model: VariationOption,
            populate: {
              path: "variationOption",
              model: "VariationOption",
            },
          },
        },
      })
      .lean();
    if (!user) throw new Error("User not found");
    //@ts-ignore
    return { success: "Cart fetched", status: 200, cart: user.cart };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}

export async function getProductByIdCart(id: string) {
  try {
    const product = await Product.findById(id).select("name images price sale stock _id salePrice isOnSale").lean();
    if (!product) return { error: "Product not found", status: 404 };
    return { success: "Product fetched", status: 200, product };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}
