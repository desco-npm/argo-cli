import "reflect-metadata"
import { createConnection, } from "typeorm"

export default () => {
  return createConnection()
    .then(() => {
      /* CODE HERE */

      console.log('ORM running')
    })
    .catch(error => console.log(error))
}