import { useSettings } from "../components/context/Provider"
import { URLS } from "../constans/constants"
import { API_V2 } from "./axios"

const requesToFailed = (url) => "Request to " + url + " failed!"

class MobileSettingsService {

    static fetchSettings = async() => {
        try {
            const response = await API_V2.get(URLS.settings) 
            return response
        } catch (e) {
            console.log(e)
            console.log(requesToFailed(URLS.settings))
        }
    }

    static fetchLanguages = async() => {
        try {
            const response = await API_V2.get(URLS.languages)
            return response
        } catch(e) {
            console.log(e)
            console.log(requesToFailed(URLS.languages))
        }
    }

}

class CoursesService {

    static fetchData = async() => {

    }
}


export { MobileSettingsService, CoursesService}

