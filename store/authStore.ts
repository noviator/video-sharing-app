import create from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// read `zustand` docs for more info on persist, and how to set up

const authStore = (set:any) =>({
    
  userProfile: null,
  allUsers: [],
//    
  addUser: (user: any) => set({ userProfile: user }),
  removeUser: () => set({ userProfile: null }),

})

const useAuthStore = create(
    persist(authStore,{
        name:'auth'
    })
);

export default useAuthStore;