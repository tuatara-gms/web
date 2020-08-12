# CocRadio

## Props

<!-- @vuese:CocRadio:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|labeled|-|`Boolean`|`false`|-|
|labelStatusClasses|-|`Object`|`false`|{"mount":"coc-content-text","focus":"coc-primary-text","success":"coc-success-shade-3-text","error":"coc-error-shade-3-text"}|
|value|-|`String` /  `Number` /  `Array` /  `Object`|`false`|{"val":"","control":{},"meta":{}}|
|label|-|`String` /  `Number` /  `Array`|`false`|-|
|multiple|-|`Boolean`|`false`|-|
|disabled|-|`Boolean`|`false`|-|
|clearable|-|`Boolean`|`false`|-|
|placeholder|-|`String`|`false`|Select|
|filterable|-|`Boolean`|`false`|-|
|filterMethod|-|`Function`|`false`|-|
|remoteMethod|-|`Function`|`false`|-|
|loading|-|`Boolean`|`false`|-|
|loadingText|-|`String`|`false`|-|
|size|-|—|`false`|default|
|labelInValue|-|`Boolean`|`false`|-|
|notFoundText|-|`String`|`false`|-|
|placement|-|—|`false`|bottom-start|
|transfer|-|`Boolean`|`false`|-|
|type|-|`String`|`false`|-|
|cocOptions|-|`Boolean`|`false`|-|
|autoComplete|Use for AutoComplete|`Boolean`|`false`|-|
|name|-|`String`|`false`|-|
|elementId|-|`String`|`false`|-|
|icon|Coc Special Attributes|`String`|`false`|ios-code|
|data|-|`Array`|`false`|[]|
|scope|-|`Array`|`false`|[]|
|rules|-|`Object` /  `Function`|`false`|-|
|disablePlaceholderErrors|-|`Boolean`|`false`|-|
|statusClasses|-|`Object`|`false`|{}|
|lightModel|-|`Boolean`|`false`|-|
|allowAutocomplete|autocomplete|`Boolean`|`false`|-|
|autocompleteRemote|-|`Object` /  `Function`|`false`|-|
|autocompleteMapResponse|-|`Function`|`false`|(res, val) => res|
|autocompleteFetchOnce|-|`Boolean`|`false`|-|
|autocompletePreventDebounce|-|`Boolean`|`false`|-|
|autocompleteDebouncedTime|-|`Number`|`false`|500|
|autocompleteDebouncedOptions|-|`Object`|`false`|{"maxWait":1000}|
|hideStatus|-|`Boolean`|`false`|-|
|hideErrors|-|`Boolean`|`false`|-|
|border|-|`Boolean`|`false`|-|

<!-- @vuese:CocRadio:props:end -->


## Events

<!-- @vuese:CocRadio:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|input|-|-|
|coc-focus|-|-|
|coc-blur|-|-|
|coc-autocomplete-success|-|-|
|coc-autocomplete-error|-|-|

<!-- @vuese:CocRadio:events:end -->


## Slots

<!-- @vuese:CocRadio:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|error|-|-|
|error|-|-|

<!-- @vuese:CocRadio:slots:end -->


