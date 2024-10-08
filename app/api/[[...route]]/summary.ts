import { Hono } from 'hono'
import { db } from '@/db/drizzle' 
import{ string, z } from "zod"
import { accounts, insertAccountSchima, transactions } from '@/db/schema'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { createId } from "@paralleldrive/cuid2"
import { zValidator } from "@hono/zod-validator"
import { and, inArray, eq, sql, sum, gte, lte } from 'drizzle-orm';
import { addDays, differenceInDays, parse, subDays } from 'date-fns';

const app = new Hono()
    .get("/", clerkMiddleware(),
        zValidator("query", z.object({
            from: z.string().optional(),
            to: z.string().optional(),
            accountId: z.string().optional(),
        })), async (c) => {

            const auth = getAuth(c);
            if (!auth?.userId) {
                return c.json({error: "Unauthorized"}, 401)
            }

            const { from, to, accountId } = c.req.valid("query")
            const defaultTo = new Date()
            const defaultFrom = subDays(defaultTo, 30)

            const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
            const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;
            const fixedEndDate = addDays(endDate, 1)

            const periodLenth = differenceInDays(endDate, startDate) + 1
            const lastPeriodStart = differenceInDays(startDate, periodLenth) + 1
            const lastPeriodend = differenceInDays(endDate, periodLenth) + 1

            async function fetchFinanceData( userId: string, start: Date, end: Date) {
                return await db
                .select({
                    income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                    expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                    remaining: sum(transactions.amount).mapWith(Number)
                })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        accountId? eq(transactions.accountId, accountId) : undefined,
                        eq(accounts.userId, userId),
                        gte(transactions.date, start),
                        lte(transactions.date, end),
                    )
                )            }

            const [currentPeriod] = await fetchFinanceData(auth?.userId, startDate, fixedEndDate)
            const [lastPeriod] = await fetchFinanceData(auth?.userId, startDate, fixedEndDate)


            

            return c.json({currentPeriod})
        })




 
export default app