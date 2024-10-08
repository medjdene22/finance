import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetCatigorie = (id?: string) => {

    const query = useQuery({
        enabled: !!id,
        queryKey: ["catigories", {id}],
        queryFn: async () => {

            const response = await client.api.catigories[":id"].$get({
                param: {id},
            });
            if (!response.ok) {
                throw new Error("faild to fetch catigorie");
            }
            const {data} = await response.json(); 
            return data;
        }
    })
    return query;
}