import {describe,beforeEach,afterEach,it,inject,expect} from "jasmine";
import {MockData} from "./test-util/test-util";
import {TOPICS_URL, IRestClient} from "./rest-client-service";
import * as angular from "angular-mocks";


  describe("RestClient", () => {
    var restClient:IRestClient;
    var $httpBackend;
    var tsLibName = "typescripts/lib.d.ts";


    beforeEach(angular.mock.module("core"));

    beforeEach(inject(($injector, RestClient) => {
      restClient = RestClient;
      $httpBackend = $injector.get("$httpBackend");
      $httpBackend.when("GET", tsLibName).respond("lib");
    }));

    describe("getTopic(id)", () => {

      var topic = MockData.getTopic();
      var testID = topic._id;

      beforeEach(()  => {
        var expectedUrl = TOPICS_URL + testID;
        $httpBackend.when("GET", expectedUrl).respond(topic);
        $httpBackend.expectGET(expectedUrl);
      });

      afterEach(()  => {
        $httpBackend.flush();
      });

      it("should return a topic with the correct attributes", () => {
        var topicPromise = restClient.getTopic(testID);
        topicPromise.then(
          (data) => {
            expect(data).toEqual(topic);
          }
        );
      });


      describe("Topic Cache", () => {

        it("Topic should change if the cache is not cleared", () => {
          var topicPromise = restClient.getTopic(testID);
          topicPromise.then(
            (data) => {
              data.title = "New Title";
              restClient.getTopic(testID).then((data) => {
                expect(data.title).not.toEqual(topic.title);
              });
            }
          );
        });

        it("Topic should not change if the cache is cleared", () => {
          var topicPromise = restClient.getTopic(testID);
          topicPromise.then(
            (data) => {
              data.title = "New Title";
              restClient.clearCachedTopic();
              restClient.getTopic(testID).then((data) => {
                expect(data.title).toEqual(topic.title);
              });
            }
          );
        });
      });

    });

    describe("getExercise", () => {

      var topic = MockData.getTopic();

      it("should return an exercise with the correct attributes", () => {
        var expectedUrl = TOPICS_URL + topic._id;
        var exercise = topic.items[0];
        $httpBackend.when("GET", expectedUrl).respond(topic);
        $httpBackend.expectGET(expectedUrl);
        var exercisePromise = restClient.getExercise(topic._id, exercise.sortOrder);
        exercisePromise.then(
          (data) => {
            expect(data).toEqual(exercise);
          }
        );
        $httpBackend.flush();
      });
    });

    it("should return the typescript default library ", () => {
      $httpBackend.expectGET(tsLibName);
      var libPromise = restClient.getLib(tsLibName);

      libPromise.then(
        (lib) => {
          expect(lib.content).toBe("lib");
          expect(lib.name).toBe(tsLibName);
        }
      );
      $httpBackend.flush();
    });

    it("should return an Array with the typescript default library ", () => {
      $httpBackend.expectGET(tsLibName);
      var libsPromise = restClient.getLibs([tsLibName]);

      libsPromise.then(
        (libs) => {
          expect(libs.length).toBe(1);
          expect(libs[0].content).toBe("lib");
          expect(libs[0].name).toBe(tsLibName);
        }
      );
      $httpBackend.flush();
    });

    describe("createTopic", () => {

      var topic = MockData.getTopic();

      it("should store a topic", () => {
        $httpBackend.expectPOST(TOPICS_URL);
        $httpBackend.whenPOST().respond(200);
        restClient.createTopic(topic);
        $httpBackend.flush();
      });
    });

  });
