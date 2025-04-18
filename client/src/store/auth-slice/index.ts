import { authState } from "@/types/types"
import {createSlice} from "@reduxjs/toolkit"

const initialState:authState = {
    isAuthenticated: false,
    isLoading: false,
    user: null
}



const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        setUser: (state,actions)=> {

        }}
    
})

export const {setUser} = authSlice.actions;
export default authSlice.reducer