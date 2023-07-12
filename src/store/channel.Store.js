import {makeAutoObservable} from "mobx";
import {useEffect} from "react";
import {http} from "@/utils/http";

class ChannelStore {
    channelList = []
    constructor() {
        makeAutoObservable(this)
    }
    //article publish 都需要用 去公共layout触发
    loadChannelList = async () => {
        const res = await http.get('/channels')
        this.channelList = res.data.channels
    }
}

export default ChannelStore