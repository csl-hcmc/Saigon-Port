import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { listenToMenuUI } from "../../../redux/actions";
import EditMenu from "./EditMenu";
import TogglesMenu2 from "./TogglesMenu/index_mapchartmenu";
import SaveMenu from "./SaveMenu";
import { Button, Typography, List, ListItem, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import NavigationIcon from "@material-ui/icons/Navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import settings from "../../../settings/settings.json";
import ChooseScenario from "./ChooseScenario";

const getAPICall = async (URL) => {
    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (err) {
        console.log(err);
    }
};
function MenuContainer(props) {
    const { tableName } = props;
    const menuState = useSelector((state) => state.MENU);
    const cityioData = useSelector((state) => state.CITYIO);

    const loadedModules = Object.keys(cityioData);
    const togglesMeta = settings.menu.toggles;

    const dispatch = useDispatch();

    const handleToggle = (value) => () => {
        const i = menuState.indexOf(value);
        const updatedMenuState = [...menuState];
        if (i === -1) {
            updatedMenuState.push(value);
        } else {
            updatedMenuState.splice(i, 1);
        }
        dispatch(listenToMenuUI(updatedMenuState));
    };

    let myMenuState = [...menuState];
    const [chosenScenario, setChosenScenario] = useState("hcm_scenario_0");
    let myChosenScenario = 'hcm_scenario_0';

    useEffect(() => {
        // listenChangingOption();
        // const timer = setTimeout(listenChangingOption, 1000);
        // return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // /* Listening View Option Change */
    async function listenChangingOption() {
        const options = await getAPICall(`${process.env.REACT_APP_EXPRESS_PUBLIC_URL}/get-option`);
        const scenarioObject = await getAPICall(`${process.env.REACT_APP_EXPRESS_PUBLIC_URL}/get-scenario`);
        if (options) {
            console.log(options);
            let table = options.table;
            let option = options.option;
            let mode = options.mode;
            if (table == tableName) {
                if (option) {
                    let requireModule = togglesMeta[option].requireModule;
                    if (loadedModules.includes(requireModule) || requireModule === false) {
                        const i = myMenuState.indexOf(option);
                        if (mode == "ON") {
                            if (i === -1) {
                                myMenuState.push(option);
                            }
                        }
                        else {
                            if (i !== -1) {
                                myMenuState.splice(i, 1);
                            }
                        }
                        dispatch(listenToMenuUI(myMenuState));
                    }
                }
            }
        }
        if (scenarioObject) {
            console.log(scenarioObject);
            let scenario = scenarioObject.scenario;
            if (scenario && scenario != myChosenScenario) {
                myChosenScenario = scenario;
                setChosenScenario(scenario);
            }
        }
        setTimeout(listenChangingOption, 1000);
    }

    /* END Listening */

    return (
        <>
            <List>
                <ListItem>
                    <Typography variant={"h1"}>View Options</Typography>
                </ListItem>
            </List>

            <TogglesMenu2 handleToggle={handleToggle} />
            {/* <ChooseScenario chosenScenario={chosenScenario} displayUI={true}/> */}
        </>
    );
}

export default MenuContainer;
