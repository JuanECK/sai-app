import 'dotenv/config';
import { get } from 'env-var'

export const envs = {

    WEBSERVICE_URL: get( 'WEBSERVICE_URL' ).required().asString(),

}