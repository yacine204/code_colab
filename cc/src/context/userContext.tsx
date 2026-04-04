import api from "../api/axios";
import type { User } from "../interfaces/user";
import { useState, useEffect, createContext, useContext} from "react";
import { userApi } from "../api/user";

const UserContext = createContext<User | null>(null)

export function UserProvider({children} : {children:React.ReactNode}){
    const [user, setUser] = useState<User|null>(null)

    useEffect(()=>{
        const token = localStorage.getItem("access")
        if(!token) return
        api.get(userApi.me).then(res=>setUser(res.data))
    },[])

    return <UserContext.Provider value = {user}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)

