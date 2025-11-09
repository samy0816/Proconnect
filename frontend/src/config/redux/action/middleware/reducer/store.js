import Authreducer from "./Authreducer";
import Postreducer from "./Postreducer";

import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer:{
        auth:Authreducer,
        post:Postreducer
    }
})

