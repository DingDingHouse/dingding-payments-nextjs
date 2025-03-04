'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../lib/store'
import { setUser } from '@/lib/features/users/UsersSlice'

export default function StoreProvider({
    children,
    initialData
}: {
    children: React.ReactNode
    initialData: any
}) {
    const storeRef = useRef<AppStore>(undefined)
    if (!storeRef.current) {
        storeRef.current = makeStore()
        storeRef.current.dispatch(setUser(initialData))
    }

    return <Provider store={storeRef.current}>{children}</Provider>
}