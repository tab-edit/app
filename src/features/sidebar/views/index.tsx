import { BugReport, GitHub, StickyNote2 } from "@mui/icons-material"
import DebugView from "./DebugView";
import SheetView from "./SheetView";

export type SidebarView = {
    name: string,
    icon: JSX.Element|string,
    align?: 'top' | 'bottom',
    view?: JSX.Element,
    effect?: () => void
}
export const leftSidebarViews:{[viewId:string]: SidebarView} = {
    "debug": {
        name: "Debug View",
        icon: <BugReport />,
        align: 'top',
        view: <DebugView />
    },
    "github": {
        name: "Github",
        icon: <GitHub />,
        align: 'bottom',
        effect: () => console.log('open github page')
    }
}

export const rightSidebarViews: {[name:string]: SidebarView} = {
    "sheet": {
        name: "Sheet View",
        icon: <StickyNote2 />,
        align: 'top',
        view: <SheetView />
    },
}