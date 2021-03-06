import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User, UserManager, Log } from 'oidc-client';
import 'rxjs/add/observable/fromPromise';

const config: any = {
  authority: 'http://localhost:5000',
  client_id: 'sales',
  redirect_uri: 'http://localhost:4200/login-callback',
  response_type: 'id_token token',
  scope: 'openid profile salesapi',
  post_logout_redirect_uri: 'http://localhost:4200/index.html',
};
Log.logger = console;
Log.level = Log.DEBUG;

@Injectable()
export class AuthService implements OnInit {

  private manager: UserManager = new UserManager(config);
  public loginStatusChanged: EventEmitter<User>;

  constructor() {
    this.loginStatusChanged = new EventEmitter();
  }

  ngOnInit() {

  }

  login() {
    this.manager.signinRedirect();
  }

  loginCallBack() {
    return Observable.create(observer => {
      Observable.fromPromise(this.manager.signinRedirectCallback())
        .subscribe((user: User) => {
          this.loginStatusChanged.emit(user);
          observer.next(user);
          observer.complete();
        });
    });
  }

  checkUser() {
    this.tryGetUser().subscribe((user: User) => {
      this.loginStatusChanged.emit(user);
    }, e => {
      this.loginStatusChanged.emit(null);
    });
  }

  tryGetUser() {
    return Observable.fromPromise(this.manager.getUser());
  }

  logout() {
    this.manager.signoutRedirect();
  }
}
