
import { toast } from "sonner";
import {  InferResponseType } from "hono";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.catigories[":id"]["$delete"]>



export const useDeleteCatigorie = (id?: string) => {

    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {

            const response = await client.api.catigories[":id"]["$delete"]({param : {id}}) 
            return await response.json()
        },
        onSuccess: () => {
            toast.success("Catigorie deleted")
            queryClient.invalidateQueries({ queryKey: ["catigories", {id}]})
            queryClient.invalidateQueries({ queryKey: ["catigories"]})
            queryClient.invalidateQueries({ queryKey: ["transactions"]})

        },
        onError: () => {
            toast.error("Failed to delete catigorie")
        },
    })

    return mutation;
}