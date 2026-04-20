export class CartItem {

  constructor(
    public id?: string,
    public name?: string,
    public imageUrl?: string,
    public unitPrice?: number,
    public unitsInStock: number = 0,
    public quantity: number = 1
  ) {}

}