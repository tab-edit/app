import { Divider } from '@mui/material';
import React from 'react';
import { useAppDispatch } from '../state/hooks';
import { sidebarItemClicked } from '../state/slices/sidebarSlice';
import './sidebar.css';
import { sidebarItems } from './sidebar-items';

function Sidebar(props:{position:'left'|'right', className?:string}) {
    const dispatch = useAppDispatch();

    const sbItemsTopJSX:JSX.Element[] = [];
    const sbItemsBottomJSX:JSX.Element[] = [];
    let count = 0;
    for (const name in sidebarItems) {
        count++;
        const sidebarItem = sidebarItems[name];
        if (sidebarItem.position!==props.position) continue;

        (sidebarItem.align==='bottom' ? sbItemsBottomJSX : sbItemsTopJSX).push(
            <div className={`sidebar-item sb-item-${sidebarItem.position}`} key={count} onClick={() => dispatch(sidebarItemClicked(name))}>
                { sidebarItem.position==='right' ? name : tooltipWrapper(name, sidebarItem.icon) }
            </div>
        )
    }
    return (
        <div className={'sidebar ' + (props.className || '')}>
            <div className='sb-top'>{sbItemsTopJSX}</div>
            <Divider />
            <div className='sb-bottom'>{sbItemsBottomJSX}</div>
        </div>
    )
}

function tooltipWrapper(text:string, node: any) {
    return (
        <div className="tooltip">
            {node}
            <span className="tooltiptext"></span>
        </div>
    )
}

export default Sidebar;