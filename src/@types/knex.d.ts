// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    diets: {
      id: string
      name: string
      description: string
      created_at: string
      user_id: string
      is_diet: boolean
      eat_time: string
    }
  }
}
