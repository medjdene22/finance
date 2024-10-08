
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.catigories.$post>
type RequestType = InferRequestType<typeof client.api.catigories.$post>["json"]



export const useCreateCatigorie = () => {

    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {

            const response = await client.api.catigories.$post({json}) 
            return await response.json()
        },
        onSuccess: () => {
            toast.success("Catigorie created")
            queryClient.invalidateQueries({ queryKey: ["catigories"]})
        },
        onError: () => {
            toast.error("Failed to create Catigorie")
        },
    })

    return mutation;
}