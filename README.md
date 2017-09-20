# WaveLess dreamkiller - basic template

## Extends ##
* Clearfix:  
`@extend %clearfix`

* Vertical align elements inside block:  
`@extend %vertAlign`


## Mixins ##
* CSS position:  
values are: absolute, fixed, relative  
`@include position(absolute, auto, 0, auto, 0)`

* CSS transition:  
`@include transition(all, .2s)`

* CSS transform:  
values are: - all avaliable CSS3 transforms  
`@include transform(args);`

* CSS animation:  
`@include animation($name, $duration: 1000ms, $iterations: infinite, $timing-function: ease, $delay: 0ms);`

* CSS flex-box:  
`@include flex($alignI: center, $justify: space-between,  $direction: row, $wrap: nowrap);`

* CSS Triangle:  
`@include triangle(left, $size: 6px, $color: #222)`

* CSS text ending:  
values are: clip, ellipsis, string  
`@include textEnd($overflow: ellipsis)`

* CSS tooltip:  
`@include tooltip($content: attr(data-tooltip), $direction: top)`