import { DOMAIN, URLS } from "../constans/constants"
import { API_V2 } from "./axios"

class MobileSettingsService {

    static fetchSettings = async() => {
        console.log("fetchSettings")
        try {
            const response = await API_V2.get(URLS.mobileSettings) 
            console.log("SETTINGS : " , response.data)
            return response
        } catch (error) {
            console.error(error)
        }
    }

}

class CoursesService {

    static fetchData = async() => {

    }
}


export { MobileSettingsService, CoursesService}

