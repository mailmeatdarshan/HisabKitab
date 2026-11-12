import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    X,
    TrendingUp,
    FileSpreadsheet,
    Users,
    CreditCard,
    PiggyBank,
    Settings2,
    LogOut
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return isMobile;
};

export const CustomSidebarIcon = ({ className = "" }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="6" y1="5" x2="6" y2="19" />
        <line x1="12" y1="5" x2="12" y2="19" />
        <path d="M18 5v14l3-2.5V7.5z" />
    </svg>
);

const SIDEBAR_ITEMS = [
    { name: 'Analytics', path: '/app', icon: TrendingUp },
    { name: 'Expenses', path: '/app/recordlist', icon: FileSpreadsheet },
    { name: 'Udhaar', path: '/app/debts', icon: Users },
    { name: 'Subscriptions', path: '/app/subscriptions', icon: CreditCard },
    { name: 'Gullak', path: '/app/gullak', icon: PiggyBank },
    { name: 'Settings', path: '/app/settings', icon: Settings2 },
];

const SidebarItem = React.memo(({ item, isActive, isHovered, setHoveredItem, navigate, isMobile, onClose, isDark }) => {
    const Icon = item.icon;
    const bg = isActive 
        ? (isDark ? '#2A2A2A' : '#F1F5F9') 
        : isHovered 
            ? (isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC') 
            : 'transparent';
    const color = isActive || isHovered 
        ? (isDark ? '#FFFFFF' : '#0F172A') 
        : (isDark ? '#8A8A8E' : '#64748B');

    return (
        <div style={{ padding: isMobile ? '8px 12px' : '0', display: 'flex', justifyContent: 'center' }}>
            <button 
                type="button"
                onClick={() => {
                    navigate(item.path);
                    if (isMobile && onClose) onClose();
                }} 
                onMouseEnter={() => setHoveredItem(item.name)}
                style={{ 
                    position: 'relative', 
                    width: isMobile ? '48px' : 'calc(100% - 32px)', 
                    height: isMobile ? '48px' : 'auto',
                    padding: isMobile ? '0' : '12px 20px', 
                    borderRadius: 12, 
                    display: 'flex',
                    justifyContent: isMobile ? 'center' : 'flex-start',
                    alignItems: 'center',
                    fontSize: 15, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease',
                    border: 'none', outline: 'none',
                    backgroundColor: bg, 
                    color: color,
                    margin: isMobile ? '0' : '2px 16px'
                }}
                className="group"
                title={item.name}
                aria-label={item.name}
            >
                {isActive && (
                    <motion.div
                        layoutId={isMobile ? "mobile-active-indicator" : "active-indicator"}
                        style={{ 
                            position: 'absolute', 
                            left: isMobile ? '50%' : 0, 
                            bottom: isMobile ? -6 : 0, 
                            top: isMobile ? 'auto' : 0,
                            transform: isMobile ? 'translateX(-50%)' : 'none',
                            width: isMobile ? 4 : 3, 
                            height: isMobile ? 4 : '100%',
                            borderRadius: isMobile ? '50%' : 0,
                            backgroundColor: '#00C58D', 
                            boxShadow: isMobile ? '0 0 8px #00C58D' : 'none',
                            zIndex: 10 
                        }}
                    />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 10 }}>
                    <Icon size={isMobile ? 22 : 18} className={`transition-transform duration-300 ${isActive || isHovered ? 'scale-110 text-[#00C58D]' : ''}`} />
                    {!isMobile && <span>{item.name}</span>}
                </div>
            </button>
        </div>
    );
});

export default function Sidebar({ isOpen, setIsOpen }) {
    const navigate = useNavigate();
    const location = useLocation();
    const sidebarRef = useRef(null);
    const isMobile = useIsMobile();
    const { theme } = useSettings();
    const isDark = theme === 'dark';

    // Map current path to item name
    const currentPath = location.pathname;
    let activeName = 'Analytics';
    if (currentPath === '/app/recordlist') activeName = 'Expenses';
    else if (currentPath === '/app/debts') activeName = 'Udhaar';
    else if (currentPath === '/app/subscriptions') activeName = 'Subscriptions';
    else if (currentPath === '/app/gullak') activeName = 'Gullak';
    else if (currentPath === '/app/settings') activeName = 'Settings';

    const [hoveredItem, setHoveredItem] = useState(activeName);

    useEffect(() => {
        setHoveredItem(activeName);
    }, [activeName]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
            if (isMobile) document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, isMobile, setIsOpen]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        if (setIsOpen) setIsOpen(false);
    };

    const sidebarWidth = isMobile ? 80 : 260;

    return (
        <>
            {/* Backdrop Overlay */}
            <div 
                onClick={() => setIsOpen(false)}
                style={{ 
                    position: 'fixed', 
                    inset: 0, 
                    zIndex: 40, 
                    backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(15,23,42,0.35)', 
                    backdropFilter: 'blur(3px)',
                    display: isOpen ? 'block' : 'none' 
                }}
            />

            {/* Sidebar Drawer Container (Exact Parkinson architecture) */}
            <div 
                ref={sidebarRef} 
                onMouseLeave={() => !isMobile && setIsOpen(false)} 
                style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    height: '100vh', 
                    width: sidebarWidth, 
                    backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', 
                    borderRight: isDark ? '1px solid #2C2C2E' : '1px solid #E2E8F0', 
                    zIndex: 50, 
                    padding: isMobile ? '24px 0' : 24, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: isMobile ? 'center' : 'stretch',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)', 
                    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)', 
                    boxShadow: isDark ? '4px 0 24px rgba(0,0,0,0.5)' : '4px 0 24px rgba(0,0,0,0.08)',
                    overflowY: 'auto'
                }}
            >
                {/* Header: ONLY LOGO (No name at all!) */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: isMobile ? 'center' : 'space-between', 
                    marginTop: 8, 
                    marginBottom: 32, 
                    width: '100%', 
                    padding: isMobile ? '0 12px' : 0 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img 
                            src="/expenses.png" 
                            alt="Logo" 
                            style={{ width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, objectFit: 'contain' }} 
                        />
                    </div>
                    {!isMobile && (
                        <button 
                            type="button"
                            onClick={() => setIsOpen(false)} 
                            style={{ padding: 8, color: isDark ? '#6B7280' : '#94A3B8', cursor: 'pointer', background: 'none', border: 'none', borderRadius: 8 }} 
                            className={isDark ? "hover:text-white transition-colors" : "hover:text-slate-900 transition-colors"}
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Sidebar Menu Items (Icons only on mobile) */}
                <div 
                    style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        flex: 1, 
                        position: 'relative', 
                        margin: isMobile ? '0' : '0 -24px', 
                        alignItems: isMobile ? 'center' : 'stretch', 
                        gap: isMobile ? 8 : 0 
                    }}
                    onMouseLeave={() => setHoveredItem(activeName)}
                >
                    {SIDEBAR_ITEMS.map((item) => (
                        <SidebarItem
                            key={item.name}
                            item={item}
                            isActive={activeName === item.name}
                            isHovered={hoveredItem === item.name}
                            setHoveredItem={setHoveredItem}
                            navigate={navigate}
                            isMobile={isMobile}
                            onClose={() => setIsOpen(false)}
                            isDark={isDark}
                        />
                    ))}

                    {/* Divider before Logout */}
                    <div style={{ padding: isMobile ? '0' : '0 24px', margin: '12px 0', width: isMobile ? '36px' : 'auto' }}>
                        <hr style={{ 
                            border: 'none', 
                            borderTop: isDark ? '2px solid rgba(255,255,255,0.08)' : '2px solid #E2E8F0', 
                            borderRadius: '4px' 
                        }} />
                    </div>

                    {/* Logout Icon */}
                    <div style={{ padding: isMobile ? '8px 12px' : '0', display: 'flex', justifyContent: 'center' }}>
                        <button
                            type="button"
                            onClick={handleLogout}
                            style={{
                                position: 'relative',
                                width: isMobile ? '48px' : 'calc(100% - 32px)',
                                height: isMobile ? '48px' : 'auto',
                                padding: isMobile ? '0' : '12px 20px',
                                borderRadius: 12,
                                display: 'flex',
                                justifyContent: isMobile ? 'center' : 'flex-start',
                                alignItems: 'center',
                                fontSize: 15, fontWeight: 500, cursor: 'pointer',
                                border: 'none', outline: 'none',
                                backgroundColor: 'transparent',
                                color: '#EF4444',
                                margin: isMobile ? '0' : '2px 16px',
                                transition: 'all 0.2s ease'
                            }}
                            className="hover:bg-red-500/10"
                            title="Log Out"
                            aria-label="Log Out"
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <LogOut size={isMobile ? 20 : 18} />
                                {!isMobile && <span>Log Out</span>}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
