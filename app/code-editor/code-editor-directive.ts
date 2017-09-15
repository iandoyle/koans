import {ICodeEditorModel} from "./code-editor-controller";
import * as angular from "angular";

export interface ICodeEditorScope extends ng.IScope {
    language:string;
    hiddenText?:string;
    libsLoader:Function;
    onError:Function;
    onSuccess:Function;
    codeEditor:ICodeEditorModel;
    handleEditorChange:Function;
}


declare const require:any;

  /**
   * @ngdoc directive
   * @name exercise.directive:codeEditor
   * @restrict E
   * @element
   *
   * @description A code editor which allows setting
   * language, compiling with the correct worker, running the code, error and success callback
   *
   * @example
   <example module="codeEditor">
   <file name="index.html">
   <code-editor></code-editor>
   </file>
   </example>
   *
   */
  export const codeEditorDirective = ()=> {
      return {
        restrict: "E",
        scope: {
          language: "=",
          libsLoader: "&libsLoader",
          onError: "&onError",
          onSuccess: "&onSuccess",
          hiddenText: "=?"
        },
        require: "ngModel",
        template: require("./code-editor.tpl"),
        controllerAs: "codeEditor",
        controller: "CodeEditorCtrl",
        link: function (scope:ICodeEditorScope, el, attrs, ngModelCtrl:ng.INgModelController) {
          ngModelCtrl.$render = () => {
            var editor:any= scope.codeEditor.editor;
            editor.setValue(ngModelCtrl.$viewValue || "");
          };

          scope.handleEditorChange = (editor:any) => {
            ngModelCtrl.$setViewValue(editor.getValue());
          };

          scope.$watch("language", (newValue:string) => {
            scope.codeEditor.editor.getSession().setMode("ace/mode/" + newValue);
            scope.codeEditor.load(scope.codeEditor.editor);
          });
        }
      };
    };
