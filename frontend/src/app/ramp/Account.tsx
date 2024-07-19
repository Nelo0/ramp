import MainPanel from "@/components/MainPanel";
import NavBar, { NavBarRoute } from "@/components/NavBar";

interface AccountProps {
    setRoute: (route: NavBarRoute) => void;
}

export default function Account({setRoute}: AccountProps) {
    return (
        <MainPanel>
            <NavBar selected={NavBarRoute.ACCOUNT} setRoute={setRoute}/>
        </MainPanel>
    )
}