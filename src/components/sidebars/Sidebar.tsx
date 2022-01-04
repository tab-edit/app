import React from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setSidebarView, toggleSidebar } from '../../state/slices/sidebarSlice';
import { sidebarItems } from './sidebar-items';
import '../../styles/sidebar.css';

function Sidebar(props:{position:'left'|'right'}) {
    const dispatch = useAppDispatch();

    const sbItemsJSX = [];
    let count = 0;
    for (const name in sidebarItems) {
        const sidebarItem = sidebarItems[name];
        if (sidebarItem.position!==props.position) continue;
        count++;
        sbItemsJSX.push(
            <div className={`sidebar-item sb-${sidebarItem.position}`} key={count} onClick={() => {
                dispatch(toggleSidebar(sidebarItem.position));
                dispatch(setSidebarView({
                    position: sidebarItem.position, 
                    viewName: name
                }));
            }}>
                { sidebarItem.position=='right' ? name : sidebarItem.icon }
            </div>
        )
    }
    return (
        <div className='sidebar'>
            {sbItemsJSX}
        </div>
    )
}

export default Sidebar;