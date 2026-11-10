import { DEFAULT_WHATSAPP_NUMBER } from "@/lib/constants";
import { createOrderEnquiry } from "@/services/dataService";
import { OrderEnquiry } from "@/types";

export interface WhatsAppOrderPayload {
  userId: string;
  userName: string;
  userPhone?: string;
  mealId: string;
  mealName: string;
  kitchenId?: string;
  kitchenName?: string;
  quantity: number;
  pricePerMeal: number;
  preferredDate: string;
  mealType: "lunch" | "dinner";
  deliveryAddress: string;
  notes?: string;
}

/**
 * Builds the formatted pre-filled WhatsApp message matching the DGU Venture Quest MVP specification
 */
export function generateWhatsAppOrderMessage(payload: WhatsAppOrderPayload): string {
  const totalAmount = payload.pricePerMeal * payload.quantity;

  return (
    `🍱 *NEW MESSMATE MEAL ORDER*\n` +
    `_DBS Global University Pilot_\n` +
    `--------------------------------\n` +
    `👤 *Student Name:* ${payload.userName}\n` +
    `📞 *Phone:* ${payload.userPhone || "Provided on chat"}\n` +
    `🍛 *Meal:* ${payload.mealName}\n` +
    `👨‍🍳 *Kitchen:* ${payload.kitchenName || "Partner Rasoi"}\n` +
    `🔢 *Quantity:* ${payload.quantity}\n` +
    `💰 *Price:* ₹${payload.pricePerMeal} x ${payload.quantity} = *₹${totalAmount}*\n` +
    `📅 *Preferred Date:* ${payload.preferredDate}\n` +
    `⏰ *Meal Slot:* ${payload.mealType.toUpperCase()}\n` +
    `📍 *Delivery Address:* ${payload.deliveryAddress || "DBS PG Area / Room Pickup"}\n` +
    (payload.notes ? `📝 *Special Note:* ${payload.notes}\n` : "") +
    `--------------------------------\n` +
    `_Please confirm availability and dispatch window!_`
  );
}

/**
 * Saves order to Firestore/database first, then launches WhatsApp with configured business number
 */
export async function triggerWhatsAppOrder(
  payload: WhatsAppOrderPayload
): Promise<{ success: boolean; url?: string; error?: string; order?: OrderEnquiry }> {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;

  if (!whatsappNumber || whatsappNumber.trim().length < 8) {
    return {
      success: false,
      error: "WhatsApp business contact number is not yet configured. Please set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local",
    };
  }

  try {
    // 1. Store order enquiry in database
    const totalAmount = payload.pricePerMeal * payload.quantity;
    const savedOrder = await createOrderEnquiry({
      userId: payload.userId,
      userName: payload.userName,
      userPhone: payload.userPhone,
      mealId: payload.mealId,
      mealName: payload.mealName,
      kitchenId: payload.kitchenId,
      kitchenName: payload.kitchenName,
      quantity: payload.quantity,
      amount: totalAmount,
      preferredDate: payload.preferredDate,
      mealType: payload.mealType,
      deliveryAddress: payload.deliveryAddress,
      notes: payload.notes,
    });

    // 2. Generate WhatsApp Web / App intent URL
    const message = generateWhatsAppOrderMessage(payload);
    const cleanedNumber = whatsappNumber.replace(/[^0-9]/g, "");
    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanedNumber}?text=${encodedText}`;

    return {
      success: true,
      url: whatsappUrl,
      order: savedOrder,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to record order before launching WhatsApp";
    console.error("Order processing error:", err);
    return {
      success: false,
      error: errorMsg,
    };
  }
}

