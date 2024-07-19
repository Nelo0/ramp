import MainPanel from "@/components/MainPanel/MainPanel";
import PanelSelect, { PanelRoute } from "@/components/MainPanel/PanelSelect";

interface OnRampProps {
    setRoute: (route: PanelRoute) => void;
}

export default function OnRamp({setRoute}: OnRampProps) {
    return (
        <MainPanel>
            <PanelSelect selected={PanelRoute.ON} setRoute={setRoute}/>
        </MainPanel>
    )
}