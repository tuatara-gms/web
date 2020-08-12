# CocNumberInput

## Props

<!-- @vuese:CocNumberInput:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|labeled|-|`Boolean`|`false`|-|
|labelStatusClasses|-|`Object`|`false`|{"mount":"coc-content-text","focus":"coc-primary-text","success":"coc-success-shade-3-text","error":"coc-error-shade-3-text"}|
|trim|-|`Boolean`|`false`|-|
|atom|-|`Object`|`false`|-|
|type|-|—|`false`|text|
|value|-|`String` /  `Number` /  `Object`|`false`|{"val":0,"control":{},"meta":{}}|
|size|-|—|`false`|default|
|placeholder|-|`String`|`false`|-|
|maxlength|-|`Number`|`false`|-|
|disabled|-|`Boolean`|`false`|-|
|icon|-|`String`|`false`|-|
|autosize|-|`Boolean` /  `Object`|`false`|-|
|rows|-|`Number`|`false`|2|
|readonly|-|`Boolean`|`false`|-|
|name|-|`String`|`false`|-|
|number|-|`Boolean`|`false`|-|
|autofocus|-|`Boolean`|`false`|-|
|spellcheck|-|`Boolean`|`false`|-|
|autocomplete|-|—|`false`|off|
|clearable|-|`Boolean`|`false`|-|
|elementId|-|`String`|`false`|-|
|wrap|-|—|`false`|soft|
|prefix|-|`String`|`false`|-|
|suffix|-|`String`|`false`|-|
|search|-|`Boolean`|`false`|-|
|enterButton|-|`Boolean` /  `String`|`false`|-|
|label|Autocomplete|`String` /  `Number`|`false`|-|
|data|-|`Array`|`false`|[]|
|filterMethod|-|`Function` /  `Boolean`|`false`|(value, option) => {
  const formattedOption = new optionsFormatter(option).Resolve();
  return formattedOption.label.toUpperCase().indexOf(value.toUpperCase()) !== -1;
}|
|placement|-|—|`false`|bottom|
|transfer|-|`Boolean`|`false`|-|
|scope|Coc Special Attributes|`Array`|`false`|[]|
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
|filters|-|`String` /  `Function` /  `Array`|`false`|-|
|hideStatus|-|`Boolean`|`false`|-|
|hideErrors|-|`Boolean`|`false`|-|
|max|-|`Number`|`false`|-|
|min|-|`Number`|`false`|-|
|step|-|`Number`|`false`|1|
|activeChange|-|`Boolean`|`false`|true|
|precision|-|`Number`|`false`|-|
|formatter|-|`Function`|`false`|-|
|parser|-|`Function`|`false`|-|

<!-- @vuese:CocNumberInput:props:end -->


## Events

<!-- @vuese:CocNumberInput:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|input|-|-|
|coc-submit|-|-|
|coc-focus|-|-|
|coc-blur|-|-|
|coc-select|-|-|
|coc-clear|-|-|
|coc-autocomplete-success|-|-|
|coc-autocomplete-error|-|-|
|coc-enter|-|-|
|filter|-|-|

<!-- @vuese:CocNumberInput:events:end -->


## Slots

<!-- @vuese:CocNumberInput:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|error|-|-|
|prepend|-|-|
|suffix|-|-|
|append|-|-|
|prefix|-|-|
|error|-|-|

<!-- @vuese:CocNumberInput:slots:end -->


