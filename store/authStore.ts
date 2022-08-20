import create from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

import { BASE_URL } from '../utils';

// read `zustand` docs for more info on persist, and how to set up

// set - setter function provided by zustand

const authStore = (set:any) =>({
    
  userProfile: null,
  allUsers: [],
//    
  addUser: (user: any) => set({ userProfile: user }),
  removeUser: () => set({ userProfile: null }),

  fetchAllUsers: async () => {
    const { data } = await axios.get(`${BASE_URL}/api/users`);
    set({ allUsers: data });
  }

})

const useAuthStore = create(
    persist(authStore,{
        name:'auth'
    })
);

export default useAuthStore;