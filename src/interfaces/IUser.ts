export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
}

export interface IUserInputDTO {
  name: string;
  email: string;
  password: string;
}
export interface IDeliveryInputDTO {
  postalCode:string
  products:[ 
    productId: string,
    name: string,
    DeliveryDays: [string],
    ProductType: string,
    DaysInAdvance: number,
  ]
 
}

