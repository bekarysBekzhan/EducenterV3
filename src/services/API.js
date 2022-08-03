import { DOMAIN, URLS } from "../constans/constants"
import { API_V2 } from "./axios"

class MobileSettingsService {

    static fetchSettings = async() => {
        const url = DOMAIN + URLS.mobileSettings
        try {
            const response = API_V2.get(url) 
            if (response.status == 200) {
                return response.data
            }
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

