import { create } from "zustand";
import { persist } from 'zustand/middleware'

export const useStoreRoom = create(persist(
    () => ({
        stores: [],
        setStore: (payload) => set((state) => ({
            stores: [...state.stores, payload ]
        }))
    }),
    {name: "store"}
))