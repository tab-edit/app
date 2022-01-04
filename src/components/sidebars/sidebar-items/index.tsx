import { StickyNote2 } from "@mui/icons-material"
import SheetView from './SheetView'

type SidebarItem = {
    icon: JSX.Element,
    position: 'left' | 'right',
    view: JSX.Element
}
export const sidebarItems:{[name:string]: SidebarItem} = {
    "Sheet View": {
        position: 'right',
        icon: <StickyNote2 />,
        view: () => <SheetView />
    },
    "Sheet View2": {
        position: 'left',
        icon: <StickyNote2 />,
        view: () => <SheetView />
    }
}