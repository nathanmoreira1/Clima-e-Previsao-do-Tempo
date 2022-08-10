//css
import "../pages_css/CityPage.css"
//hooks
import {useParams, Link} from "react-router-dom";
import {useEffect, useState, useRef} from "react"
//components
import Loading from "../components/Loading"
//images
import goBackButton from "../images/goBackButton.svg"
import brasil_icon from "../images/brasil_icon.svg"
import spain_icon from "../images/spain_icon.svg"
import usa_icon from "../images/usa_icon.svg"
//libs
import moment from 'moment'
import 'moment/locale/pt-br';
import 'moment/locale/es'
const math = require("mathjs");

const CityPage = () => {
    // states for catch data
    const {localInformation} = useParams();
    const [cityInformations, setCityInformations] = useState(null);
    //state for loading and controll data render
    const [isLoading, setIsLoading] = useState(true);
    const [showMoreInformations, setShowMoreInformations] = useState(false);
    const [moreInformations, setMoreInformations] = useState(null);
    //states for language change 
    const [pageLanguage, setPageLanguage] = useState(JSON.parse(localInformation).language);
    const [text, setText] = useState({
        headerText: "Previsão para 5 dias",
        selectedLanguageText: "Idioma selecionado: Português",
        seeMoreText: "Ver a previsão para os próximos 5 dias",
        notFoundHeader: "Localidade não encontrada.",
        notFoundSubHeader: "Por favor, volte a página inicial e tente outra localização." 
    });
    //states for catch unit
    const [unit, setUnit] = useState(JSON.parse(localInformation).unit);
    const [checked, setChecked] = useState(
        () => unit === "metric" ? true : false
    );

    //catch the current climate of the city in openweather
    useEffect(() => {
        const takeActualData = async () => {
            const cityName = JSON.parse(localInformation).cityName;
            const lang = pageLanguage;
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=e19a41ce44154872f28c7deac0af1f12&units=${unit}&lang=${lang}`;
            const response = await fetch(url);
            const data = await response.json();
            if(data.cod === 200) {
                setCityInformations(
                    {
                        name: data.name,
                        climate: () => {
                            return data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1); ; 
                        },
                        temp: Math.round(data.main.temp),
                        temp_icon: data.weather[0].icon,
                        temp_max: Math.ceil(data.main.temp_max),
                        temp_min: Math.round(data.main.temp_min)
                    }
                );
            }         
            setIsLoading(false);
        }
        takeActualData()
    }, [localInformation, pageLanguage, unit])

    //translate the page 
    useEffect(() => {
        const TranslatePage = () => {
            if(pageLanguage === "pt_br") {
                setText({
                    headerText: "Previsão para 5 dias",
                    selectedLanguageText: "Idioma selecionado: Português",
                    seeMoreText: "Ver a previsão para os próximos 5 dias",
                    notFoundHeader: "Localidade não encontrada.",
                    notFoundSubHeader: "Por favor, volte a página inicial e tente outra localização."
                })
            }
            if(pageLanguage === "en") {
                setText({
                    headerText: "Forecast for 5 days",
                    selectedLanguageText: "Selected language: English",
                    seeMoreText: "See the forecast for the next 5 days",
                    notFoundHeader: "Location not found.",
                    notFoundSubHeader: "Please go back to the homepage and try another location."
                })
            }
            if(pageLanguage === "es") {
                setText({
                    headerText: "Pronóstico para 5 días",
                    selectedLanguageText: "Idioma seleccionado: Español",
                    seeMoreText: "Ver el pronóstico para los próximos 5 días",
                    notFoundHeader: "Ubicación no encontrada.",
                    notFoundSubHeader: "Vuelva a la página de inicio y pruebe con otra ubicación."
                })
            }
        };
        TranslatePage();
    }, [pageLanguage]);

    //catch the forecast information
    useEffect(() => {
        const takeFiveDaysData = async () => {
            const cityName = JSON.parse(localInformation).cityName;
            const lang = pageLanguage;
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(cityName)}&appid=e19a41ce44154872f28c7deac0af1f12&cnt=40&lang=${lang}&units=${unit}`
            const response = await fetch(url);
            const data = await response.json();
            structureData(data);
        }
        takeFiveDaysData();
    }, [localInformation, pageLanguage, unit]);
    
    //structure the information received by the five-day forecast
    const structureData = (data) => {
        const usableData = data.list.map((data_item) => {
            return {
                date: data_item.dt_txt.split(" ")[0],
                temp_max: data_item.main.temp_max,
                temp_min: data_item.main.temp_min,
                icon: data_item.weather[0].icon,
                description: data_item.weather[0].description
            };
        });
        const dataSeparedByDate = usableData.reduce((group, product) => {
            const { date } = product;
            group[date] = group[date] ?? [];
            group[date].push(product);
            return group;
        }, {});
        
        const nextFiveDaysData = Object.values(dataSeparedByDate).length === 5 ? Object.values(dataSeparedByDate) : Object.values(dataSeparedByDate).splice(1,Object.values(dataSeparedByDate).length);
        const finalData = nextFiveDaysData.map((dayArray) => {
            const date = dayArray.map(dayAnalisis => dayAnalisis.date)[0];
            const ArrayOfTemp_max = dayArray.map(dayAnalisis => dayAnalisis.temp_max);
            const ArrayOfTemp_min = dayArray.map(dayAnalisis => dayAnalisis.temp_min);
            const ArrayOfIcons = dayArray.map(dayAnalisis => dayAnalisis.icon);
            const ArrayOfDescriptions = dayArray.map(dayAnalisis => dayAnalisis.description);
            return(
                {
                    date,
                    temp_max: Math.ceil(Math.max(...ArrayOfTemp_max)),
                    temp_min: Math.round(Math.min(...ArrayOfTemp_min)),
                    icon: () => {
                        if(math.mode(ArrayOfIcons).length === 1 && math.mode(ArrayOfDescriptions).length === 1) {
                            return math.mode(ArrayOfIcons);
                        }
                        else {
                            return math.mode(ArrayOfIcons)[0];
                        }
                    },
                    description: () => {
                        if(math.mode(ArrayOfDescriptions).length === 1 && math.mode(ArrayOfIcons).length === 1) {
                            return math.mode(ArrayOfDescriptions);
                        }
                        else {
                            return math.mode(ArrayOfDescriptions)[0];
                        }
                    }
                }
            )
        });
        setMoreInformations(finalData);
    }

    //controll units changes  
    useEffect(() => {
        const controllUnitsChanges = () => {
            if(unit === "metric") {
                setChecked(true);
            }
            else {
                setChecked(false);
            }
        }
        controllUnitsChanges()
    }, [unit]);

    if(isLoading) {
        return (
            <div className="CityPage">
                <Loading />
            </div>
        )
    }

    return(
        <div className="CityPage">
            <Link className="goBack" to={"/"}>
                <img src={goBackButton} alt="voltar" />
            </Link>
            <div className="toogle-field">
                <p>°F</p>
                <input type="checkbox" checked={checked} className="toogle-unit" onChange={() => {
                    unit === "metric" ? setUnit("imperial") : setUnit("metric")
                }} />
                <p>°C</p>
            </div>
            {cityInformations !== null ? 
                (
                    <div className={showMoreInformations ? "city-informations margin-top-altered" : "city-informations"}>
                        <h1>{cityInformations.name}</h1>
                        {!showMoreInformations && 
                            <>
                                <p className="city-climate">{cityInformations.climate()}</p>
                                <div className="temperature-field">
                                    <h2>{cityInformations.temp}°</h2>
                                    <img src={`http://openweathermap.org/img/wn/${cityInformations.temp_icon}@2x.png`}/>
                                </div>
                                <div className="max-min-field">
                                    <div className="max-field">
                                        <p className="max-result">MAX:</p>
                                        <p>{cityInformations.temp_max}°</p>
                                    </div>
                                    <div className="min-field">
                                        <p className="min-result">MIN:</p>
                                        <p>{cityInformations.temp_min}°</p>
                                    </div>
                                </div>
                                <p onClick={() => setShowMoreInformations(true)} className="show-more">{text.seeMoreText}</p>
                            </>
                        }
                        {showMoreInformations && 
                            <div className="weather-forecast-field">
                                <p className="weather-header">{text.headerText}</p>
                                <div className="weather-forecast">
                                    {moreInformations.map((information, i) => (
                                        <div className="weather-item" key={i}>
                                            <p className="date">{moment(information.date).locale(pageLanguage).format('ddd, DD MMM')}</p>
                                            <img className="icon" src={`http://openweathermap.org/img/wn/${information.icon()}@2x.png`} />
                                            <p className="temp_min">{information.temp_min}°</p>
                                            <div className="border-decoration"></div>
                                            <p className="temp_max">{information.temp_max}°</p>
                                            <p className="description">{information.description()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>
                )
                :
                (
                    <div className="city-not-found">
                        <h1>{text.notFoundHeader}</h1>
                        <h2>{text.notFoundSubHeader}</h2>
                    </div>
                )
            }
            <div className="language-choice-field">
                <div className="languages-options">
                    <img src={brasil_icon} alt="brasil" onClick={() => setPageLanguage("pt_br")} />
                    <img src={usa_icon} alt="usa" onClick={() => setPageLanguage("en")} />
                    <img src={spain_icon} alt="spain" onClick={() => setPageLanguage("es")}/>
                </div>
                <p>{text.selectedLanguageText}</p>
            </div>
        </div>
    )
}

export default CityPage;