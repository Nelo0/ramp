import MainPanel from "@/components/MainPanel/MainPanel";
import PanelSelect, { PanelRoute } from "@/components/MainPanel/PanelSelect";

interface AccountProps {
    setRoute: (route: PanelRoute) => void;
}

export default function Account({setRoute}: AccountProps) {
    return (
        <MainPanel>
            <PanelSelect selected={PanelRoute.ACCOUNT} setRoute={setRoute}/>
        </MainPanel>
    )
}