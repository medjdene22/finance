import { Hono } from 'hono'
import { db } from '@/db/drizzle' 
import{ string, z } from "zod"
import { catigories, insertAccountSchima } from '@/db/schema'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { createId } from "@paralleldrive/cuid2"
import { zValidator } from "@hono/zod-validator"
import { and, inArray, eq } from 'drizzle-orm';

const app = new Hono()
    .get("/", clerkMiddleware(), async (c) => {

        const auth = getAuth(c);

        if (!auth?.userId) {
            return c.json({error: "Unauthorized"}, 401)
        }    
        const data = await db
            .select({
                id: catigories.id,
                name: catigories.name,
            })
            .from(catigories)
            .where(eq(catigories.userId, auth.userId));

        return c.json({data})
    })

    .get("/:id", zValidator("param", z.object({
        id: string().optional(),
    })), clerkMiddleware(), async (c) => {

        const auth = getAuth(c);

        if (!auth?.userId) {
            return c.json({error: "Unauthorized"}, 401)
        }
        
        const { id } = c.req.valid("param")

        if (!id) {
            return c.json({error: "Bad request, messing id"}, 400)
        }
        const [ data ] = await db
            .select({
                id: catigories.id,
                name: catigories.name,
            })
            .from(catigories)
            .where(
                and(
                    eq(catigories.userId, auth.userId),
                    eq(catigories.id, id),
                ),
            );

        if (!data) {
            return c.json({error: "Not found,"}, 404)
        }    
        return c.json({data})
    })

    .post(
        "/",
        clerkMiddleware(),
        zValidator("json", insertAccountSchima.pick({
            name: true,
        })),

    async (c) => {

        const auth = getAuth(c);
        const values = c.req.valid("json")

        if (!auth?.userId) {
            return c.json({error: "Unauthorized"}, 401)
        }    
        const [data] = await db
            .insert(catigories).values({
                id: createId(),
                userId:auth.userId,
                ...values,
            }).returning();

        return c.json({data})
    })

    .post(
        "/bulk-delete",
        clerkMiddleware(),
        zValidator(
            "json",
            z.object({
                ids: z.array(z.string()),
            }),
        ),

    async (c) => {

        const auth = getAuth(c);
        const values = c.req.valid("json")

        if (!auth?.userId) {
            return c.json({error: "Unauthorized"}, 401)
        }    
        const data = await db
            .delete(catigories)
            .where(
                and(
                    eq(catigories.userId, auth.userId),
                    inArray(catigories.id, values.ids),
                )
            ).returning({
                id: catigories.id
            });


        return c.json({data})
    })

    .patch(
        "/:id",
        clerkMiddleware(),

        zValidator("param", z.object({
            id: string().optional(),
        })),
        zValidator("json", insertAccountSchima.pick({
            name: true,
        })),

        async (c) => {

            const auth = getAuth(c);
            if (!auth?.userId) {
                return c.json({error: "Unauthorized"}, 401)
            }    

            const values = c.req.valid("json")

            const { id } = c.req.valid("param")

            if (!id) {
                return c.json({error: "Bad request, messing id"}, 400)
            }

            const data  = await db
                .update(catigories)
                .set(values)
                .where(
                    and(
                        eq(catigories.id, id),
                        eq(catigories.userId, auth.userId),
                    ),
                ).returning();

   
            if (!data) {
                return c.json({error: "Not found,"}, 404)
            }    
            return c.json({data})
    })

    .delete(
        "/:id",
        clerkMiddleware(),

        zValidator("param", z.object({
            id: string().optional(),
        })),

        async (c) => {

            const auth = getAuth(c);
            if (!auth?.userId) {
                return c.json({error: "Unauthorized"}, 401)
            }    

            const { id } = c.req.valid("param")
            if (!id) {
                return c.json({error: "Bad request, messing id"}, 400)
            }

            const data  = await db
                .delete(catigories)
                .where(
                    and(
                        eq(catigories.userId, auth.userId),
                        eq(catigories.id, id),
                    )
                ).returning({
                    id: catigories.id
                });

   
            if (!data) {
                return c.json({error: "Not found,"}, 404)
            }    
            return c.json({data})
    })
    
        


 
export default app