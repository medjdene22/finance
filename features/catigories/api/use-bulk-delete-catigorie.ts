
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.catigories["bulk-delete"]["$post"]>
type RequestType = InferRequestType<typeof client.api.catigories["bulk-delete"]["$post"]>["json"]



export const useBulkDeleteCatigories = () => {

    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {

            const response = await client.api.catigories["bulk-delete"].$post({json}) 
            return await response.json()
        },
        onSuccess: () => {
            toast.success("catigories deleted")
            queryClient.invalidateQueries({ queryKey: ["catigories"]})
            queryClient.invalidateQueries({ queryKey: ["transactions"]})

        },
        onError: () => {
            toast.error("Failed to delete catigories")
        },
    })

    return mutation;
}