import { useSettings } from "../components/context/Provider"
import { URLS } from "../constans/constants"
import { API_V2 } from "./axios"

class MobileSettingsService {

    static fetchSettings = async() => {
        try {
            console.log("SETTINGS : ")
            const response = await API_V2.get(URLS.mobileSettings) 
            console.log(response.data)
            return response
        } catch (error) {
            console.log(error)
        }
    }

}

class CoursesService {

    static fetchData = async() => {

    }
}


export { MobileSettingsService, CoursesService}

