
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.catigories[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.catigories[":id"]["$patch"]>["json"]



export const useEditCatigorie = (id?: string) => {

    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {

            const response = await client.api.catigories[":id"]["$patch"]({param : {id}, json}) 
            return await response.json()
        },
        onSuccess: () => {
            toast.success("Catigorie updated")
            queryClient.invalidateQueries({ queryKey: ["catigories", {id}]})
            queryClient.invalidateQueries({ queryKey: ["catigories"]})
            queryClient.invalidateQueries({ queryKey: ["transactions"]})

        },
        onError: () => {
            toast.error("Failed to edit catigorie")
        },
    })

    return mutation;
}