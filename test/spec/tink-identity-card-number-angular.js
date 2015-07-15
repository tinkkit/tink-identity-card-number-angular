'use strict';
describe('tink-indentity-card-number-angular', function() {

  var bodyEl = $('body'), sandboxEl;
  var $compile, $templateCache, scope;

  beforeEach(module('tink.identitycardnumber'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    bodyEl.html('');
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo(bodyEl);
  }));

  afterEach(function() {
    scope.$destroy();
    sandboxEl.remove();
  });

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, angular.copy(template.scope || templates['default'].scope), locals);
    var element = $(template.element).appendTo(sandboxEl);
    element = $compile(element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

  function triggerInput(el,key){
      $(el).focus();
      for(var i =0; i< key.length;i++){
        var e = jQuery.Event('keypress');
        e.which = key.charCodeAt(i);
        $(el).trigger(e);
      }
    }

    function triggerKeycode(el,code){
      $(el).focus();
        var e = jQuery.Event('keydown');
        e.which = code;
        $(el).trigger(e);
    }

    function unwrap(element){
      var emptyStateValue = element.find('.faux-input').clone()
      emptyStateValue.find('span').contents().unwrap();
      return emptyStateValue.html();
    }

  var templates = {
    'default': {
      scope: {},
      element: '<tink-identity-number required="required" name="nationalNoField" data-ng-model="nationalNoModel"></tink-national-number>'
    }
  };
  var placeholder = 'xxx-xxxxxxx-xx';

  describe('default', function() {
    it('empty should have placeholder',function(){
      var element = compileDirective('default');

      var ctrlValue = angular.element(element).isolateScope().ctrl.getValue();
      var emptyStateValue = element.find('span.placeholder').html();

      expect(ctrlValue).toBe(placeholder);
      expect(emptyStateValue).toBe(placeholder);
    });

    it('when entering 1 schould change placeholder',function(){
      var element = compileDirective('default');
      triggerInput(element.find('.faux-input'),'1');
      scope.$digest();
      var ctrlValue = angular.element(element).isolateScope().ctrl.getValue();

      placeholder = '1xx-xxxxxxx-xx';

      var emptyStateValue = element.find('.faux-input').clone()
      emptyStateValue.find('span').contents().unwrap();
      emptyStateValue = emptyStateValue.html()

      expect(ctrlValue).toBe(placeholder);
      expect(emptyStateValue).toBe(placeholder);
    });

    it('when removing 1 should have placeholder',function(){
      var element = compileDirective('default');
      triggerInput(element.find('.faux-input'),'1');
      scope.$digest();

      placeholder = '1xx-xxxxxxx-xx';

      //get tje data of the element
      var ctrlValue = angular.element(element).isolateScope().ctrl.getValue();
      var emptyStateValue = unwrap(element);

      expect(ctrlValue).toBe(placeholder);
      expect(emptyStateValue).toBe(placeholder);

      //backspace keycode
      triggerKeycode(element.find('.faux-input'),8);

      placeholder = 'xxx-xxxxxxx-xx';

      //Get the data of the element
      ctrlValue = angular.element(element).isolateScope().ctrl.getValue();
      emptyStateValue = unwrap(element);

      expect(ctrlValue).toBe(placeholder);
      expect(emptyStateValue).toBe(placeholder);

    });

    it('when adding a letter do nothing',function(){
      var element = compileDirective('default');
      triggerInput(element.find('.faux-input'),'abc@&é§èçà\'\"(defghjikl*¨/?+?./NBcxvhkx');
      scope.$digest();

      //get tje data of the element
      var ctrlValue = angular.element(element).isolateScope().ctrl.getValue();
      var emptyStateValue = unwrap(element);

      expect(ctrlValue).toBe(placeholder);
      expect(emptyStateValue).toBe(placeholder);
    });

    it('when adding wrong format error',function(){
      var element = compileDirective('default');
      triggerInput(element.find('.faux-input'),'12252023365');
      element.find('.faux-input').blur();
      scope.$digest();      
      expect(element.isolateScope().ctrl.ngControl.$error.format).toBe(true);
    });

    it('when adding good format',function(){
      var element = compileDirective('default');
      triggerInput(element.find('.faux-input'),'591889909226');
      element.find('.faux-input').blur();
      scope.$digest();      
      expect(element.isolateScope().ctrl.ngControl.$error.format).toBe(undefined);
    });
  });


});