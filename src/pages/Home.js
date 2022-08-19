//css
import "../pages_css/Home.css"
//images
import brasil_icon from "../images/brasil_icon.svg"
import spain_icon from "../images/spain_icon.svg"
import usa_icon from "../images/usa_icon.svg"
//hooks
import { useState, useRef, useEffect } from "react"
//libs
import PlacesAutocomplete from "react-places-autocomplete"
import { Link } from "react-router-dom";

const Home = () => {
    // states for language change
    const [selectedLanguage, setSelectedLanguage] = useState("pt_br");
    const [text, setText] = useState({
        cityNameText: "Digite o nome da cidade",
        headerText: "Como está o tempo hoje?",
        selectedLanguageText: "Idioma selecionado: Português"
    })

    //states for things about places autocomplet
    const [adress, setAdress] = useState("");
    const inputOfAdresses = useRef();

    //state for unit change
    const [unit, setUnit] = useState("metric")
    const [checked, setChecked] = useState(
        () => unit === "metric" ? true : false
    )

    // reset border-radius from input
    useEffect(() => {
        const resetBorderRadiusFromInput = () => {
            if (adress !== "") {
                inputOfAdresses.current.style.borderRadius = "10px 10px 0 0"
            }
            else {
                inputOfAdresses.current.style.borderRadius = "10px"
            }
        }
        resetBorderRadiusFromInput();
    }, [adress]);

    //check and uncheck button of metric change
    useEffect(() => {
        const controllUnitsChanges = () => {
            if (unit === "metric") {
                setChecked(true);
            }
            else {
                setChecked(false);
            }
        }
        controllUnitsChanges()
    }, [unit]);

    //controll page language
    const changePageLanguage = (lang) => {
        setSelectedLanguage(lang);
        switch (lang) {
            case "pt_br":
                setText({
                    cityNameText: "Digite o nome da cidade",
                    headerText: "Como está o tempo hoje?",
                    selectedLanguageText: "Idioma selecionado: Português"
                })
                break;
            case "en":
                setText({
                    cityNameText: "Enter the name of the city",
                    headerText: "How's the weather today?",
                    selectedLanguageText: "Selected language: English"
                })
                break;
            case "es":
                setText({
                    cityNameText: "Introduzca el nombre de la ciudad",
                    headerText: "¿Cómo está el clima hoy?",
                    selectedLanguageText: "Idioma seleccionado: Español"
                })
                break;
        }
    }

    return (
        <div className="Home">
            <div className="toogle-field">
                <p>°F</p>
                <input type="checkbox" checked={checked} className="toogle-unit" onChange={() => {
                    unit === "metric" ? setUnit("imperial") : setUnit("metric")
                }} />
                <p>°C</p>
            </div>
            <div className="Home-Input-Field">
                <form className="Home-Form">
                    <h1>{text.headerText}</h1>
                    <PlacesAutocomplete value={adress} onChange={setAdress}>
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <>
                                <input {...getInputProps({ placeholder: text.cityNameText })} ref={inputOfAdresses} />
                                {loading ? null : null}
                                <div className={"results-of-search-field"}>
                                    {suggestions.map((suggestion, i) => {
                                        const style = {
                                            opacity: suggestion.active ? "0.8" : "1",
                                            cursor: suggestion.active ? "pointer" : "normal",
                                            marginTop: "15px",
                                            marginBottom: "15px",
                                        }
                                        return (
                                            <div key={i} {...getSuggestionItemProps(suggestion, { style })}>
                                                <Link to={`/${JSON.stringify({
                                                    cityName: suggestion.description,
                                                    language: selectedLanguage,
                                                    unit: unit
                                                })
                                                    }`}>
                                                    <p>{suggestion.description}</p>
                                                </Link>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        )}
                    </PlacesAutocomplete>
                </form>
            </div>
            <div className="language-choice-field">
                <div className="languages-options">
                    <img src={brasil_icon} alt="brasil" onClick={() => changePageLanguage("pt_br")} />
                    <img src={usa_icon} alt="usa" onClick={() => changePageLanguage("en")} />
                    <img src={spain_icon} alt="spain" onClick={() => changePageLanguage("es")} />
                </div>
                <p>{text.selectedLanguageText}</p>
            </div>
        </div>
    )
}

export default Home;