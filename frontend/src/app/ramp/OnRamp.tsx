import MainPanel from "@/components/MainPanel";
import NavBar, { NavBarRoute } from "@/components/NavBar";

interface OnRampProps {
    setRoute: (route: NavBarRoute) => void;
}

export default function OnRamp({setRoute}: OnRampProps) {
    return (
        <MainPanel>
            <NavBar selected={NavBarRoute.ON} setRoute={setRoute}/>
        </MainPanel>
    )
}