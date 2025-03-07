'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/lib/features/users/UsersSlice';
import type { User } from '@/lib/features/users/UsersSlice';

export function UserProvider({ userData }: { userData: User }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (userData) {
            dispatch(setUser(userData));
        }
    }, [userData, dispatch]);

    return null;
}