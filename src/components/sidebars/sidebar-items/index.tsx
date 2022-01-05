import { GitHub, StickyNote2 } from "@mui/icons-material"
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
    "Github3": {
        position: 'left',
        align: 'bottom',
        icon: <GitHub />,
        effect: () => {

        }
    }
}