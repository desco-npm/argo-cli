import "reflect-metadata"
import {createConnection,} from "typeorm"

export default () => {
  return createConnection().catch(error => console.log(error))
}