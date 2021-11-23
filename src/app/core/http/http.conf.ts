import { environment } from '../../../environments/environment';

export class HttpConf {
  public static REST_API = environment.root;


  public static URL = {
    auth: `${HttpConf.REST_API}/login`,
    login_customer: `${HttpConf.REST_API}/login-customer`,
    registration: `${HttpConf.REST_API}/register`,
    users: `${HttpConf.REST_API}/users`,
    customers: `${HttpConf.REST_API}/customers`,
    tasks: `${HttpConf.REST_API}/tasks`,
    test: `${HttpConf.REST_API}/register`,

  };

}
