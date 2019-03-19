import { State, Action, StateContext } from '@ngxs/store';
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
        numCardsCachedPerGet: 4,
        useLocalStorage: false,
        useFireStore: false
    }
})
export class SettingsState {
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
