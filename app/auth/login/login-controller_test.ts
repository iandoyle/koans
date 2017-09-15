import {describe,beforeEach,afterEach,it,inject,expect} from "jasmine";
import * as angular from "angular-mocks";
import * as sinon from "sinon";
import {LoginCtrl} from "./login-controller";
import {IAuthService} from "../auth-service";

module auth.login {
  "use strict";

  describe("LoginCtrl", function() {
    var ctrl:LoginCtrl;
    var loginSpy;
    var deferred;

    beforeEach(angular.mock.module("auth.login"));

    beforeEach(inject(($controller, $q:ng.IQService) => {

      loginSpy = sinon.spy();
      deferred = $q.defer();

      const mockAuthService:IAuthService = {
        signUp: () => null,
        logout: () => undefined,
        isLoggedIn: () => false,
        getLoggedInUser: ()=>null,
        login: (email:string, password:string):ng.IPromise<void> => {
          loginSpy(email, password);
          deferred.reject();
          return deferred.promise;
        }
      };

      ctrl = $controller("LoginCtrl",
        {
          AuthService: mockAuthService
        });

    }));

    it("should have an empty email and empty password initially", ()  => {
      expect(ctrl.email).toBe(null);
      expect(ctrl.password).toBe(null);
    });

    describe("submit", () => {

      it("should call login once", ()  => {
        ctrl.email = "testEmail";
        ctrl.password = "testPwd";
        ctrl.submit();
        sinon.assert.calledOnce(loginSpy);
        sinon.assert.calledWith(loginSpy, "testEmail", "testPwd");
      });

    });

  });
}
