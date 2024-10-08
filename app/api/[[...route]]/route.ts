import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import accounts from './accounts'
import catigories from './catigories'
import transactions from './transactions'
import summary from "./summary"
export const runtime = 'edge'

const app = new Hono().basePath('/api')

const routes = app
    .route("/accounts", accounts)
    .route("/catigories", catigories)
    .route("/transactions", transactions)
    .route("/summary", summary)
    

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes;

