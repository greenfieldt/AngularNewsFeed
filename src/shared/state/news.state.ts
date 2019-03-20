import { State, Action, StateContext } from '@ngxs/store';
import { NewsAction } from './news.actions';

export class NewsStateModel {
  public items: string[];
}

@State<NewsStateModel>({
  name: 'news',
  defaults: {
    items: []
  }
})
export class NewsState {
  @Action(NewsAction)
  add(ctx: StateContext<NewsStateModel>, action: NewsAction) {
    const state = ctx.getState();
    ctx.setState({ items: [ ...state.items, action.payload ] });
  }
}
