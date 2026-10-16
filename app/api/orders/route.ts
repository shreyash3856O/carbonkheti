import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = dataStore.getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { factoryId = "factory-default", companyName, batchId, tonsRequested } = body;

    if (!companyName || !batchId || !tonsRequested) {
      return NextResponse.json(
        { error: "Company name, batch ID, and tons requested are required" },
        { status: 400 }
      );
    }

    const orderResult = dataStore.createOrder({
      factoryId,
      companyName,
      batchId,
      tonsRequested: parseFloat(tonsRequested),
    });

    if ("error" in orderResult) {
      return NextResponse.json({ error: orderResult.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      order: orderResult,
      message: "Order placed. Draft invoice generated with 18% placeholder GST (pending legal review).",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
