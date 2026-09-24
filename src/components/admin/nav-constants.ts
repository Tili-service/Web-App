import {
  Home, Phone, CreditCard,
  LayoutDashboard, UserCircle, ShoppingBag, MonitorSmartphone,
} from 'lucide-react';

export const MAIN_LINKS = [
  { name: 'Mes Commerces', href: '/admin/shop', icon: Home },
];

export const BOTTOM_LINKS = [
  { name: 'Licences', href: '/admin/licenses', icon: CreditCard },
  { name: 'Support', href: 'tel:+330000000000', icon: Phone },
];

export const getShopSubLinks = (shopId: string) => [
  { name: 'Dashboard',         href: `/admin/shop/${shopId}/dashboard`, icon: LayoutDashboard },
  { name: 'Profils',           href: `/admin/shop/${shopId}/profils`,   icon: UserCircle },
  { name: 'Catalogue',         href: `/admin/shop/${shopId}/catalogue`, icon: ShoppingBag },
  { name: 'Configuration TPE', href: `/admin/shop/${shopId}/pos`,       icon: MonitorSmartphone },
];
