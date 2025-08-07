export class Storage {
  constructor(type, subtype, items = []) {
    this.type = type;
    this.subtype = subtype;
    this.items = items;
  }
}
