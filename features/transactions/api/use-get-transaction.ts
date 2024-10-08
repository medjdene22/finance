import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { convertAmountFromMili } from "@/lib/utils";

export const useGetTransaction = (id?: string) => {

    const query = useQuery({
        enabled: !!id,
        queryKey: ["transactions", {id}],
        queryFn: async () => {

            const response = await client.api.transactions[":id"].$get({
                param: {id},
            });
            if (!response.ok) {
                throw new Error("faild to fetch transaction");
            }
            const {data} = await response.json();
            data.amount= convertAmountFromMili(data.amount) 
            return data;
        }
    })
    return query;
}