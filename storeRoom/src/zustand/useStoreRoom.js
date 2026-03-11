import { create } from "zustand";
import { persist } from 'zustand/middleware'

export const useStoreRoom = create(persist(
    (set) => ({
        stores: [],
        setStore: (payload) => set((state) => ({
            stores: [...state.stores, payload ]
        })),
        deleteStore: (id) => set((state)=>({
            stores: state.stores.filter((s) => s.id !== id)
        })),
        updateStore: (id, payload) => set((state) => ({
            stores: state.stores.map((item) =>{
               return item.id === id ? {...item, ...payload} : item
            })
        }))
    }),
    {name: "store"}
))