import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetNumCardsCachedPerGet, SetNumCardsPerPage, SetUseLocalStorage, SetUseFireStore } from './settings.actions';

export interface SettingsStateModel {
    numCardsPerPage: number;
    numCardsCachedPerGet: number;
    useLocalStorage: boolean;
    useFireStore: boolean;
}

@State<SettingsStateModel>({
    name: 'settings',
    defaults: {
        numCardsPerPage: 4,
        numCardsCachedPerGet: 50,
        useLocalStorage: false,
        useFireStore: false
    }
})
export class SettingsState {
    @Selector() public static getCacheSize(state: SettingsStateModel): number {
        return state.numCardsCachedPerGet;
    }


    @Action(SetNumCardsPerPage)
    setNumCardsPerPage(ctx: StateContext<SettingsStateModel>, action: SetNumCardsPerPage) {
        const state = ctx.getState();
        ctx.patchState({ numCardsPerPage: action.payload });
    }

    @Action(SetNumCardsCachedPerGet)
    setNumCardsCachedPerGet(ctx: StateContext<SettingsStateModel>, action: SetNumCardsCachedPerGet) {
        const state = ctx.getState();
        ctx.patchState({ numCardsCachedPerGet: action.payload });
    }

    @Action(SetUseLocalStorage)
    setUseLocalStorage(ctx: StateContext<SettingsStateModel>, action: SetUseLocalStorage) {
        const state = ctx.getState();
        ctx.patchState({ useLocalStorage: action.payload });
    }

    @Action(SetUseFireStore)
    setUseFireStore(ctx: StateContext<SettingsStateModel>, action: SetUseFireStore) {
        const state = ctx.getState();
        ctx.patchState({ useFireStore: action.payload });
    }

}
