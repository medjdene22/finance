import { z } from "zod"
import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema} from "drizzle-zod"


export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});
export const accountsRelations = relations(accounts, ({ many }) => ({
    transactions: many(transactions),
}));
export const insertAccountSchima = createInsertSchema(accounts);


export const catigories = pgTable("catigories", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});
export const catigoriesRelations = relations(catigories, ({ many }) => ({
    transactions: many(transactions),
}));
export const insertCatigorieSchima = createInsertSchema(catigories);


export const transactions = pgTable("transactions", {
    id: text("id").primaryKey(),
    amount: integer("amount").notNull(),
    payee: text("payee").notNull(),
    notes: text("notes"),
    date: timestamp("date", { mode: "date"}).notNull(),
    accountId: text("account_id").references(() => accounts.id, {
        onDelete: "cascade",
    }).notNull(),
    catigorieId: text("catigorie_id").references(() => catigories.id, {
        onDelete: "set null",
    }),
});
export const transactionsRelations = relations(transactions, ({ one }) => ({
    account: one(accounts, {
        fields: [transactions.accountId],
        references: [accounts.id]
    }),
    catigories: one(catigories, {
        fields: [transactions.catigorieId],
        references: [catigories.id]
    }),
}));
export const inserttransactionsSchima = createInsertSchema(transactions, {
    date: z.coerce.date(),
});
