import { BugReport, GitHub, StickyNote2 } from "@mui/icons-material"
import DebugView from "./DebugView";
import SheetView from './SheetView'

type SidebarItem = {
    icon: JSX.Element,
    position: 'left' | 'right',
    align?: 'top' | 'bottom',
    view?: JSX.Element,
    effect?: () => void,
}
export const sidebarItems:{[name:string]: SidebarItem} = {
    "Sheet View": {
        position: 'right',
        icon: <StickyNote2 />,
        view: <SheetView />
    },
    "Debug View": {
        position: 'left',
        icon: <BugReport />,
        view: <DebugView />
    },
    "Github": {
        position: 'left',
        align: 'bottom',
        icon: <GitHub />,
        effect: () => {
            console.log("Github clicked!");
        }
    }
}