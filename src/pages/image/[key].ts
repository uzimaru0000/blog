import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request, locals }) => {
    const obj = await locals.runtime.env.BUCKET.get(`image/${params.key}`)
    if (!obj) {
        return new Response(null, { status: 404 })
    }

    const img = await obj.arrayBuffer()
    return new Response(img)
}