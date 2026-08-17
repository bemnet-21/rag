'use client'
import { AuthGuardProps, User } from '@/interface'
import { RootState } from '@/store'
import { logout, setUser } from '@/store/slices/auth.slice'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'


const AuthGuard = ({ children, allowedRoles}: AuthGuardProps) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.authReducer)
    const dispatch = useDispatch()
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token")
            // if there is no token, logout and redirect to login
            if(!token){
                dispatch(logout())
                router.replace('/login')
                setIsChecking(false)
                return
            }
            try {

                let currentUser = user
                // if there is a token but no user in the store, decode the token and set the user in the store
                if(!isAuthenticated || !currentUser) {
                    const decodedUser = jwtDecode<User>(token)
                    const currentTime = Date.now() / 1000
                    if((decodedUser as any).exp < currentTime) {
                        dispatch(logout())
                        localStorage.clear()
                        setIsChecking(false)
                        router.replace('/login')
                        return
                    }
                    dispatch(setUser({user: decodedUser, token}))
                }

                // if there are allowed roles, check if the user's role is in the allowed roles
                if(allowedRoles && currentUser) {
                    const userRole = (currentUser.role || "").toLowerCase()
                    const hasAccess = allowedRoles.some(role => role.toLowerCase() === userRole)
                    if(!hasAccess) {
                        router.replace('/login')
                    }
                }

                setIsChecking(false)
            } catch(err) {
                console.error("Auth Guard Error", err)
                localStorage.clear()
                dispatch(logout())
                router.replace('/login')
            }
        }

        checkAuth()
    }, [isAuthenticated, user, allowedRoles, dispatch, router])

    if(isChecking){
        return (
            <div className="min-h-screen bg-parchment flex flex-col items-center justify-center gap-4">
                <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-brass gear-spin" stroke="currentColor" strokeWidth="1.25">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
                </svg>
                <p className="text-warmGray text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Verifying credentials...
                </p>
            </div>
        )
    }

    return <>{children}</>

}

export default AuthGuard