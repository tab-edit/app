import React from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setSidebarView, sidebarItemClicked, toggleSidebar } from '../../state/slices/sidebarSlice';
import { sidebarItems } from './sidebar-items';
import '../../styles/sidebar.css';
import { Divider } from '@mui/material';

function Sidebar(props:{position:'left'|'right'}) {
    const dispatch = useAppDispatch();

    const sbItemsTopJSX:JSX.Element[] = [];
    const sbItemsBottomJSX:JSX.Element[] = [];
    let count = 0;
    for (const name in sidebarItems) {
        count++;
        const sidebarItem = sidebarItems[name];
        if (sidebarItem.position!==props.position) continue;

        (sidebarItem.align=='bottom' ? sbItemsBottomJSX : sbItemsTopJSX).push(
            <div className={`sidebar-item sb-item-${sidebarItem.position}`} key={count} onClick={() => dispatch(sidebarItemClicked(name))}>
                { sidebarItem.position=='right' ? name : sidebarItem.icon }
            </div>
        )
    }
    return (
        <div className='sidebar'>
            <div className='sb-top'>{sbItemsTopJSX}</div>
            <Divider />
            <div className='sb-bottom'>{sbItemsBottomJSX}</div>
        </div>
    )
}

export default Sidebar;