import {EditMark, CustomAnnotation} from "./edit-mark-service";
import * as angular from "angular";

  /**
   * @ngdoc directive
   * @name codeEditor.directive:sameAsExceptMark
   * @restrict A
   *
   * @description Validates that two values are the same disregarding the edit-mark.
   * Only the edit-mark and whitespace around it may be changed.
   * Sets a validation error and annotations to the code editor, in case of an error.
   *
   * @example
   <example module="codeEditor">
   <file name="index.html">
   <code-editor same-as-except-edit-mark="other"></code-editor>
   </file>
   </example>
   *
   */
export const sameAsExceptEditMarkDirective =  (editMark:EditMark):ng.IDirective => {
      return {
        restrict: "A",
        require: ["^codeEditor", "ngModel"],
        link: (scope:ng.IScope, elm:JQuery, attrs:ng.IAttributes, controllers:any[]) => {
          const ngModel = controllers[1];
          const editor:any = controllers[0].editor;
          const session = editor.getSession();


          const otherModel = attrs["sameAsExceptEditMark"];
          ngModel.$validators["sameAsExceptEditMark"] = (value) => editMark.hasOnlyMarkChanged(scope.$eval(otherModel), value);

          // trigger validation when other model value specified in attrs.sameAs is changed
          scope.$watch(otherModel, ngModel.$validate);


          const errorText = "Do not change anything other than " + editMark.mark + "!";
          const getMarkers = ():any[] => {
            const changed = editMark.hasOnlyMarkChanged(scope.$eval(otherModel), session.getValue());
            if (!changed) {
              return [new CustomAnnotation(0, 0, errorText)];
            } else {
              return [];
            }
          };


          let markerAnnotations = [];
          const updateMarkers = () => {
            const newMarkers = getMarkers();
            if (!editMark.equals(newMarkers, markerAnnotations)) {
              markerAnnotations = newMarkers;
              editMark.setAnnotations(newMarkers, session, errorText);
            }
          };

          session.on("changeAnnotation", updateMarkers);

        }
      };
    };
