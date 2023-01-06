import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  cartItems: CartItem[] = [];

  // Subject is a subclass of Observable
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;
  // storage: Storage = localStorage;

  constructor() { 

    // read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems')!); 

    if (data != null){
      this.cartItems = data;

      // compute totals based on the data that is read from storage
      this.computeCartTotals();
    }
  }


  addToCart(theCartItem: CartItem){

    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if (this.cartItems.length>0){
      //find the item in the cart based on iem id

      // this is the old way
      // for (let tempCartItem of this.cartItems){
      //   if (tempCartItem.id === theCartItem.id){
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }

      //the new way
      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id)!;

     //check if we found it

     alreadyExistsInCart = (existingCartItem!=undefined);
    }

     if (alreadyExistsInCart){
      existingCartItem.quantity++;
     }

     else{
      // just add the item to the array
      this.cartItems.push(theCartItem);
     }

     //compute cart total price and total quantity
     this.computeCartTotals();
    }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    
    for (let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity*currentCartItem.unitPrice;
      totalQuantityValue +=currentCartItem.quantity;
    }

    

    // publish the new values ... all subscribers will receive the new data
    // .next is the publish/send event
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue,totalQuantityValue);

    // persist cart data
    this.persistCartItems();
    
  }

  persistCartItems(){
    this.storage.setItem('cartItems',JSON.stringify(this.cartItems));
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems){
      const subTotalPrice =tempCartItem.quantity*tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice:${totalPriceValue.toFixed(2)}, totalQuantity:${totalQuantityValue}`);
    console.log('----');
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0){
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id );
    
    // if found, remove the item from the array at the given index
    if (itemIndex > -1){
      this.cartItems.splice(itemIndex,1);

      this.computeCartTotals();
    }

  }
}
