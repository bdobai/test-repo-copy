import AuthStore from './AuthStore';
import NotificationsStore from './NotificationsStore'
import { createContext } from 'react';

export const AuthStoreContext = createContext(new AuthStore())
export const NotificationsStoreContext = createContext(new NotificationsStore())
