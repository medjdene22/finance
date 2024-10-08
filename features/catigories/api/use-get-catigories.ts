import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetCatigories = () => {

    const query = useQuery({
        queryKey: ["catigories"],
        queryFn: async () => {

            const response = await client.api.catigories.$get();
            if (!response.ok) {
                throw new Error("faild to fetch catigories");
            }
            const {data} = await response.json(); 
            return data;
        }
    })
    return query;
}