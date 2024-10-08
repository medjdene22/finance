
import { create} from "zustand"

type NewCatigorieState = {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
};


export const useNewCatigorie = create<NewCatigorieState>((set) => ({
    isOpen : false,
    onOpen : () => set({isOpen : true}),
    onClose : () => set({isOpen : false}),
}));

   
