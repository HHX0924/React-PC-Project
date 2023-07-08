import {makeAutoObservable} from "mobx";
import {http} from "@/utils/http";

class UserStore {
    useInfo = {}
    constructor() {
        makeAutoObservable(this)
    }
    getUserInfo = async () => {
        const res = await http.get('/user/profile')
        this.useInfo = res.data
    }
}
export default UserStore