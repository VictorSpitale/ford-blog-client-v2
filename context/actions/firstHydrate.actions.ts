import {createAsyncThunk} from "@reduxjs/toolkit";
import {HydrateStatus} from "../reducers/firstHydrate.reducer";
import {RootState} from "../store";

export const CHANGE_STATUS = "CHANGE_STATUS"

export const changeStatus = createAsyncThunk<HydrateStatus, void, { state: RootState }>(CHANGE_STATUS, (_, {getState}) => {
    const {status} = getState().hydrateStatus
    if (status === HydrateStatus.BEFORE) {
        return HydrateStatus.FIRST
    }
    return HydrateStatus.MORE
})
