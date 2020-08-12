
# CocInput

`coc-input` is the modefied version of iView `i-input` component, This component is fully compatible with `coc-forms` concept.

## Props

<!-- @vuese:CocInput:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|labeled|Adds a label above the input field that includes placeholder, icon or errors including thier icons.|`Boolean`|`false`|-|
|labelStatusClasses|Classes to be added to label on different statuses (focus, error, success, mount) and other fixed classes.|`Object`|`false`|-|
|iconStatusClasses|Classes to be added to icon on different statuses (focus, error, success, mount) and other fixed classes.|`Object`|`false`|-|
|trim|Trims the extra whitespaces on user's value.|`Boolean`|`false`|-|
|atom|Special props to be binded to `coc-atom`, check `coc-atom` component.|`Object`|`false`|-|
|type|Input Type (like iView) [text, textarea, password,...etc]|—|`false`|text|
|value|-|`String` /  `Number` /  `Object`|`false`|{"val":"","control":{},"meta":{}}|
|size|Input size (like iView) expects :small, large, default.|—|`false`|default|
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
|label|Custom Label|`String` /  `Number`|`false`|-|
|data|Autocomplete fixed data to be used as options.|`Array`|`false`|[]|
|filterMethod|-|`Function` /  `Boolean`|`false`|-|
|placement|-|—|`false`|bottom|
|transfer|-|`Boolean`|`false`|-|
|scope|coc forms scope, an array of text value that at least one of them should match your coc-button submit button to be validated.|`Array`|`false`|[]|
|rules|-|`Object` /  `Function`|`false`|-|
|disablePlaceholderErrors|-|`Boolean`|`false`|-|
|statusClasses|Classes to be added to input filed (input) and the containing div (container) on different statuses (focus, error, success, mount) and other fixed classes.|`Object`|`false`|-|
|lightModel|Removes control and meta from v-model prototype|`Boolean`|`false`|-|
|allowAutocomplete|enables autocomplete|`Boolean`|`false`|-|
|autocompleteRemote|enables and declares remote data requesting, the object  expects `coc-axios` props, eg: `model => ({ url: '/api/data', query: { q: model.meta.query } })`|`Object` /  `Function`|`false`|-|
|autocompleteMapResponse|expects map function parameter to resolve data fron the remote response, eg; `res => res.items.map(item => item.name)`|`Function`|`false`|(res, val) => res|
|autocompleteFetchOnce|Makes the remote fetching only happens on mount|`Boolean`|`false`|-|
|autocompletePreventDebounce|Prevents debounce handling (so it will fetch on every single input).|`Boolean`|`false`|-|
|autocompleteDebouncedTime|Autocomplete Debounce time, check `Lodash debounce`.|`Number`|`false`|500|
|autocompleteDebouncedOptions|Autocomplete Debounce options, check `Lodash debounce`.|`Object`|`false`|{"maxWait":1000}|
|filters|-|`String` /  `Function` /  `Array`|`false`|-|
|hideStatus|Hides success, error and focus status.|`Boolean`|`false`|-|
|hideErrors|Hides `coc-validator` error messages.|`Boolean`|`false`|-|

<!-- @vuese:CocInput:props:end -->


## Events

<!-- @vuese:CocInput:events:start -->
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
|`event`|-|-|

<!-- @vuese:CocInput:events:end -->


## Slots

<!-- @vuese:CocInput:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|error|-|-|
|prepend|-|-|
|suffix|-|-|
|append|-|-|
|prefix|-|-|
|default|-|-|
|prepend|-|-|
|suffix|-|-|
|append|-|-|
|prefix|-|-|
|error|-|-|

<!-- @vuese:CocInput:slots:end -->


