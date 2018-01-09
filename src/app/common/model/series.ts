import { Exercise } from './exercise';
import { ProgrammingLanguage } from './programming-language';

export interface ISeries {
  _id: number;
  title: string;
  programmingLanguage: string;
  items: Exercise[];
  authorId: string;
}

export class Series implements ISeries {
  _id: number;

  title: string;
  programmingLanguage = ProgrammingLanguage.typescript.toString();
  items: Exercise[] = [];
  authorId: string;

  constructor(series?: ISeries) {
    if (series) {
      this._id = series._id;
      this.programmingLanguage = series.programmingLanguage;
      this.title = series.title;
      this.authorId = series.authorId;
      for (const item of series.items) {
        this.addItem(item);
      }
    }
  }

  addItem(item: Exercise) {
    this.items.push(item);
    item.sortOrder = this.items.length;
  }

  removeItem(i: number) {
    this.items.splice(i, 1);
    this.items.map((v, index) => (v.sortOrder = index + 1));
  }
}