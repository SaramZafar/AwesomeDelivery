import { Service, Inject } from 'typedi';
import { IDeliveryInputDTO } from '@/interfaces/IUser'
import moment from 'moment';
import bigDecimal from 'js-big-decimal'

@Service()
export default class UserService {
  constructor() {
  }

  public async GetDates(deliveryDetails: IDeliveryInputDTO): Promise<any[]> {
    return new Promise<string[]>((resolve, reject) => {

      //Initializing dates
      let today = moment().utc().endOf('day').unix();
      let deliveryDates = []
      let last = bigDecimal.add(today, 1209600)

      deliveryDetails.products.map((elem: any) => {
        //Check if product type is external
        if (elem.ProductType === 'external' && elem.DaysInAdvance < 5) {
          return false
        }

        //Calculating 
        let advanceDays = bigDecimal.multiply(elem.DaysInAdvance, 86400)
        last = bigDecimal.subtract(last, advanceDays)
        let diffDays = bigDecimal.subtract(last, today)

        //check if product type is temporary      
        let number_of_days: number = (elem.ProductType === 'temporary') ? 7 - moment().weekday()
          : Number(bigDecimal.divide(diffDays, 86400, 0))

        for (let i = 1; i <= number_of_days; i++) {

          let deliveryDay = moment().add(i + ((elem.ProductType === 'temporary') ? 0 : elem.DaysInAdvance), 'days')
          let dayName = moment(deliveryDay).format('dddd')

          elem.DeliveryDays.map((e) => {
            if (e == dayName) {

              let day = deliveryDay.format('YYYY-MM-DD')
              if (!deliveryDates.find(element => element.date === day)) {
                deliveryDates.push({
                  postalCode: deliveryDetails.postalCode,
                  date: day
                }
                )
              }

            }
          })
        }
      })

      for (let i = 0; i < deliveryDates.length; i++) {

        //Inner pass
        for (let j = 0; j < deliveryDates.length - i - 1; j++) {

          //Value comparison using ascending order

          if (moment.utc(deliveryDates[j + 1].date) > moment.utc(deliveryDates[j].date)) {

            //Swapping
            let temp = deliveryDates[j + 1].date
            deliveryDates[j + 1].date = deliveryDates[j].date
            deliveryDates[j].date = temp

          }
        }
      };

      resolve(deliveryDates)
    })
  }
}

