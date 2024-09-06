'use client';

import { Provider } from 'react-redux';
import { store } from './index';
import { persistStore } from 'redux-persist';
import { useEffect } from 'react';
import { setUser } from './authSlice';
import api from '@/api';

persistStore(store);

export default function ReduxProvider({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        const refreshUser = async () => {
            const response = await api.employees.me();

            if (response) {
                store.dispatch(setUser(response.data));
            } else {
                store.dispatch(setUser(null));
            }
        };

        refreshUser();
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
