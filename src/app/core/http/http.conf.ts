import { environment } from '../../../environments/environment';

export class HttpConf {
  public static REST_API = environment.root;


  public static URL = {
    auth: `${HttpConf.REST_API}/login`,
    registration: `${HttpConf.REST_API}/register`,
    users: `${HttpConf.REST_API}/users`,
    posts: `${HttpConf.REST_API}/posts`,


  };

}
