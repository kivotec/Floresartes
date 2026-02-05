import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_flowers (
          quantity,
          unit_price,
          flower:flowers (id, name)
        ),
        order_colors (
          color:colors (id, name, hex_code)
        ),
        order_complements (
          complement:complements (id, name, price)
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Map to frontend format
    const mappedOrders = data.map((order: any) => ({
      id: order.id,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      totalPrice: order.total_price,
      status: order.status,
      notes: order.notes,
      selectedSizeId: order.selected_size_id,
      createdAt: order.created_at,
      flowers: order.order_flowers?.map((of: any) => ({
        flowerId: of.flower?.id,
        flowerName: of.flower?.name,
        quantity: of.quantity,
        unitPrice: of.unit_price,
      })) || [],
      colors: order.order_colors?.map((oc: any) => ({
        colorId: oc.color?.id,
        colorName: oc.color?.name,
        hexCode: oc.color?.hex_code,
      })) || [],
      complements: order.order_complements?.map((ocp: any) => ({
        complementId: ocp.complement?.id,
        complementName: ocp.complement?.name,
        price: ocp.complement?.price,
      })) || [],
    }))

    return NextResponse.json(mappedOrders, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: body.customerName,
        customer_phone: body.customerPhone,
        total_price: body.totalPrice,
        status: "pending",
        notes: body.notes || null,
        selected_size_id: body.selectedSizeId || null,
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 })
    }

    // Insert flowers
    if (body.flowers?.length > 0) {
      const flowerInserts = body.flowers.map((f: any) => ({
        order_id: order.id,
        flower_id: f.flowerId,
        quantity: f.quantity,
        unit_price: f.unitPrice,
      }))
      await supabase.from("order_flowers").insert(flowerInserts)
    }

    // Insert colors
    if (body.colors?.length > 0) {
      const colorInserts = body.colors.map((c: any) => ({
        order_id: order.id,
        color_id: c.colorId,
      }))
      await supabase.from("order_colors").insert(colorInserts)
    }

    // Insert complements
    if (body.complements?.length > 0) {
      const complementInserts = body.complements.map((cp: any) => ({
        order_id: order.id,
        complement_id: cp.complementId,
      }))
      await supabase.from("order_complements").insert(complementInserts)
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("orders")
      .update({ status: body.status })
      .eq("id", body.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
