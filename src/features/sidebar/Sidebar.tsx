import { Divider } from "@mui/material";
import { SidebarView } from "./views";
import './Sidebar.css';

type SidebarStyle = 'icons' | 'text-left' | 'text-right';
type PropType = {
    views: {[viewId:string]:SidebarView},
    onClick: (viewId:string) => void,
    iconStyle: SidebarStyle,
    id?:string
    className?:string
}
function Sidebar(props:PropType) {
    return (
        <div id={props.id||''} className={'sidebar ' + (props.className || '')}>
            <div className="sb-top-section">
                {Object.keys(props.views).map((id) => props.views[id].align==='top' ? sidebarItemJSX(id, props.views[id], props.iconStyle, props.onClick) : false)}
            </div>
            <Divider />
            <div className="sb-bottom-section">
                {Object.keys(props.views).map((id) => props.views[id].align==='bottom' ? sidebarItemJSX(id, props.views[id], props.iconStyle, props.onClick) : false)}
            </div>
        </div>
    )
}

function sidebarItemJSX(viewId: string, view:SidebarView, iconStyle:SidebarStyle, onClick:(viewId:string)=>void) {
    return (
    <div 
        key={viewId}
        // TODO: fix tooltip later
        className={'sidebar-item ' + (iconStyle==='icons' ? '/tooltip': iconStyle==='text-left' ? 'vertical-text-lr' : 'vertical-text-rl')}
        data-tooltip={view.name}
        onClick={ () => {
            if (view.effect) view.effect();
            onClick(viewId)
        } }
    >
        {iconStyle==='icons' ? view.icon : view.name}
    </div>)
}

export default Sidebar;