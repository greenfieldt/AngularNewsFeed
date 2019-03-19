export class NewsAction {
  static readonly type = '[News] Add item';
  constructor(public payload: string) { }
}
