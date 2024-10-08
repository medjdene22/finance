
import { create} from "zustand"

type OpenCatigorieState = {
    id?: string,
    isOpen: boolean,
    onOpen: (id: string) => void,
    onClose: () => void,
};


export const useOpenCatigorie = create<OpenCatigorieState>((set) => ({
    id: undefined,
    isOpen : false,
    onOpen : (id: string) => set({isOpen : true, id}),
    onClose : () => set({isOpen : false, id:undefined}),
}));

   
