import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("customization_categories")
      .select(`
        *,
        options:customization_options (*)
      `)
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Map to frontend format
    const mappedCategories = data.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      type: cat.type,
      allowMultiple: cat.allow_multiple,
      isRequired: cat.is_required,
      active: cat.is_active,
      order: cat.display_order,
      options: cat.options
        ?.filter((opt: any) => opt.is_active)
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((opt: any) => ({
          id: opt.id,
          name: opt.name,
          price: opt.price,
          hexCode: opt.hex_code,
          imageUrl: opt.image_url,
          active: opt.is_active,
          order: opt.display_order,
        })) || [],
    }))

    return NextResponse.json(mappedCategories, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("customization_categories")
      .insert({
        name: body.name,
        type: body.type,
        allow_multiple: body.allowMultiple || false,
        is_required: body.isRequired || false,
        is_active: true,
        display_order: body.order || 0,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("customization_categories")
      .update({
        name: body.name,
        type: body.type,
        allow_multiple: body.allowMultiple,
        is_required: body.isRequired,
        is_active: body.active,
        display_order: body.order,
      })
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

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("customization_categories")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
